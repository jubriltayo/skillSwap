<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'connection_id',
        'sender_id',
        'message'
    ];

    public function connection()
    {
        return $this->belongsTo(Connection::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
