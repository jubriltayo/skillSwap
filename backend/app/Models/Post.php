<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    /**
     * Enum options for type and experience_level fields.
     */
    public const TYPE_OFFER = 'offer';
    public const TYPE_REQUEST = 'request';

    public const LEVEL_BEGINNER = 'beginner';
    public const LEVEL_INTERMEDIATE = 'intermediate';
    public const LEVEL_ADVANCED = 'advanced';

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';

    public const TYPES = [
        self::TYPE_OFFER,
        self::TYPE_REQUEST,
    ];

    public const LEVELS = [
        self::LEVEL_BEGINNER,
        self::LEVEL_INTERMEDIATE,
        self::LEVEL_ADVANCED,
    ];

    public const STATUSES = [
        self::STATUS_ACTIVE,
        self::STATUS_INACTIVE,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'skills',
        'category',
        'type',
        'experience_level',
        'location',
        'is_remote',
        'status',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'skills' => 'array',
        'is_remote' => 'boolean',
    ];

    /**
     * Get the user that owns the post.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the connections for the post.
     */
    public function connections(): HasMany
    {
        return $this->hasMany(Connection::class);
    }

    /**
     * Get the connection restrictions for the post.
     */
    public function connectionRestrictions(): HasMany
    {
        return $this->hasMany(ConnectionRestriction::class);
    }

    /**
     * Scope active posts.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope offers.
     */
    public function scopeOffers($query)
    {
        return $query->where('type', self::TYPE_OFFER);
    }

    /**
     * Scope requests.
     */
    public function scopeRequests($query)
    {
        return $query->where('type', self::TYPE_REQUEST);
    }

    /**
     * Check if post is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if post is an offer.
     */
    public function isOffer(): bool
    {
        return $this->type === self::TYPE_OFFER;
    }

    /**
     * Check if post is a request.
     */
    public function isRequest(): bool
    {
        return $this->type === self::TYPE_REQUEST;
    }
}
