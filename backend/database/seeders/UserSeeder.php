<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Sarah Chen',
                'username' => 'sarahchen',
                'email' => 'sarah.chen@example.com',
                'password' => Hash::make('password123'),
                'bio' => 'Full-stack developer with 5 years of experience. Passionate about React and Node.js.',
                'location' => 'San Francisco, CA',
                'skills_offered' => json_encode(['React', 'TypeScript', 'Node.js', 'PostgreSQL']),
                'skills_wanted' => json_encode(['Machine Learning', 'Python', 'Data Science']),
                'experience_level' => 'advanced',
                'avatar_url' => '/avatars/sarah.jpg',
            ],
            [
                'name' => 'Mike Rodriguez',
                'username' => 'mikerodriguez',
                'email' => 'mike.rodriguez@example.com',
                'password' => Hash::make('password123'),
                'bio' => 'UX/UI Designer specializing in mobile apps and web interfaces.',
                'location' => 'Austin, TX',
                'skills_offered' => json_encode(['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping']),
                'skills_wanted' => json_encode(['Frontend Development', 'React', 'CSS Animation']),
                'experience_level' => 'expert',
                'avatar_url' => '/avatars/mike.jpg',
            ],
            [
                'name' => 'Emily Watson',
                'username' => 'emilywatson',
                'email' => 'emily.watson@example.com',
                'password' => Hash::make('password123'),
                'bio' => 'Data scientist with expertise in machine learning and statistical analysis.',
                'location' => 'Remote',
                'skills_offered' => json_encode(['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow']),
                'skills_wanted' => json_encode(['Cloud Computing', 'AWS', 'DevOps']),
                'experience_level' => 'advanced',
                'avatar_url' => '/avatars/emily.jpg',
            ],
            [
                'name' => 'Alex Kim',
                'username' => 'alexkim',
                'email' => 'alex.kim@example.com',
                'password' => Hash::make('password123'),
                'bio' => 'Mobile app developer with expertise in React Native and Flutter.',
                'location' => 'Seattle, WA',
                'skills_offered' => json_encode(['React Native', 'Flutter', 'Mobile Development', 'iOS', 'Android']),
                'skills_wanted' => json_encode(['Backend Development', 'GraphQL', 'Microservices']),
                'experience_level' => 'intermediate',
                'avatar_url' => null,
            ],
            [
                'name' => 'Jessica Park',
                'username' => 'jessicapark',
                'email' => 'jessica.park@example.com',
                'password' => Hash::make('password123'),
                'bio' => 'Digital marketing strategist with 8+ years helping startups grow.',
                'location' => 'New York, NY',
                'skills_offered' => json_encode(['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media']),
                'skills_wanted' => json_encode(['Marketing Automation', 'Email Marketing', 'Conversion Optimization']),
                'experience_level' => 'expert',
                'avatar_url' => null,
            ],
            [
                'name' => 'David Thompson',
                'username' => 'davidthompson',
                'email' => 'david.thompson@example.com',
                'password' => Hash::make('password123'),
                'bio' => 'Product manager with a passion for user-centered design and agile methodologies.',
                'location' => 'Denver, CO',
                'skills_offered' => json_encode(['Product Management', 'Agile', 'User Research', 'Roadmapping']),
                'skills_wanted' => json_encode(['Data Analytics', 'A/B Testing', 'Growth Hacking']),
                'experience_level' => 'advanced',
                'avatar_url' => null,
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
