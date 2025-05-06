<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
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
            'user_id' => $this->user_id,
            'title' => $this->title,
            'skill' => $this->skill,
            'type' => $this->type,
            'level' => $this->level,
            'isActive' => $this->isActive,
            'description' => $this->description,
            'connection_status' => $this->when( // check if user is authenticated and return connection status
                auth()->check(),
                function () {
                    $connection = $this->connections
                    ->where('sender_id', auth()->id())
                    ->first();
                    return $connection ? $connection->status : null;
                }
            ),
            'user' => $this->whenLoaded('user'), // return user data if eager loaded using with('user')
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
