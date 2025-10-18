<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }

        $books = $query->latest()->get();

        return response()->json($books);
    }

    public function show($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['message' => 'Book not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($book);
    }

    public function getFeaturedBooks()
    {
        try {
            // if you have is_featured column
            if (Schema::hasColumn('books', 'is_featured')) {
                $books = Book::where('is_featured', true)->take(8)->get();
            } else {
                // fallback by rating or random
                $books = Book::orderByDesc('rating')->take(8)->get();
                if ($books->isEmpty()) {
                    $books = Book::inRandomOrder()->take(8)->get();
                }
            }

            return response()->json($books);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get featured books', 'error' => $e->getMessage()], 500);
        }
    }

    public function getPopularBooks()
    {
        try {
            if (Schema::hasColumn('books', 'views')) {
            $books = Book::orderByDesc('views')->take(8)->get();
            } else {
                // fallback by review_count or random
                $books = Book::orderByDesc('review_count')->take(8)->get();
                if ($books->isEmpty()) {
                    $books = Book::inRandomOrder()->take(8)->get();
                }
            }

            return response()->json($books);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get popular books', 'error' => $e->getMessage()], 500);
        }
    }

    public function getCategories()
    {
        try {
            // if category is a column
            $categories = Book::select('category')->distinct()->pluck('category');
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get categories', 'error' => $e->getMessage()], 500);
        }
    }

    // Admin methods (store, update, destroy) - basic implementations
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'views' => 'nullable|integer',
            'rating' => 'nullable|numeric'
        ]);

        $book = Book::create($data);

        return response()->json($book, Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Book not found'], Response::HTTP_NOT_FOUND);
        }

        $book->update($request->all());
        return response()->json($book);
    }

    public function destroy($id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Book not found'], Response::HTTP_NOT_FOUND);
        }

        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }
}
