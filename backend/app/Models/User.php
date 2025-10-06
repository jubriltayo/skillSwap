<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar_url',
        'bio',
        'location',
        'skills_offered',
        'skills_wanted',
        'experience_level',
        'phone',
        'linkedin_url',
        'github_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'skills_offered' => 'array',
            'skills_wanted' => 'array',
        ];
    }

    /**
     * Get all posts created by the user.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get all connection requests sent by the user.
     */
    public function sentConnections(): HasMany
    {
        return $this->hasMany(Connection::class, 'sender_id');
    }

    /**
     * Get all connection requests received by the user.
     */
    public function receivedConnections(): HasMany
    {
        return $this->hasMany(Connection::class, 'receiver_id');
    }

    /**
     * Get all connection restrictions for this user.
     */
    public function connectionRestrictions(): HasMany
    {
        return $this->hasMany(ConnectionRestriction::class, 'sender_id');
    }

    /**
     * Get accepted connections where user is the sender.
     */
    public function acceptedSentConnections(): HasMany
    {
        return $this->hasMany(Connection::class, 'sender_id')
            ->where('status', 'accepted');
    }

    /**
     * Get accepted connections where user is the receiver.
     */
    public function acceptedReceivedConnections(): HasMany
    {
        return $this->hasMany(Connection::class, 'receiver_id')
            ->where('status', 'accepted');
    }

    /**
     * Get all accepted connections for this user (both sent and received).
     * This is a custom method, not a relationship.
     */
    public function getAcceptedConnections()
    {
        return Connection::where('status', 'accepted')
            ->where(function ($query) {
                $query->where('sender_id', $this->id)
                    ->orWhere('receiver_id', $this->id);
            });
    }

    /**
     * Accessor for accepted connections count.
     */
    public function getAcceptedConnectionsCountAttribute(): int
    {
        if (isset($this->attributes['accepted_connections_count'])) {
            return $this->attributes['accepted_connections_count'];
        }

        return $this->getAcceptedConnections()->count();
    }

    /**
     * Check if this user has an accepted connection with another user.
     */
    public function hasAcceptedConnectionWith(User $user): bool
    {
        return Connection::where('status', 'accepted')
            ->where(function ($query) use ($user) {
                $query->where(['sender_id' => $this->id, 'receiver_id' => $user->id])
                    ->orWhere(['sender_id' => $user->id, 'receiver_id' => $this->id]);
            })->exists();
    }

    /**
     * Check if user is restricted from sending request to a specific post.
     */
    public function isRestrictedFromPost(Post $post): bool
    {
        return $this->connectionRestrictions()
            ->where('post_id', $post->id)
            ->where('restricted_until', '>', now())
            ->exists();
    }

    /**
     * Get the restriction for a specific post if it exists.
     */
    public function getRestrictionForPost(Post $post): ?ConnectionRestriction
    {
        return $this->connectionRestrictions()
            ->where('post_id', $post->id)
            ->where('restricted_until', '>', now())
            ->first();
    }
}
