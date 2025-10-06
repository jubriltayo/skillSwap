<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ConnectionController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

// Public routes (no authentication required)
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Public endpoints 
Route::get('/posts', [PostController::class, 'index']); // all posts
Route::get('/posts/search', [PostController::class, 'search']); // search posts
Route::get('/posts/{post}', [PostController::class, 'show']); // single post
Route::get('/users', [UserController::class, 'index']); // all users
Route::get('/users/{user}', [UserController::class, 'show']); // single user
Route::get('/users/search', [UserController::class, 'search']);
Route::get('/users/{user}/connection-count', [UserController::class, 'connectionCount']);

// Routes only for authenticated users
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refresh']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    // Users Management (only update and delete need auth)
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::put('/users/{user}/skills', [UserController::class, 'updateSkills']);
    Route::post('/users/{user}/avatar', [UserController::class, 'updateAvatar']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    // Posts Management (authenticated operations)
    Route::get('/user/posts', [PostController::class, 'myIndex']); // current user's posts
    Route::get('/user/stats', [PostController::class, 'stats']); // user dashboard stats
    Route::post('/posts', [PostController::class, 'store']); // create
    Route::put('/posts/{post}', [PostController::class, 'update']); // update
    Route::patch('/posts/{post}/toggle-status', [PostController::class, 'toggleStatus']); // toggle active/inactive
    Route::delete('/posts/{post}', [PostController::class, 'destroy']); // delete

    // Connection Management
    Route::post('/posts/{post}/connections', [ConnectionController::class, 'sendRequest']);
    Route::get('/connections/pending', [ConnectionController::class, 'pendingRequests']);
    Route::get('/connections/accepted', [ConnectionController::class, 'acceptedConnections']);
    Route::get('/connections', [ConnectionController::class, 'userConnections']);
    Route::get('/connections/restrictions', [ConnectionController::class, 'userRestrictions']);

    // Connection Actions
    Route::post('/connections/{connection}/accept', [ConnectionController::class, 'acceptRequest']);
    Route::post('/connections/{connection}/reject', [ConnectionController::class, 'rejectRequest']);
    Route::delete('/connections/{connection}/cancel', [ConnectionController::class, 'cancelRequest']);
});
