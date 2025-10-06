<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConnectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'post_id' => $this->post_id,
            'message' => $this->message,
            'status' => $this->status,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Relationships
            'sender' => $this->whenLoaded('sender', function () {
                return new UserResource($this->sender);
            }),

            'receiver' => $this->whenLoaded('receiver', function () {
                return new UserResource($this->receiver);
            }),

            'post' => $this->whenLoaded('post', function () {
                return new PostResource($this->post);
            }),

            // Helper fields for frontend
            'is_sender' => $this->when(auth()->check(), auth()->id() === $this->sender_id),
            'is_receiver' => $this->when(auth()->check(), auth()->id() === $this->receiver_id),
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
