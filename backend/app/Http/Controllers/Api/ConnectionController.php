<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Connection;
use App\Models\Post;
use Illuminate\Http\Request;

class ConnectionController extends Controller
{
    public function sendRequest(Request $request, Post $post)
    {
        // Prevent self-connection
        if ($request->user()->id === $post->user_id) {
            return response()->json([
                'error' => 'You cannot send a connection request to yourself.',
            ], 400);
        }

        // Prevent duplicate requests
        if (Connection::where('sender_id', $request->user()->id)
            ->where('post_id', $post->id)
            ->exists()
        ) {
            return response()->json([
                'error' => 'Already connected',
            ], 400);
        }

        // Create a new connection
        $connection = Connection::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $post->user_id,
            'post_id' => $post->id,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
        ], 201);
    }

    public function acceptRequest(Connection $connection)
    {
        // Only receiver can accept
        if (auth()->id() !== $connection->receiver_id) {
            return response()->json([
                'error' => 'You are not authorized to accept this connection request.',
            ], 403);
        }

        $connection->update(['status' => 'accepted']);

        return response()->json([
            'success' => true,
        ], 201);
    }

    public function rejectRequest(Request $request, Connection $connection)
    {
        // Only receiver can reject
        if (auth()->id() !== $connection->receiver_id) {
            return response()->json([
                'error' => 'You are not authorized to accept this connection request.',
            ], 403);
        }

        $connection->delete();

        return response()->json([
            'success' => true,
        ], 201);
    }

    public function pendingRequest(Request $request)
    {
        $connections = Connection::with(['sender:id,name,skills_offered', 'post:id,title,description'])
            ->where('receiver_id', auth()->id())
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json($connections);
    }

    public function userConnections(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'sent' => $user->sentConnections()->with('receiver', 'post')->get(),
            'received' => $user->receivedConnections()->with('sender', 'post')->get(),
        ]);
    }
}
