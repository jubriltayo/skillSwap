<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConnectionController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



// Routes only for authenticated users
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Users
    Route::apiResource('users', UserController::class)->except(['store']);

    // Search Posts
    Route::get('/posts/search', [PostController::class, 'search']);
    // Posts
    Route::get('/posts', [PostController::class, 'index']); // all posts
    Route::get('/user/posts', [PostController::class, 'myIndex']); // user posts
    Route::apiResource('posts', PostController::class)->except(['index']); // user CUD posts
    
    // Connections
    Route::post('/posts/{post}/connections', [ConnectionController::class, 'sendRequest']);
    Route::get('/connections/pending', [ConnectionController::class, 'pendingRequest']);
    Route::post('/connections/{connection}/accept', [ConnectionController::class, 'acceptRequest']);
    Route::post('/connections/{connection}/reject', [ConnectionController::class, 'rejectRequest']);
    Route::get('/connections', [ConnectionController::class, 'userConnections']);
    
});


// Routes for Guests/Unauthenticated users
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
