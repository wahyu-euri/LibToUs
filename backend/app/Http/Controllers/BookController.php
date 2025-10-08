<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        // Sort
        $sort = $request->get('sort', 'title');
        $order = $request->get('order', 'asc');
        $query->orderBy($sort, $order);

        $books = $query->paginate(12);

        return response()->json($books);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|unique:books',
            'publisher' => 'required|string|max:255',
            'publication_year' => 'required|integer|min:1000|max:' . date('Y'),
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'total_copies' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $bookData = $request->except('cover_image');

        if ($request->hasFile('cover_image')) {
            $imagePath = $request->file('cover_image')->store('book_covers', 'public');
            $bookData['cover_image'] = basename($imagePath);
        }

        $bookData['available_copies'] = $bookData['total_copies'];

        $book = Book::create($bookData);

        return response()->json($book, Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $book = Book::with(['reviews.user', 'borrows.user'])->findOrFail($id);
        return response()->json($book);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'isbn' => 'sometimes|required|string|unique:books,isbn,' . $id,
            'publisher' => 'sometimes|required|string|max:255',
            'publication_year' => 'sometimes|required|integer|min:1000|max:' . date('Y'),
            'category' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'total_copies' => 'sometimes|required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $bookData = $request->except('cover_image');

        if ($request->hasFile('cover_image')) {
            // Delete old image
            if ($book->cover_image) {
                Storage::disk('public')->delete('book_covers/' . $book->cover_image);
            }

            $imagePath = $request->file('cover_image')->store('book_covers', 'public');
            $bookData['cover_image'] = basename($imagePath);
        }

        if (isset($bookData['total_copies'])) {
            $borrowedCount = $book->borrows()->whereIn('status', ['borrowed', 'overdue'])->count();
            $bookData['available_copies'] = max(0, $bookData['total_copies'] - $borrowedCount);
        }

        $book->update($bookData);

        return response()->json($book);
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);

        // Delete cover image
        if ($book->cover_image) {
            Storage::disk('public')->delete('book_covers/' . $book->cover_image);
        }

        $book->delete();

        return response()->json(['message' => 'Book deleted successfully']);
    }

    public function getCategories()
    {
        $categories = Book::distinct()->pluck('category');
        return response()->json($categories);
    }

    public function getFeaturedBooks()
    {
        $books = Book::orderBy('rating', 'desc')
                    ->orderBy('review_count', 'desc')
                    ->limit(8)
                    ->get();

        return response()->json($books);
    }

    public function getPopularBooks()
    {
        $books = Book::withCount('borrows')
                    ->orderBy('borrows_count', 'desc')
                    ->limit(8)
                    ->get();

        return response()->json($books);
    }
}
