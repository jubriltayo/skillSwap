<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->randomElement([
                'Python tutor needed',
                'Looking for help with Java OOP',
                'Can teach database management',
                'Offering mentorship in UI/UX',
                'Need guidance on React basics',
                'Happy to help with Laravel projects',
                'Want to learn advanced Excel skills',
                'Can assist with resume writing',
                'Seeking help with Git and GitHub',
                'Ready to tutor in public speaking'
            ]),
            'skill' => fake()->randomElement([
                'Python',
                'Java',
                'Laravel',
                'React',
                'UI/UX Design',
                'Excel',
                'Public Speaking',
                'Git',
                'Databases',
                'Soft Skills'
            ]),
            'type' => fake()->randomElement(['request', 'offer']),
            'level' => fake()->randomElement(['beginner', 'intermediate', 'advanced']),
            'isActive' => fake()->boolean(80),
            'description' => fake()->paragraph(),
        ];
    }
}
