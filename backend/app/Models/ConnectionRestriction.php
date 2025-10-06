<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConnectionRestriction extends Model
{
    protected $fillable = [
        'sender_id',
        'post_id',
        'restricted_until',
    ];

    protected $casts = [
        'restricted_until' => 'datetime',
    ];

    /**
     * Get the user who is restricted from sending requests.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the post that the user is restricted from requesting.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Check if the restriction is still active.
     */
    public function isActive(): bool
    {
        return $this->restricted_until->isFuture();
    }

    /**
     * Scope to get only active restrictions.
     */
    public function scopeActive($query)
    {
        return $query->where('restricted_until', '>', now());
    }

    /**
     * Scope to get expired restrictions for cleanup.
     */
    public function scopeExpired($query)
    {
        return $query->where('restricted_until', '<=', now());
    }
}
