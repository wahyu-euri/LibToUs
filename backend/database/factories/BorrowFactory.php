<?php

namespace Database\Factories;

use App\Models\Borrow;
use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

class BorrowFactory extends Factory
{
    protected $model = Borrow::class;

    public function definition(): array
    {
        $borrowDate = $this->faker->dateTimeBetween('-2 months', 'now');
        $dueDate = clone $borrowDate;
        $dueDate->modify('+14 days');

        $status = $this->faker->randomElement(['borrowed', 'returned', 'overdue']);

        $returnDate = null;
        $fineAmount = 0;

        if ($status === 'returned') {
            $returnDate = $this->faker->dateTimeBetween($borrowDate, $dueDate);
        } elseif ($status === 'overdue') {
            $returnDate = $this->faker->dateTimeBetween($dueDate, '+10 days');
            $daysOverdue = $returnDate->diff($dueDate)->days;
            $fineAmount = $daysOverdue * 1000; // Rp 1000 per day
        }

        return [
            'user_id' => User::factory(),
            'book_id' => Book::factory(),
            'borrow_date' => $borrowDate,
            'due_date' => $dueDate,
            'return_date' => $returnDate,
            'status' => $status,
            'fine_amount' => $fineAmount,
            'created_at' => $borrowDate,
            'updated_at' => $returnDate ?? $borrowDate,
        ];
    }

    public function borrowed(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'borrowed',
                'return_date' => null,
                'fine_amount' => 0,
            ];
        });
    }

    public function returned(): Factory
    {
        return $this->state(function (array $attributes) {
            $borrowDate = $this->faker->dateTimeBetween('-1 month', '-1 week');
            $dueDate = clone $borrowDate;
            $dueDate->modify('+14 days');
            $returnDate = $this->faker->dateTimeBetween($borrowDate, $dueDate);

            return [
                'status' => 'returned',
                'borrow_date' => $borrowDate,
                'due_date' => $dueDate,
                'return_date' => $returnDate,
                'fine_amount' => 0,
            ];
        });
    }

    public function overdue(): Factory
    {
        return $this->state(function (array $attributes) {
            $borrowDate = $this->faker->dateTimeBetween('-1 month', '-3 weeks');
            $dueDate = clone $borrowDate;
            $dueDate->modify('+14 days');
            $returnDate = $this->faker->dateTimeBetween($dueDate, '+10 days');
            $daysOverdue = $returnDate->diff($dueDate)->days;

            return [
                'status' => 'overdue',
                'borrow_date' => $borrowDate,
                'due_date' => $dueDate,
                'return_date' => $returnDate,
                'fine_amount' => $daysOverdue * 1000,
            ];
        });
    }
}
