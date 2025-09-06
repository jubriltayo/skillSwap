<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'bio' => $this->bio,
            'location' => $this->location,
            'skills_offered' => $this->skills_offered,
            'skills_needed' => $this->skills_needed,
            'profile_image' => $this->profile_image,
            'linkedin_url' => $this->linkedin_url,
            'github_url' => $this->github_url,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),

            // Conditional fields based on context
            'email' => $this->when($this->shouldShowEmail(), $this->email),
            'phone' => $this->when($this->shouldShowContactInfo(), $this->phone),

            // Stats for profile viewing
            'stats' => [
                'posts_count' => $this->whenCounted('posts'),
                'connections_count' => $this->when(
                    auth()->check() && auth()->id() === $this->id,
                    function () {
                        return $this->sentConnections()->where('status', 'accepted')->count() +
                            $this->receivedConnections()->where('status', 'accepted')->count();
                    }
                ),
            ],

            // Relationship status with current user
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

    /**
     * Determine if email should be shown to current user.
     */
    private function shouldShowEmail(): bool
    {
        // Always show own email
        if (auth()->check() && auth()->id() === $this->id) {
            return true;
        }

        // Show email if there's an accepted connection
        if (auth()->check()) {
            return $this->hasAcceptedConnectionWith(auth()->user());
        }

        return false;
    }

    /**
     * Determine if contact info should be shown to current user.
     */
    private function shouldShowContactInfo(): bool
    {
        // Same logic as email for now
        return $this->shouldShowEmail();
    }
}
