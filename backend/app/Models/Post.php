<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;

    /**
     * Enum options for type and level fields.
     */
    public const TYPE_OFFER = 'offer';
    public const TYPE_REQUEST = 'request';

    public const LEVEL_BEGINNER = 'beginner';
    public const LEVEL_INTERMEDIATE = 'intermediate';
    public const LEVEL_ADVANCED = 'advanced';

    public const TYPES = [
        self::TYPE_OFFER,
        self::TYPE_REQUEST,
    ];

    public const LEVELS = [
        self::LEVEL_BEGINNER,
        self::LEVEL_INTERMEDIATE,
        self::LEVEL_ADVANCED,
    ];

    protected $fillable = [
        'user_id',
        'title',
        'skill',
        'type',
        'level',
        'isActive',
        'description',
    ];

    protected $casts = [
        'isActive' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function connections()
    {
        return $this->hasMany(Connection::class);
    }
}
