<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition(): array
    {
        $publicationYear = $this->faker->numberBetween(1900, date('Y'));
        $totalCopies = $this->faker->numberBetween(1, 10);

        return [
            'title' => $this->faker->sentence(3),
            'author' => $this->faker->name(),
            'isbn' => $this->faker->isbn13(),
            'publisher' => $this->faker->company(),
            'publication_year' => $publicationYear,
            'category' => $this->faker->randomElement([
                'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
                'Biography', 'Fantasy', 'Mystery', 'Romance', 'Science Fiction'
            ]),
            'description' => $this->faker->paragraph(3),
            'total_copies' => $totalCopies,
            'available_copies' => $this->faker->numberBetween(0, $totalCopies),
            'rating' => $this->faker->randomFloat(2, 1, 5),
            'review_count' => $this->faker->numberBetween(0, 100),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function available(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'available_copies' => $this->faker->numberBetween(1, $attributes['total_copies']),
            ];
        });
    }

    public function unavailable(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'available_copies' => 0,
            ];
        });
    }

    public function highRated(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'rating' => $this->faker->randomFloat(2, 4, 5),
                'review_count' => $this->faker->numberBetween(50, 200),
            ];
        });
    }
}
