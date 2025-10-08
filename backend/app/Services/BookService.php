<?php

namespace App\Services;

use App\Models\Book;
use App\Models\Borrow;
use Illuminate\Support\Facades\Storage;

class BookService
{
    public function createBook(array $data)
    {
        if (isset($data['cover_image'])) {
            $imagePath = $data['cover_image']->store('book_covers', 'public');
            $data['cover_image'] = basename($imagePath);
        }

        $data['available_copies'] = $data['total_copies'];

        return Book::create($data);
    }

    public function updateBook(Book $book, array $data)
    {
        if (isset($data['cover_image'])) {
            // Delete old image
            if ($book->cover_image) {
                Storage::disk('public')->delete('book_covers/' . $book->cover_image);
            }

            $imagePath = $data['cover_image']->store('book_covers', 'public');
            $data['cover_image'] = basename($imagePath);
        }

        if (isset($data['total_copies'])) {
            $borrowedCount = $book->borrows()->whereIn('status', ['borrowed', 'overdue'])->count();
            $data['available_copies'] = max(0, $data['total_copies'] - $borrowedCount);
        }

        $book->update($data);

        return $book;
    }

    public function deleteBook(Book $book)
    {
        if ($book->cover_image) {
            Storage::disk('public')->delete('book_covers/' . $book->cover_image);
        }

        $book->delete();
    }

    public function getBookStatistics()
    {
        return [
            'total_books' => Book::count(),
            'available_books' => Book::where('available_copies', '>', 0)->count(),
            'total_borrowed' => Borrow::whereIn('status', ['borrowed', 'overdue'])->count(),
            'overdue_books' => Borrow::where('status', 'overdue')->count()
        ];
    }
}
