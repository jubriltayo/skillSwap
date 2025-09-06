<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\ConnectionRestriction;
use App\Models\Post;
use App\Http\Resources\ConnectionResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConnectionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Send a connection request to a post owner.
     */
    public function sendRequest(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        // Prevent self-connection
        if ($user->id === $post->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot send a connection request to yourself.',
            ], 400);
        }

        // Check if post is active
        if (!$post->isActive) {
            return response()->json([
                'success' => false,
                'message' => 'This post is no longer active.',
            ], 400);
        }

        // Check for active restriction
        $restriction = $user->getRestrictionForPost($post);
        if ($restriction) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot send another request to this post until ' .
                    $restriction->restricted_until->format('M j, Y g:i A'),
                'restricted_until' => $restriction->restricted_until,
            ], 429);
        }

        // Check for existing connection (any status)
        $existingConnection = Connection::where('sender_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if ($existingConnection) {
            $statusMessages = [
                'pending' => 'You already have a pending request for this post.',
                'accepted' => 'You are already connected to this post owner.',
            ];

            return response()->json([
                'success' => false,
                'message' => $statusMessages[$existingConnection->status] ?? 'Connection already exists.',
                'connection_status' => $existingConnection->status,
            ], 400);
        }

        // Create new connection request
        try {
            $connection = Connection::create([
                'sender_id' => $user->id,
                'receiver_id' => $post->user_id,
                'post_id' => $post->id,
                'status' => 'pending',
            ]);

            $connection->load(['sender', 'receiver', 'post']);

            return response()->json([
                'success' => true,
                'message' => 'Connection request sent successfully.',
                'connection' => new ConnectionResource($connection),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send connection request. Please try again.',
            ], 500);
        }
    }

    /**
     * Accept a connection request.
     */
    public function acceptRequest(Connection $connection): JsonResponse
    {
        $user = auth()->user();

        // Only receiver can accept
        if ($user->id !== $connection->receiver_id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to accept this connection request.',
            ], 403);
        }

        // Check if connection is pending
        if ($connection->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'This connection request is no longer pending.',
                'current_status' => $connection->status,
            ], 400);
        }

        try {
            $connection->update(['status' => 'accepted']);
            $connection->load(['sender', 'receiver', 'post']);

            return response()->json([
                'success' => true,
                'message' => 'Connection request accepted successfully.',
                'connection' => new ConnectionResource($connection),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept connection request. Please try again.',
            ], 500);
        }
    }

    /**
     * Reject a connection request and create restriction.
     */
    public function rejectRequest(Connection $connection): JsonResponse
    {
        $user = auth()->user();

        // Only receiver can reject
        if ($user->id !== $connection->receiver_id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to reject this connection request.',
            ], 403);
        }

        // Check if connection is pending
        if ($connection->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'This connection request is no longer pending.',
                'current_status' => $connection->status,
            ], 400);
        }

        try {
            // Create 24-hour restriction
            ConnectionRestriction::updateOrCreate(
                [
                    'sender_id' => $connection->sender_id,
                    'post_id' => $connection->post_id,
                ],
                [
                    'restricted_until' => now()->addHours(24),
                ]
            );

            // Delete the connection request
            $connection->delete();

            return response()->json([
                'success' => true,
                'message' => 'Connection request rejected successfully.',
                'restriction_until' => now()->addHours(24),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject connection request. Please try again.',
            ], 500);
        }
    }

    /**
     * Get pending connection requests (received by current user).
     */
    public function pendingRequests(Request $request): JsonResponse
    {
        $connections = Connection::with(['sender', 'post'])
            ->where('receiver_id', auth()->id())
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => ConnectionResource::collection($connections),
            'count' => $connections->count(),
        ]);
    }

    /**
     * Get all connections for the current user (sent and received).
     */
    public function userConnections(Request $request): JsonResponse
    {
        $user = $request->user();

        $sentConnections = $user->sentConnections()
            ->with(['receiver', 'post'])
            ->latest()
            ->get();

        $receivedConnections = $user->receivedConnections()
            ->with(['sender', 'post'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'sent' => ConnectionResource::collection($sentConnections),
                'received' => ConnectionResource::collection($receivedConnections),
            ],
            'counts' => [
                'sent_total' => $sentConnections->count(),
                'received_total' => $receivedConnections->count(),
                'sent_pending' => $sentConnections->where('status', 'pending')->count(),
                'received_pending' => $receivedConnections->where('status', 'pending')->count(),
                'accepted' => $sentConnections->where('status', 'accepted')->count() +
                    $receivedConnections->where('status', 'accepted')->count(),
            ],
        ]);
    }

    /**
     * Get accepted connections (people user can communicate with).
     */
    public function acceptedConnections(Request $request): JsonResponse
    {
        $user = $request->user();
        $connections = $user->acceptedConnections()->with(['sender', 'receiver', 'post'])->get();

        return response()->json([
            'success' => true,
            'data' => ConnectionResource::collection($connections),
            'count' => $connections->count(),
        ]);
    }

    /**
     * Cancel a sent connection request (only if pending).
     */
    public function cancelRequest(Connection $connection): JsonResponse
    {
        $user = auth()->user();

        // Only sender can cancel
        if ($user->id !== $connection->sender_id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to cancel this connection request.',
            ], 403);
        }

        // Can only cancel pending requests
        if ($connection->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'You can only cancel pending connection requests.',
                'current_status' => $connection->status,
            ], 400);
        }

        try {
            $connection->delete();

            return response()->json([
                'success' => true,
                'message' => 'Connection request cancelled successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel connection request. Please try again.',
            ], 500);
        }
    }

    /**
     * Get user's active restrictions.
     */
    public function userRestrictions(Request $request): JsonResponse
    {
        $restrictions = $request->user()
            ->connectionRestrictions()
            ->with('post')
            ->active()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $restrictions->map(function ($restriction) {
                return [
                    'id' => $restriction->id,
                    'post_id' => $restriction->post_id,
                    'post_title' => $restriction->post->title,
                    'restricted_until' => $restriction->restricted_until,
                    'expires_in_hours' => $restriction->restricted_until->diffInHours(now()),
                ];
            }),
            'count' => $restrictions->count(),
        ]);
    }
}
