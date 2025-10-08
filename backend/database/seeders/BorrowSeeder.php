<?php

namespace Database\Seeders;

use App\Models\Borrow;
use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BorrowSeeder extends Seeder
{
    public function run(): void
    {
        // Get some users and books to create borrow records
        $users = User::where('role', 'user')->get();
        $books = Book::all();

        if ($users->isEmpty() || $books->isEmpty()) {
            $this->command->info('No users or books found. Please run UserSeeder and BookSeeder first.');
            return;
        }

        $borrowStatuses = ['borrowed', 'returned', 'overdue'];

        // Create borrow records for each user
        foreach ($users as $user) {
            // Each user borrows 2-5 books
            $numberOfBorrows = rand(2, 5);

            for ($i = 0; $i < $numberOfBorrows; $i++) {
                $book = $books->random();
                $status = $borrowStatuses[array_rand($borrowStatuses)];

                $borrowDate = Carbon::now()->subDays(rand(1, 60));
                $dueDate = $borrowDate->copy()->addDays(14);

                $returnDate = null;
                $fineAmount = 0;

                if ($status === 'returned') {
                    $returnDate = $dueDate->copy()->subDays(rand(0, 5));
                } elseif ($status === 'overdue') {
                    $returnDate = $dueDate->copy()->addDays(rand(1, 10));
                    // Calculate fine: Rp 1000 per day overdue
                    $daysOverdue = $returnDate->diffInDays($dueDate);
                    $fineAmount = $daysOverdue * 1000;
                }

                // Check if book is available
                if ($book->available_copies > 0) {
                    Borrow::create([
                        'user_id' => $user->id,
                        'book_id' => $book->id,
                        'borrow_date' => $borrowDate,
                        'due_date' => $dueDate,
                        'return_date' => $returnDate,
                        'status' => $status,
                        'fine_amount' => $fineAmount,
                        'created_at' => $borrowDate,
                        'updated_at' => $returnDate ?? $borrowDate,
                    ]);

                    // Update book available copies if not returned
                    if ($status !== 'returned') {
                        $book->decrement('available_copies');
                    }
                }
            }
        }

        $this->command->info('Borrow records created successfully!');
        $this->command->info('Borrowed: ' . Borrow::where('status', 'borrowed')->count());
        $this->command->info('Returned: ' . Borrow::where('status', 'returned')->count());
        $this->command->info('Overdue: ' . Borrow::where('status', 'overdue')->count());
    }
}
