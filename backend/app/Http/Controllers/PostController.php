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
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'search', 'show']);
        $this->authorizeResource(Post::class, "post", [
            'except' => ['index', 'search', 'show'],
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['user']);

        // Filter by post type (offer/request)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by experience level
        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        // Filter by skills
        if ($request->filled('skills')) {
            $skills = is_array($request->skills) ? $request->skills : [$request->skills];
            $query->where(function ($q) use ($skills) {
                foreach ($skills as $skill) {
                    $q->orWhereJsonContains('skills', $skill);
                }
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', 'like', '%' . $request->category . '%');
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Filter by remote work
        if ($request->filled('is_remote')) {
            $query->where('is_remote', $request->boolean('is_remote'));
        }

        // Exclude own posts
        if ($request->boolean('exclude_own') && auth()->check()) {
            $query->where('user_id', '!=', auth()->id());
        }

        // Sort options
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        $allowedSorts = ['created_at', 'title', 'experience_level', 'type'];
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
            ],
            'filters_applied' => $request->only(['type', 'experience_level', 'skills', 'category', 'location', 'is_remote'])
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $searchTerm = $request->input('q', '');

        if (empty($searchTerm)) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a search term',
            ], 400);
        }

        $query = Post::with(['user']);

        // Search in title, skills, category, and description
        $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'like', "%$searchTerm%")
                ->orWhere('category', 'like', "%$searchTerm%")
                ->orWhere('description', 'like', "%$searchTerm%")
                ->orWhereJsonContains('skills', $searchTerm);
        });

        // Apply same filters as index
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
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

    public function myIndex(Request $request): JsonResponse
    {
        $query = Post::with('user')->where('user_id', auth()->id());

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
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
                'active_count' => auth()->user()->posts()->where('status', 'active')->count(),
                'inactive_count' => auth()->user()->posts()->where('status', 'inactive')->count(),
            ],
        ]);
    }

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

    public function show(Post $post): JsonResponse
    {
        $post->load(['user']);

        // Load connection status if user is authenticated
        if (auth()->check()) {
            $post->load(['connections' => function ($q) {
                $q->where('sender_id', auth()->id());
            }]);
        }

        return response()->json([
            'success' => true,
            'data' => new PostResource($post),
        ]);
    }

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

    public function toggleStatus(Post $post): JsonResponse
    {
        $this->authorize('update', $post);

        try {
            $newStatus = $post->status === 'active' ? 'inactive' : 'active';
            $post->update(['status' => $newStatus]);

            return response()->json([
                'success' => true,
                'message' => $newStatus === 'active' ? 'Post activated' : 'Post deactivated',
                'data' => new PostResource($post),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update post status. Please try again.',
            ], 500);
        }
    }

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
                'active' => $user->posts()->active()->count(),
                'offers' => $user->posts()->offers()->count(),
                'requests' => $user->posts()->requests()->count(),
            ],
            'connections' => [
                'sent' => $user->sentConnections()->count(),
                'received' => $user->receivedConnections()->count(),
                'accepted' => $user->sentConnections()->accepted()->count() +
                    $user->receivedConnections()->accepted()->count(),
                'pending_sent' => $user->sentConnections()->pending()->count(),
                'pending_received' => $user->receivedConnections()->pending()->count(),
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
