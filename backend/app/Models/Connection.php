<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Connection extends Model
{
    /** @use HasFactory<\Database\Factories\ConnectionFactory> */
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'post_id',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
