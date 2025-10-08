<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Check if user already reviewed this book
        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('book_id', $request->book_id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this book'
            ], Response::HTTP_BAD_REQUEST);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'book_id' => $request->book_id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        // Update book rating
        $this->updateBookRating($request->book_id);

        return response()->json($review, Response::HTTP_CREATED);
    }

    public function userReviews(Request $request)
    {
        $reviews = Review::with('book')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    private function updateBookRating($bookId)
    {
        $book = Book::findOrFail($bookId);
        $reviews = Review::where('book_id', $bookId)->get();

        $averageRating = $reviews->avg('rating');
        $reviewCount = $reviews->count();

        $book->update([
            'rating' => round($averageRating, 2),
            'review_count' => $reviewCount
        ]);
    }
}
