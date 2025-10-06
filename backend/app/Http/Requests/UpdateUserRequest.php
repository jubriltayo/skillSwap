<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'password' => [
                'nullable',
                'string',
                Password::min(8),
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
