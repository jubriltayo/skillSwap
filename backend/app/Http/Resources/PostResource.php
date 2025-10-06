<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'skills' => $this->skills,
            'category' => $this->category,
            'type' => $this->type,
            'experience_level' => $this->experience_level,
            'location' => $this->location,
            'is_remote' => $this->is_remote,
            'status' => $this->status,
            'description' => $this->description,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // User relationship
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'username' => $this->user->username,
                    'avatar_url' => $this->user->avatar_url,
                    'bio' => $this->user->bio,
                    'location' => $this->user->location,
                    'experience_level' => $this->user->experience_level,
                    'skills_offered' => $this->user->skills_offered,
                    'skills_wanted' => $this->user->skills_wanted,
                ];
            }),

            // Connection status for authenticated users
            'connection_status' => $this->when(auth()->check(), function () {
                $connection = $this->connections->first();
                return $connection ? $connection->status : null;
            }),

            // Helper fields
            'is_owner' => $this->when(auth()->check(), auth()->id() === $this->user_id),
        ];
    }
}
