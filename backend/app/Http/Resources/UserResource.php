<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->when($this->shouldShowEmail(), $this->email),
            'avatar_url' => $this->avatar_url,
            'bio' => $this->bio,
            'location' => $this->location,
            'skills_offered' => $this->skills_offered,
            'skills_wanted' => $this->skills_wanted,
            'experience_level' => $this->experience_level,
            'phone' => $this->when($this->shouldShowContactInfo(), $this->phone),
            'linkedin_url' => $this->linkedin_url,
            'github_url' => $this->github_url,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Counts
            'posts_count' => $this->posts_count ?? 0,
            'accepted_connections_count' => $this->accepted_connections_count ?? 0,

            // Connection status with current user
            'connection_status' => $this->when(
                auth()->check() && auth()->id() !== $this->id,
                function () {
                    $connection = \App\Models\Connection::where(function ($query) {
                        $query->where(['sender_id' => auth()->id(), 'receiver_id' => $this->id])
                            ->orWhere(['sender_id' => $this->id, 'receiver_id' => auth()->id()]);
                    })->first();

                    return $connection ? $connection->status : null;
                }
            ),
        ];
    }

    private function shouldShowEmail(): bool
    {
        if (auth()->check() && auth()->id() === $this->id) {
            return true;
        }

        if (auth()->check()) {
            return $this->hasAcceptedConnectionWith(auth()->user());
        }

        return false;
    }

    private function shouldShowContactInfo(): bool
    {
        return $this->shouldShowEmail();
    }
}
