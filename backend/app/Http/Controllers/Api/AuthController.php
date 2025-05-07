<?php

// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Http\Requests\LoginRequest;
// use App\Http\Requests\SignupRequest;
// use App\Http\Resources\UserResource;
// use App\Models\User;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Hash;

// class AuthController extends Controller
// {
//     public static function signup(SignupRequest $request) {
//         $data = $request->validated();
//         $data['password'] = Hash::make($data['password']);

//         $user = User::create($data);
//         $token = $user->createToken('auth_token')->plainTextToken;

//         return response()->json([
//             'token' => $token,
//             'user' => new UserResource($user),
//         ], 201);
//     }

//     public static function login(LoginRequest $request) {
//         $credentials = $request->validated();

//         if (!Auth::attempt($credentials)) {
//             return response()->json([
//                 'message' => 'Invalid credentials'
//             ], 401);
//         }

//         $user = Auth::user();
//         $token = $user->createToken('auth_token')->plainTextToken;

//         return response()->json([
//             'token' => $token,
//             'user' => new UserResource($user),
//         ], 200);
//     }
    
//     public static function logout(Request $request) {
//         if ($user = Auth::user()) {
//             $user->tokens()->delete();
//         }

//         return response()->json([
//             'message' => 'Logged out successfully'
//         ], 200);
//     }
// }



namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public static function signup(SignupRequest $request) {
        // 2A: Database Connection Check (Add at the very start)
        try {
            DB::connection()->getPdo();
            if (!DB::connection()->getDatabaseName()) {
                Log::critical('Database connected but no database selected');
                return response()->json(['message' => 'Database configuration error'], 500);
            }
        } catch (\Exception $e) {
            Log::critical('Database connection failed: ' . $e->getMessage());
            return response()->json(['message' => 'Service unavailable'], 503);
        }

        // 2B: Sanctum Check (Add right before token creation)
        if (!class_exists('Laravel\Sanctum\Sanctum')) {
            Log::error('Sanctum not installed or configured');
            return response()->json(['message' => 'Authentication service unavailable'], 500);
        }

        // Main signup logic with enhanced logging
        Log::info('Signup request received', $request->all());

        try {
            $data = $request->validated();
            $data['password'] = Hash::make($data['password']);

            Log::debug('Attempting user creation with data:', ['email' => $data['email']]); // Don't log full password

            $user = User::create($data);
            Log::info('User created successfully', ['user_id' => $user->id]);

            $token = $user->createToken('auth_token')->plainTextToken;
            Log::debug('Token generated for user', ['user_id' => $user->id]);

            return response()->json([
                'token' => $token,
                'user' => new UserResource($user),
            ], 201);

        } catch (\Exception $e) {
            Log::error('Signup failed: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Registration failed',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public static function login(LoginRequest $request) {
        // Same database check as in signup
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            Log::critical('Database connection failed during login: ' . $e->getMessage());
            return response()->json(['message' => 'Service unavailable'], 503);
        }

        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            Log::warning('Login failed for email: ' . $credentials['email']);
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
        Log::info('User logged in', ['user_id' => $user->id]);

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ], 200);
    }
    
    public static function logout(Request $request) {
        if ($user = Auth::user()) {
            $user->tokens()->delete();
            Log::info('User logged out', ['user_id' => $user->id]);
        }

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}