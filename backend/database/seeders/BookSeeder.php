<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'isbn' => '9780743273565',
                'publisher' => 'Scribner',
                'publication_year' => 1925,
                'category' => 'Fiction',
                'description' => 'A classic novel of the Jazz Age',
                'total_copies' => 5,
                'available_copies' => 5,
                'rating' => 4.2,
                'review_count' => 150
            ],
            [
                'title' => 'To Kill a Mockingbird',
                'author' => 'Harper Lee',
                'isbn' => '9780061120084',
                'publisher' => 'J.B. Lippincott & Co.',
                'publication_year' => 1960,
                'category' => 'Fiction',
                'description' => 'A novel about racial inequality',
                'total_copies' => 3,
                'available_copies' => 3,
                'rating' => 4.5,
                'review_count' => 200
            ],
            // Add more sample books...
        ];

        foreach ($books as $book) {
            Book::create($book);
        }

        // Create additional books using factory
        Book::factory(20)->create();
    }
}
