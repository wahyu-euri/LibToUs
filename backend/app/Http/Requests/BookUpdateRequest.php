<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'isbn' => 'sometimes|required|string|unique:books,isbn,' . $this->route('id'),
            'publisher' => 'sometimes|required|string|max:255',
            'publication_year' => 'sometimes|required|integer|min:1000|max:' . date('Y'),
            'category' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'total_copies' => 'sometimes|required|integer|min:1'
        ];
    }
}
