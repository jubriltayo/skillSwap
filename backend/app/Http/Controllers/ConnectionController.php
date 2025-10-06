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
        if (!$post->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'This post is no longer active.',
            ], 400);
        }

        // Check for active restriction
        if ($user->isRestrictedFromPost($post)) {
            $restriction = $user->getRestrictionForPost($post);
            return response()->json([
                'success' => false,
                'message' => 'You cannot send another request to this post until ' .
                    $restriction->restricted_until->format('M j, Y g:i A'),
                'restricted_until' => $restriction->restricted_until,
            ], 429);
        }

        // Check if users are already connected (accepted connection exists)
        $existingAcceptedConnection = Connection::where('status', 'accepted')
            ->where(function ($query) use ($user, $post) {
                $query->where(function ($q) use ($user, $post) {
                    $q->where('sender_id', $user->id)
                        ->where('receiver_id', $post->user_id);
                })
                    ->orWhere(function ($q) use ($user, $post) {
                        $q->where('sender_id', $post->user_id)
                            ->where('receiver_id', $user->id);
                    });
            })
            ->first();

        if ($existingAcceptedConnection) {
            return response()->json([
                'success' => false,
                'message' => 'You are already connected with this user.',
                'connection_status' => 'accepted',
            ], 400);
        }

        // Check for existing connection to this specific post (any status)
        $existingPostConnection = Connection::where('sender_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if ($existingPostConnection) {
            $statusMessages = [
                'pending' => 'You already have a pending request for this post.',
                'accepted' => 'You are already connected to this post owner.',
                'rejected' => 'Your previous request for this post was rejected.',
            ];

            return response()->json([
                'success' => false,
                'message' => $statusMessages[$existingPostConnection->status] ?? 'Connection already exists.',
                'connection_status' => $existingPostConnection->status,
            ], 400);
        }

        // Check for pending connection to the same user (different post)
        $existingUserConnection = Connection::where('sender_id', $user->id)
            ->where('receiver_id', $post->user_id)
            ->where('status', 'pending')
            ->first();

        if ($existingUserConnection) {
            return response()->json([
                'success' => false,
                'message' => 'You already have a pending connection request with this user.',
                'connection_status' => 'pending',
            ], 400);
        }

        // Create new connection request
        try {
            $connection = Connection::create([
                'sender_id' => $user->id,
                'receiver_id' => $post->user_id,
                'post_id' => $post->id,
                'message' => $request->input('message'),
                'status' => 'pending',
            ]);

            $connection->load(['sender', 'receiver', 'post']);

            return response()->json([
                'success' => true,
                'message' => 'Connection request sent successfully.',
                'data' => new ConnectionResource($connection),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send connection request. Please try again.',
            ], 500);
        }
    }

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
        if (!$connection->isPending()) {
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
                'data' => new ConnectionResource($connection),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept connection request. Please try again.',
            ], 500);
        }
    }

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
        if (!$connection->isPending()) {
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

            // Update connection status to rejected
            $connection->update(['status' => 'rejected']);

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

    public function pendingRequests(Request $request): JsonResponse
    {
        $connections = Connection::with(['sender', 'post'])
            ->where('receiver_id', auth()->id())
            ->pending()
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => ConnectionResource::collection($connections),
            'count' => $connections->count(),
        ]);
    }

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

    public function acceptedConnections(Request $request): JsonResponse
    {
        $user = $request->user();

        $connections = Connection::where('status', 'accepted')
            ->where(function ($query) use ($user) {
                $query->where('sender_id', $user->id)
                    ->orWhere('receiver_id', $user->id);
            })
            ->with(['sender', 'receiver', 'post'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => ConnectionResource::collection($connections),
            'count' => $connections->count(),
        ]);
    }

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
        if (!$connection->isPending()) {
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
