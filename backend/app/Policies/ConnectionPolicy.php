<?php

namespace App\Policies;

use App\Models\Connection;
use App\Models\User;

class ConnectionPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function accept(User $user, Connection $connection)
    {
        // Only the receiver can accept the connection
        return $user->id === $connection->receiver_id;
    }
    
    public function reject(User $user, Connection $connection)
    {
        // Only the receiver can reject the connection
        return $user->id === $connection->receiver_id;
    }

    public function cancel(User $user, Connection $connection)
    {
        // Only the sender can cancel a pending request
        return $connection->status === 'pending' && 
                $user->id === $connection->sender_id;
    }

    public function disconnect(User $user, Connection $connection)
    {
        // Either party can disconnect after acceptance

        return $connection->status === 'accepted' && 
                ($user->id === $connection->sender_id || 
                $user->id === $connection->receiver_id);
    }
}
