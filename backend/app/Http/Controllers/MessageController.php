<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index($connectionId)
    {
        Log::info('Fetching messages', [
            'user_id' => Auth::id(),
            'connection_id' => $connectionId
        ]);

        $user = Auth::user();

        // Verify user has access to this connection
        $connection = Connection::where(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id);
        })->findOrFail($connectionId);

        $messages = $connection->messages()->with('sender')->get();

        Log::info('Messages found', [
            'connection_id' => $connectionId,
            'message_count' => $messages->count()
        ]);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    public function store(Request $request, $connectionId)
    {
        Log::info('Storing new message', [
            'user_id' => Auth::id(),
            'connection_id' => $connectionId,
            'message_length' => strlen($request->message)
        ]);

        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $user = Auth::user();

        $connection = Connection::where(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->orWhere('receiver_id', $user->id);
        })->where('status', 'accepted')
            ->findOrFail($connectionId);

        $message = Message::create([
            'connection_id' => $connectionId,
            'sender_id' => $user->id,
            'message' => $request->message,
        ]);

        // Load sender relationship for frontend
        $message->load('sender');

        Log::info('Message created successfully', [
            'message_id' => $message->id,
            'connection_id' => $connectionId
        ]);

        return response()->json([
            'success' => true,
            'data' => $message
        ]);
    }
}
