<?php

namespace App\Services;

use App\Models\Borrow;
use App\Models\Book;
use Carbon\Carbon;

class BorrowService
{
    public function createBorrow(array $data)
    {
        $book = Book::findOrFail($data['book_id']);

        if ($book->available_copies < 1) {
            throw new \Exception('Book is not available for borrowing');
        }

        $borrow = Borrow::create([
            'user_id' => $data['user_id'],
            'book_id' => $data['book_id'],
            'borrow_date' => $data['borrow_date'],
            'due_date' => $data['due_date'],
            'status' => 'borrowed'
        ]);

        // Update available copies
        $book->decrement('available_copies');

        return $borrow;
    }

    public function returnBook(Borrow $borrow)
    {
        $borrow->update([
            'return_date' => Carbon::now(),
            'status' => 'returned'
        ]);

        // Update available copies
        $borrow->book->increment('available_copies');

        return $borrow;
    }

    public function calculateFine(Borrow $borrow)
    {
        if ($borrow->status !== 'overdue') {
            return 0;
        }

        $dueDate = Carbon::parse($borrow->due_date);
        $returnDate = $borrow->return_date ? Carbon::parse($borrow->return_date) : Carbon::now();

        $daysOverdue = max(0, $dueDate->diffInDays($returnDate));
        $fineAmount = $daysOverdue * 1000; // Rp 1000 per day

        $borrow->update(['fine_amount' => $fineAmount]);

        return $fineAmount;
    }

    public function checkOverdueBorrows()
    {
        $overdueBorrows = Borrow::where('status', 'borrowed')
            ->where('due_date', '<', Carbon::now())
            ->get();

        foreach ($overdueBorrows as $borrow) {
            $borrow->update(['status' => 'overdue']);
            $this->calculateFine($borrow);
        }

        return $overdueBorrows->count();
    }
}
