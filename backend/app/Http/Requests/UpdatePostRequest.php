<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'skills' => 'required|array|min:1',
            'skills.*' => 'string|max:100',
            'category' => 'nullable|string|max:100',
            'type' => 'required|in:offer,request',
            'experience_level' => 'required|in:beginner,intermediate,advanced',
            'location' => 'nullable|string|max:255',
            'is_remote' => 'boolean',
            'status' => 'sometimes|in:active,inactive',
            'description' => 'required|string|max:2000',
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
