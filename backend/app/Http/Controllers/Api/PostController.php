<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;

class PostController extends Controller
{
    /**
     * Construct a new controller instance.
     * Implements the PostPolicy for authorization
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'searchPost']);
        $this->authorizeResource(Post::class, "post", [
            'except' => ['index', 'searchPost'],
        ]);
    }

    /**
     * Get all posts (auth only)
     */
    public function index()
    {
        $posts = Post::with(['user', 'connections' => function ($query) {
            if (auth()->check()) {
                $query->where('sender_id', auth()->id());
            }
        }])
            ->latest()
            ->paginate(12);

        return PostResource::collection($posts);
    }


    public function search(Request $request)
    {
        $searchTerm = $request->input('q', '');

        if (empty($searchTerm)) {
            return response()->json(['message' => 'Please provide a search term'], 400);
        }

        $posts = Post::with(['user', 'connections' => function ($query) {
            if (auth()->check()) {
                $query->where('sender_id', auth()->id());
            }
        }]);

        if ($searchTerm) {
            $posts->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%$searchTerm%")
                    ->orWhere('skill', 'like', "%$searchTerm%");
            });
        }

        $results = $posts->latest()->get();

        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found'], 404);
        }

        return PostResource::collection($results);
    }

    /**
     * Display the authenticated user's posts only.
     */
    public function myIndex()
    {
        $posts = Post::with('user')
            ->whereUserId(auth()->id())
            ->latest()
            ->get();

        return PostResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $post = auth()->user()->posts()->create($request->validated());
        $post->load('user');

        return response(new PostResource($post), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load('user');
        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $data = $request->validated();
        $post->update($data);
        $post->load('user');

        return response(new PostResource($post), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();
        return response('', 204);
    }

}
