<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    /**
     * Construct a new controller instance.
     * Implements the PostPolicy for authorization
     */
    public function __construct()
    {
        // Make index, search, and show public for portfolio demonstration
        $this->middleware('auth:sanctum')->except(['index', 'search', 'show']);
        $this->authorizeResource(Post::class, "post", [
            'except' => ['index', 'search', 'show'],
        ]);
    }

    /**
     * Get all active posts with filtering options.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['user', 'connections' => function ($q) {
            if (auth()->check()) {
                $q->where('sender_id', auth()->id());
            }
        }])->where('isActive', true);

        // Filter by post type (offer/request)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by skill level
        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        // Filter by specific skill
        if ($request->filled('skill')) {
            $query->where('skill', 'like', '%' . $request->skill . '%');
        }

        // Filter by location (user's location)
        if ($request->filled('location')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('location', 'like', '%' . $request->location . '%');
            });
        }

        // Exclude own posts (optional filter)
        if ($request->boolean('exclude_own') && auth()->check()) {
            $query->where('user_id', '!=', auth()->id());
        }

        // Sort options
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        $allowedSorts = ['created_at', 'title', 'skill', 'level', 'type'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->latest();
        }

        $posts = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data' => PostResource::collection($posts),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
                'from' => $posts->firstItem(),
                'to' => $posts->lastItem(),
            ],
            'filters_applied' => [
                'type' => $request->get('type'),
                'level' => $request->get('level'),
                'skill' => $request->get('skill'),
                'location' => $request->get('location'),
                'exclude_own' => $request->boolean('exclude_own'),
                'sort' => $sortBy,
                'direction' => $sortDirection,
            ]
        ]);
    }

    /**
     * Search posts by title and skill.
     */
    public function search(Request $request): JsonResponse
    {
        $searchTerm = $request->input('q', '');

        if (empty($searchTerm)) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a search term',
            ], 400);
        }

        $query = Post::with(['user', 'connections' => function ($q) {
            if (auth()->check()) {
                $q->where('sender_id', auth()->id());
            }
        }])->where('isActive', true);

        // Search in title, skill, and description
        $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'like', "%$searchTerm%")
                ->orWhere('skill', 'like', "%$searchTerm%")
                ->orWhere('description', 'like', "%$searchTerm%");
        });

        // Apply same filters as index
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        // Exclude own posts
        if ($request->boolean('exclude_own') && auth()->check()) {
            $query->where('user_id', '!=', auth()->id());
        }

        $posts = $query->latest()->paginate($request->get('per_page', 12));

        if ($posts->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No results found for your search',
                'search_term' => $searchTerm,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Found {$posts->total()} results for '{$searchTerm}'",
            'data' => PostResource::collection($posts),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
                'search_term' => $searchTerm,
            ],
        ]);
    }

    /**
     * Display the authenticated user's posts only.
     */
    public function myIndex(Request $request): JsonResponse
    {
        $query = Post::with('user')->where('user_id', auth()->id());

        // Filter by status
        if ($request->filled('status')) {
            $isActive = $request->status === 'active';
            $query->where('isActive', $isActive);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $posts = $query->latest()->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => PostResource::collection($posts),
            'meta' => [
                'total' => $posts->total(),
                'active_count' => auth()->user()->posts()->where('isActive', true)->count(),
                'inactive_count' => auth()->user()->posts()->where('isActive', false)->count(),
            ],
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        try {
            $post = auth()->user()->posts()->create($request->validated());
            $post->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Post created successfully',
                'data' => new PostResource($post),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create post. Please try again.',
            ], 500);
        }
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): JsonResponse
    {
        $post->load(['user', 'connections' => function ($q) {
            if (auth()->check()) {
                $q->where('sender_id', auth()->id());
            }
        }]);

        return response()->json([
            'success' => true,
            'data' => new PostResource($post),
        ]);
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        try {
            $post->update($request->validated());
            $post->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Post updated successfully',
                'data' => new PostResource($post),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update post. Please try again.',
            ], 500);
        }
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): JsonResponse
    {
        try {
            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Post deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete post. Please try again.',
            ], 500);
        }
    }

    /**
     * Toggle post active status.
     */
    public function toggleStatus(Post $post): JsonResponse
    {
        $this->authorize('update', $post);

        try {
            $post->update(['isActive' => !$post->isActive]);

            return response()->json([
                'success' => true,
                'message' => $post->isActive ? 'Post activated' : 'Post deactivated',
                'data' => new PostResource($post),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update post status. Please try again.',
            ], 500);
        }
    }

    /**
     * Get posts statistics for dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        $user = auth()->user();

        $stats = [
            'my_posts' => [
                'total' => $user->posts()->count(),
                'active' => $user->posts()->where('isActive', true)->count(),
                'offers' => $user->posts()->where('type', 'offer')->count(),
                'requests' => $user->posts()->where('type', 'request')->count(),
            ],
            'connections' => [
                'sent' => $user->sentConnections()->count(),
                'received' => $user->receivedConnections()->count(),
                'accepted' => $user->sentConnections()->where('status', 'accepted')->count() +
                    $user->receivedConnections()->where('status', 'accepted')->count(),
                'pending_sent' => $user->sentConnections()->where('status', 'pending')->count(),
                'pending_received' => $user->receivedConnections()->where('status', 'pending')->count(),
            ],
            'restrictions' => [
                'active' => $user->connectionRestrictions()->active()->count(),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
