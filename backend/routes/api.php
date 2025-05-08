<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConnectionController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Cors;
use Illuminate\Support\Facades\DB;

// Apply CORS globally to all routes
Route::middleware([Cors::class])->group(function () {

    // Test endpoint
    Route::post('/test-crash', function (Request $request) {
        // Log directly to stderr (Render captures this)
        file_put_contents('php://stderr', "TEST CRASH ENDPOINT HIT\n");

        try {
            DB::statement('SELECT 1'); // Using the correct DB facade
            file_put_contents('php://stderr', "DATABASE WORKS\n");

            return response()->json([
                'status' => 'success',
                'database' => 'connected',
                'time' => now()->toDateTimeString()
            ]);
        } catch (\Exception $e) {
            file_put_contents('php://stderr', "DATABASE FAILED: " . $e->getMessage() . "\n");

            return response()->json([
                'status' => 'error',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });

    // Public routes
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);

    // Handle OPTIONS requests for all endpoints
    Route::options('/{any}', function () {
        return response()->noContent();
    })->where('any', '.*');

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::post('/logout', [AuthController::class, 'logout']);

        // Users
        Route::apiResource('users', UserController::class)->except(['store']);

        // Posts
        Route::get('/posts/search', [PostController::class, 'search']);
        Route::get('/posts', [PostController::class, 'index']);
        Route::get('/user/posts', [PostController::class, 'myIndex']);
        Route::apiResource('posts', PostController::class)->except(['index']);

        // Connections
        Route::post('/posts/{post}/connections', [ConnectionController::class, 'sendRequest']);
        Route::get('/connections/pending', [ConnectionController::class, 'pendingRequest']);
        Route::post('/connections/{connection}/accept', [ConnectionController::class, 'acceptRequest']);
        Route::post('/connections/{connection}/reject', [ConnectionController::class, 'rejectRequest']);
        Route::get('/connections', [ConnectionController::class, 'userConnections']);
    });
});
