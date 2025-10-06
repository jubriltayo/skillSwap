<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['update', 'destroy']);
    }

    public function index()
    {
        $users = User::withCount(['posts'])
            ->select('users.*')
            ->addSelect([
                'accepted_connections_count' => Connection::selectRaw('COUNT(*)')
                    ->where('status', 'accepted')
                    ->where(function ($query) {
                        $query->where('sender_id', DB::raw('users.id'))
                            ->orWhere('receiver_id', DB::raw('users.id'));
                    })
            ])
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        try {
            $data = $request->validated();
            $data['password'] = Hash::make($data['password']);

            // Ensure skills are properly formatted as JSON
            if (isset($data['skills_offered']) && is_array($data['skills_offered'])) {
                $data['skills_offered'] = json_encode($data['skills_offered']);
            }
            if (isset($data['skills_wanted']) && is_array($data['skills_wanted'])) {
                $data['skills_wanted'] = json_encode($data['skills_wanted']);
            }

            $user = User::create($data);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => new UserResource($user),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user. Please try again.',
            ], 500);
        }
    }

    public function show(User $user)
    {
        $user->loadCount('posts');

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        if (auth()->id() !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own profile.',
            ], 403);
        }

        try {
            // Get validated data and exclude username/email
            $data = $request->safe()->except(['username', 'email', 'password_confirmation']);

            // Only update password if provided
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            // Ensure skills are properly formatted as JSON
            if (isset($data['skills_offered']) && is_array($data['skills_offered'])) {
                $data['skills_offered'] = json_encode($data['skills_offered']);
            }
            if (isset($data['skills_wanted']) && is_array($data['skills_wanted'])) {
                $data['skills_wanted'] = json_encode($data['skills_wanted']);
            }

            $user->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => new UserResource($user->fresh()),
            ]);
        } catch (\Exception $e) {
            Log::error('User update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile. Please try again.',
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        if (auth()->id() !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete your own profile.',
            ], 403);
        }

        try {
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Profile deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete profile. Please try again.',
            ], 500);
        }
    }

    public function search(Request $request)
    {
        $query = $request->get('q');

        if (!$query || strlen(trim($query)) < 2) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Please provide a search query with at least 2 characters'
            ]);
        }

        try {
            $searchTerm = '%' . $query . '%';

            $users = User::where('name', 'like', $searchTerm)
                ->orWhere('username', 'like', $searchTerm)
                ->orWhere('bio', 'like', $searchTerm)
                ->orWhere('skills_offered', 'like', $searchTerm)
                ->orWhere('skills_wanted', 'like', $searchTerm)
                ->limit(20)
                ->get();

            return response()->json([
                'success' => true,
                'data' => UserResource::collection($users),
                'meta' => [
                    'search_query' => $query,
                    'results_count' => $users->count()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('User search error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Search failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update only user skills
     */
    public function updateSkills(Request $request, User $user)
    {
        if (auth()->id() !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own profile.',
            ], 403);
        }

        try {
            $data = $request->validate([
                'skills_offered' => 'nullable|array',
                'skills_wanted' => 'nullable|array',
                'skills_offered.*' => 'string|max:100',
                'skills_wanted.*' => 'string|max:100',
            ]);

            Log::info('Updating user skills', [
                'user_id' => $user->id,
                'skills_offered' => $data['skills_offered'] ?? null,
                'skills_wanted' => $data['skills_wanted'] ?? null,
            ]);

            if (array_key_exists('skills_offered', $data)) {
                $user->skills_offered = $data['skills_offered'];
            }

            if (array_key_exists('skills_wanted', $data)) {
                $user->skills_wanted = $data['skills_wanted'];
            }

            $user->save();

            Log::info('User skills updated successfully', [
                'user_id' => $user->id,
                'updated_skills_offered' => $user->skills_offered,
                'updated_skills_wanted' => $user->skills_wanted,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Skills updated successfully',
                'data' => new UserResource($user->fresh()),
            ]);
        } catch (\Exception $e) {
            Log::error('Skills update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update skills. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function connectionCount(User $user)
    {
        try {
            // Count accepted connections where user is either sender or receiver
            $connectionCount = Connection::where('status', 'accepted')
                ->where(function ($query) use ($user) {
                    $query->where('sender_id', $user->id)
                        ->orWhere('receiver_id', $user->id);
                })
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'connection_count' => $connectionCount
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch connection count.',
            ], 500);
        }
    }

    public function updateAvatar(Request $request, User $user)
    {
        if (auth()->id() !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own profile.',
            ], 403);
        }

        $request->validate([
            'avatar_base64' => 'required|string',
            'file_type' => 'required|string|in:image/jpeg,image/png,image/gif,image/webp'
        ]);

        try {
            $base64Data = $request->avatar_base64;
            $fileType = $request->file_type;

            // Remove data URL prefix if present
            if (preg_match('/^data:image\/\w+;base64,/', $base64Data, $matches)) {
                $base64Data = substr($base64Data, strlen($matches[0]));
            }

            // Decode base64
            $fileData = base64_decode($base64Data, true);

            if ($fileData === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid image data.',
                ], 422);
            }

            // Check file size (max 2MB)
            if (strlen($fileData) > 2 * 1024 * 1024) {
                return response()->json([
                    'success' => false,
                    'message' => 'Image must be smaller than 2MB.',
                ], 422);
            }

            // Get extension from MIME type
            $extension = match ($fileType) {
                'image/jpeg', 'image/jpg' => 'jpg',
                'image/png' => 'png',
                'image/gif' => 'gif',
                'image/webp' => 'webp',
                default => 'jpg'
            };

            // Generate filename
            $filename = 'avatar-' . $user->id . '-' . time() . '.' . $extension;
            $path = 'avatars/' . $filename;

            // Store using Laravel Storage
            Storage::disk('public')->put($path, $fileData);

            // Delete old avatar if exists
            if ($user->avatar_url && !str_contains($user->avatar_url, 'placeholder')) {
                $oldPath = str_replace('/storage/', '', $user->avatar_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Update user record
            $avatarUrl = '/storage/' . $path;
            $user->update(['avatar_url' => $avatarUrl]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar updated successfully',
                'data' => new UserResource($user->fresh()),
            ]);
        } catch (\Exception $e) {
            Log::error('Avatar upload error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload avatar. Please try again.',
            ], 500);
        }
    }

    private function getExtensionFromMimeType($mimeType)
    {
        $mappings = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/x-icon' => 'ico',
        ];

        return $mappings[$mimeType] ?? 'png';
    }
}
