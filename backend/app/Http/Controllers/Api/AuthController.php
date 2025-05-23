<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public static function signup(SignupRequest $request) {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ], 201);
    }

    public static function login(LoginRequest $request) {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ], 200);
    }

    public static function logout(Request $request) {
        if ($user = Auth::user()) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}



// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Http\Requests\LoginRequest;
// use App\Http\Requests\SignupRequest;
// use App\Http\Resources\UserResource;
// use App\Models\User;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\DB;

// class AuthController extends Controller
// {
//     public static function signup(SignupRequest $request) {
//         // 2A: Database Connection Check (Add at the very start)
//         try {
//             DB::connection()->getPdo();
//             if (!DB::connection()->getDatabaseName()) {
//                 Log::critical('Database connected but no database selected');
//                 return response()->json(['message' => 'Database configuration error'], 500);
//             }
//         } catch (\Exception $e) {
//             Log::critical('Database connection failed: ' . $e->getMessage());
//             return response()->json(['message' => 'Service unavailable'], 503);
//         }

//         // 2B: Sanctum Check (Add right before token creation)
//         if (!class_exists('Laravel\Sanctum\Sanctum')) {
//             Log::error('Sanctum not installed or configured');
//             return response()->json(['message' => 'Authentication service unavailable'], 500);
//         }

//         // Main signup logic with enhanced logging
//         Log::info('Signup request received', $request->all());

//         try {
//             $data = $request->validated();
//             $data['password'] = Hash::make($data['password']);

//             Log::debug('Attempting user creation with data:', ['email' => $data['email']]); // Don't log full password

//             $user = User::create($data);
//             Log::info('User created successfully', ['user_id' => $user->id]);

//             $token = $user->createToken('auth_token')->plainTextToken;
//             Log::debug('Token generated for user', ['user_id' => $user->id]);

//             return response()->json([
//                 'token' => $token,
//                 'user' => new UserResource($user),
//             ], 201);

//         } catch (\Exception $e) {
//             Log::error('Signup failed: ' . $e->getMessage(), [
//                 'exception' => get_class($e),
//                 'trace' => $e->getTraceAsString()
//             ]);

//             return response()->json([
//                 'message' => 'Registration failed',
//                 'error' => config('app.debug') ? $e->getMessage() : null
//             ], 500);
//         }
//     }

//     public static function login(LoginRequest $request) {
//         // Same database check as in signup
//         try {
//             DB::connection()->getPdo();
//         } catch (\Exception $e) {
//             Log::critical('Database connection failed during login: ' . $e->getMessage());
//             return response()->json(['message' => 'Service unavailable'], 503);
//         }

//         $credentials = $request->validated();

//         if (!Auth::attempt($credentials)) {
//             Log::warning('Login failed for email: ' . $credentials['email']);
//             return response()->json([
//                 'message' => 'Invalid credentials'
//             ], 401);
//         }

//         $user = Auth::user();
//         $token = $user->createToken('auth_token')->plainTextToken;
//         Log::info('User logged in', ['user_id' => $user->id]);

//         return response()->json([
//             'token' => $token,
//             'user' => new UserResource($user),
//         ], 200);
//     }

//     public static function logout(Request $request) {
//         if ($user = Auth::user()) {
//             $user->tokens()->delete();
//             Log::info('User logged out', ['user_id' => $user->id]);
//         }

//         return response()->json([
//             'message' => 'Logged out successfully'
//         ], 200);
//     }
// }


// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Http\Requests\SignupRequest;
// use App\Http\Resources\UserResource;
// use App\Models\User;
// use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Hash;

// class AuthController extends Controller
// {
//     public static function signup(SignupRequest $request)
//     {
//         // Render-specific debug header
//         header('X-Render-Debug: true');

//         // 1. Database connection check
//         try {
//             DB::connection()->getPdo();
//             Log::channel('render')->info('Database connection successful');
//         } catch (\Exception $e) {
//             Log::channel('render')->critical('DB Connection Failed: '.$e->getMessage());
//             return response()->json([
//                 'message' => 'Service unavailable',
//                 'error' => config('app.debug') ? $e->getMessage() : null
//             ], 503);
//         }

//         // 2. Request logging
//         Log::channel('render')->debug('Signup Request Data:', [
//             'email' => $request->email,
//             'ip' => $request->ip()
//         ]);

