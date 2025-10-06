<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $posts = [
            [
                'user_id' => $users[0]->id, // Sarah
                'title' => 'React & TypeScript Mentoring',
                'skills' => json_encode(['React', 'TypeScript', 'JavaScript']),
                'category' => 'Programming',
                'type' => 'offer',
                'experience_level' => 'beginner',
                'location' => 'San Francisco, CA',
                'is_remote' => true,
                'description' => 'I can help you learn React and TypeScript from basics to advanced concepts. Perfect for developers looking to transition to modern frontend development.',
                'status' => 'active',
            ],
            [
                'user_id' => $users[1]->id, // Mike
                'title' => 'Looking for Frontend Development Help',
                'skills' => json_encode(['React', 'Frontend Development', 'CSS']),
                'category' => 'Programming',
                'type' => 'request',
                'experience_level' => 'intermediate',
                'location' => 'Austin, TX',
                'is_remote' => true,
                'description' => 'I need help implementing my designs in React. Looking for someone who can teach me component architecture and state management.',
                'status' => 'active',
            ],
            [
                'user_id' => $users[2]->id, // Emily
                'title' => 'Python & Machine Learning Tutoring',
                'skills' => json_encode(['Python', 'Machine Learning', 'Data Science']),
                'category' => 'Data Science',
                'type' => 'offer',
                'experience_level' => 'beginner',
                'location' => 'Remote',
                'is_remote' => true,
                'description' => 'Offering comprehensive Python programming and machine learning guidance. From data preprocessing to model deployment.',
                'status' => 'active',
            ],
            [
                'user_id' => $users[3]->id, // Alex
                'title' => 'Mobile App Development Help Needed',
                'skills' => json_encode(['React Native', 'Mobile Development', 'JavaScript']),
                'category' => 'Mobile Development',
                'type' => 'request',
                'experience_level' => 'beginner',
                'location' => 'Seattle, WA',
                'is_remote' => true,
                'description' => 'Looking for guidance on React Native best practices and performance optimization for mobile apps.',
                'status' => 'active',
            ],
            [
                'user_id' => $users[4]->id, // Jessica
                'title' => 'Digital Marketing Strategy Consultation',
                'skills' => json_encode(['Digital Marketing', 'SEO', 'Content Strategy']),
                'category' => 'Marketing',
                'type' => 'offer',
                'experience_level' => 'intermediate',
                'location' => 'New York, NY',
                'is_remote' => true,
                'description' => 'I can help you develop comprehensive digital marketing strategies for your business or personal brand.',
                'status' => 'active',
            ],
            [
                'user_id' => $users[5]->id, // David
                'title' => 'Seeking Product Management Mentor',
                'skills' => json_encode(['Product Management', 'Roadmapping', 'User Research']),
                'category' => 'Product Management',
                'type' => 'request',
                'experience_level' => 'intermediate',
                'location' => 'Denver, CO',
                'is_remote' => true,
                'description' => 'Looking for an experienced product manager to guide me through career advancement and skill development.',
                'status' => 'active',
            ]
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }
    }
}
