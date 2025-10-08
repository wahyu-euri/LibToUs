<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'sometimes|required|string|max:255|unique:users,username,' . $this->route('id'),
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $this->route('id'),
            'role' => 'sometimes|required|in:admin,user',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ];
    }
}