//         // 3. Main processing
//         try {
//             $data = $request->validated();
//             $data['password'] = Hash::make($data['password']);

//             $user = User::create($data);
//             Log::channel('render')->info('User created', ['user_id' => $user->id]);

//             $token = $user->createToken('auth_token')->plainTextToken;

//             return response()->json([
//                 'token' => $token,
//                 'user' => new UserResource($user),
//             ], 201);

//         } catch (\Exception $e) {
//             // Detailed error logging for Render
//             Log::channel('render')->error('SIGNUP_FAILED', [
//                 'error' => $e->getMessage(),
//                 'trace' => $e->getTraceAsString(),
//                 'request' => $request->except('password')
//             ]);

//             return response()->json([
//                 'message' => 'Registration failed',
//                 'error' => config('app.debug') ? $e->getMessage() : null,
//                 'logged_at' => now()->toDateTimeString()
//             ], 500);
//         }
//     }
// }


// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Http\Requests\SignupRequest;
// use App\Http\Resources\UserResource;
// use App\Models\User;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Schema;
// use Laravel\Sanctum\Sanctum;

// class AuthController extends Controller
// {
//     public function signup(SignupRequest $request)
//     {
//         Log::channel('render')->info('Signup attempt initiated', [
//             'email' => $request->email,
//             'ip' => $request->ip(),
//             'user_agent' => $request->userAgent()
//         ]);

//         // Phase 1: Pre-flight checks
//         try {
//             // 1A. Verify database connection
//             DB::connection()->getPdo();
//             Log::channel('render')->debug('Database connection verified');

//             // 1B. Verify Sanctum availability
//             if (!class_exists(Sanctum::class)) {
//                 throw new \RuntimeException('Sanctum not installed');
//             }

//             // 1C. Verify users table exists
//             if (!Schema::hasTable('users')) {
//                 throw new \RuntimeException('Users table missing');
//             }

//         } catch (\Exception $e) {
//             Log::channel('render')->error('Pre-signup validation failed', [
//                 'error' => $e->getMessage(),
//                 'trace' => $e->getTraceAsString()
//             ]);
            
//             return response()->json([
//                 'message' => 'Service unavailable',
//                 'error' => config('app.debug') ? $e->getMessage() : null,
//                 'timestamp' => now()->toISOString()
//             ], 503);
//         }

//         // Phase 2: Registration processing
//         try {
//             $data = $request->validated();
            
//             // 2A. Manual duplicate check
//             if (User::withTrashed()->where('email', $data['email'])->exists()) {
//                 Log::channel('render')->warning('Duplicate registration attempt', [
//                     'email' => $data['email']
//                 ]);
//                 return response()->json([
//                     'message' => 'Email already registered',
//                     'errors' => ['email' => ['This email is already in use']]
//                 ], 422);
//             }

//             // 2B. Create user
//             $user = User::create([
//                 'name' => $data['name'],
//                 'email' => $data['email'],
//                 'password' => Hash::make($data['password'])
//             ]);

//             // 2C. Generate token
//             $token = $user->createToken('auth_token')->plainTextToken;
            
//             Log::channel('render')->info('User registered successfully', [
//                 'user_id' => $user->id,
//                 'email' => $user->email
//             ]);

//             return response()->json([
//                 'user' => new UserResource($user),
//                 'token' => $token,
//                 'token_type' => 'Bearer'
//             ], 201);

//         } catch (\Illuminate\Validation\ValidationException $e) {
//             Log::channel('render')->warning('Validation failed', [
//                 'errors' => $e->errors(),
//                 'input' => $request->except('password')
//             ]);
//             throw $e;
            
//         } catch (\Exception $e) {
//             Log::channel('render')->error('Registration processing failed', [
//                 'error' => $e->getMessage(),
//                 'trace' => $e->getTraceAsString(),
//                 'input' => $request->except('password')
//             ]);
            
//             return response()->json([
//                 'message' => 'Registration failed',
//                 'error' => config('app.debug') ? [
//                     'message' => $e->getMessage(),
//                     'exception' => get_class($e),
//                     'file' => $e->getFile(),
//                     'line' => $e->getLine()
//                 ] : null,
//                 'timestamp' => now()->toISOString()
//             ], 500);
//         }
//     }
// }