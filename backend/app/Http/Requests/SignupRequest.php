<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rules\Password;

class SignupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => [
                'required',
                'string',
                Password::min(8),
                'confirmed',
            ],
            'bio' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'skills_offered' => 'nullable|array',
            'skills_wanted' => 'nullable|array',
            'skills_offered.*' => 'string|max:100',
            'skills_wanted.*' => 'string|max:100',
            'avatar_url' => 'nullable|url|max:255',
            'experience_level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'phone' => 'nullable|string|max:20',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Please choose a username.',
            'username.unique' => 'This username is already taken.',
            'skills_offered.array' => 'Skills offered must be an array.',
            'skills_wanted.array' => 'Skills wanted must be an array.',
            'experience_level.in' => 'Experience level must be beginner, intermediate, advanced, or expert.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}
