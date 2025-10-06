<?php

namespace Database\Seeders;

use App\Models\Connection;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class ConnectionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $posts = Post::all();

        // Mike sends request to Sarah's post
        Connection::create([
            'sender_id' => $users[1]->id, // Mike
            'receiver_id' => $users[0]->id, // Sarah
            'post_id' => $posts[0]->id, // Sarah's React post
            'message' => 'Hi Sarah! I saw your React mentoring post and would love to connect.',
            'status' => 'accepted',
        ]);

        // Alex sends request to Emily's post
        Connection::create([
            'sender_id' => $users[3]->id, // Alex
            'receiver_id' => $users[2]->id, // Emily
            'post_id' => $posts[2]->id, // Emily's Python post
            'message' => 'Hello Emily! I\'m interested in learning more about machine learning.',
            'status' => 'pending',
        ]);

        // Jessica sends request to Mike's post
        Connection::create([
            'sender_id' => $users[4]->id, // Jessica
            'receiver_id' => $users[1]->id, // Mike
            'post_id' => $posts[1]->id, // Mike's frontend request
            'message' => 'Hi Mike! I can help with your frontend development needs.',
            'status' => 'accepted',
        ]);

        // David sends request to Jessica's post
        Connection::create([
            'sender_id' => $users[5]->id, // David
            'receiver_id' => $users[4]->id, // Jessica
            'post_id' => $posts[4]->id, // Jessica's marketing post
            'message' => 'Hi Jessica! I need help with marketing strategy for my product.',
            'status' => 'pending',
        ]);
    }
}
