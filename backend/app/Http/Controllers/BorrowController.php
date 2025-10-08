<?php

namespace App\Http\Controllers;

use App\Models\Borrow;
use App\Models\Book;
use App\Models\SavedBook;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BorrowController extends Controller
{
    public function index(Request $request)
    {
        $query = Borrow::with(['user', 'book']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $borrows = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($borrows);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'borrow_date' => 'required|date',
            'due_date' => 'required|date|after:borrow_date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $book = Book::findOrFail($request->book_id);

        if ($book->available_copies < 1) {
            return response()->json([
                'message' => 'Book is not available for borrowing'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check if user already borrowed this book
        $existingBorrow = Borrow::where('user_id', $request->user()->id)
            ->where('book_id', $request->book_id)
            ->whereIn('status', ['borrowed', 'overdue'])
            ->first();

        if ($existingBorrow) {
            return response()->json([
                'message' => 'You have already borrowed this book'
            ], Response::HTTP_BAD_REQUEST);
        }

        $borrow = Borrow::create([
            'user_id' => $request->user()->id,
            'book_id' => $request->book_id,
            'borrow_date' => $request->borrow_date,
            'due_date' => $request->due_date,
            'status' => 'borrowed'
        ]);

        // Update available copies
        $book->decrement('available_copies');

        return response()->json($borrow, Response::HTTP_CREATED);
    }

    public function returnBook($id, Request $request)
    {
        $borrow = Borrow::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->whereIn('status', ['borrowed', 'overdue'])
            ->firstOrFail();

        $borrow->update([
            'return_date' => Carbon::now(),
            'status' => 'returned'
        ]);

        // Update available copies
        $borrow->book->increment('available_copies');

        return response()->json(['message' => 'Book returned successfully']);
    }

    public function userBorrows(Request $request)
    {
        $status = $request->get('status', 'all');

        $query = Borrow::with('book')
            ->where('user_id', $request->user()->id);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $borrows = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($borrows);
    }

    public function saveBook(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $savedBook = SavedBook::firstOrCreate([
            'user_id' => $request->user()->id,
            'book_id' => $request->book_id
        ]);

        return response()->json($savedBook, Response::HTTP_CREATED);
    }

    public function getSavedBooks(Request $request)
    {
        $savedBooks = SavedBook::with('book')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($savedBooks);
    }

    public function removeSavedBook($id, Request $request)
    {
        $savedBook = SavedBook::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $savedBook->delete();

        return response()->json(['message' => 'Book removed from saved list']);
    }

    public function update(Request $request, $id)
    {
        $borrow = Borrow::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:borrowed,returned,overdue,cancelled',
            'fine_amount' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $borrow->update($request->only(['status', 'fine_amount']));

        return response()->json($borrow);
    }
}
