<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConnectionResource extends JsonResource
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
            'post_id' => $this->post_id,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),

            // Post information
            'post' => $this->whenLoaded('post', function () {
                return [
                    'id' => $this->post->id,
                    'title' => $this->post->title,
                    'skill' => $this->post->skill,
                    'type' => $this->post->type,
                    'level' => $this->post->level,
                    'description' => $this->post->description,
                ];
            }),

            // Sender information (person who sent the request)
            'sender' => $this->whenLoaded('sender', function () {
                return [
                    'id' => $this->sender->id,
                    'name' => $this->sender->name,
                    'bio' => $this->sender->bio,
                    'location' => $this->sender->location,
                    'skills_offered' => $this->sender->skills_offered,
                    'skills_needed' => $this->sender->skills_needed,
                    // Show email only if connection is accepted
                    'email' => $this->when(
                        $this->status === 'accepted',
                        $this->sender->email
                    ),
                ];
            }),

            // Receiver information (person who received the request)
            'receiver' => $this->whenLoaded('receiver', function () {
                return [
                    'id' => $this->receiver->id,
                    'name' => $this->receiver->name,
                    'bio' => $this->receiver->bio,
                    'location' => $this->receiver->location,
                    'skills_offered' => $this->receiver->skills_offered,
                    'skills_needed' => $this->receiver->skills_needed,
                    // Show email only if connection is accepted
                    'email' => $this->when(
                        $this->status === 'accepted',
                        $this->receiver->email
                    ),
                ];
            }),

            // Helper fields for frontend
            'is_sender' => $this->when(
                auth()->check(),
                auth()->id() === $this->sender_id
            ),
            'is_receiver' => $this->when(
                auth()->check(),
                auth()->id() === $this->receiver_id
            ),
            'can_accept' => $this->when(
                auth()->check(),
                auth()->id() === $this->receiver_id && $this->status === 'pending'
            ),
            'can_reject' => $this->when(
                auth()->check(),
                auth()->id() === $this->receiver_id && $this->status === 'pending'
            ),
            'can_cancel' => $this->when(
                auth()->check(),
                auth()->id() === $this->sender_id && $this->status === 'pending'
            ),
        ];
    }
}
