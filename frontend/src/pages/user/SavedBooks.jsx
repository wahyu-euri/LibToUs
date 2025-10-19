import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookService } from "../../services/books";
import BookGrid from "../../components/books/BookGrid";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./styles/SavedBooks.css";

const SavedBooks = () => {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchSavedBooks();
  }, []);

  const fetchSavedBooks = async () => {
    try {
      const response = await bookService.getSavedBooks();
      const savedBooksData = response.data.data || response.data;
      // Extract book objects from saved books
      const books = savedBooksData.map((item) => item.book || item);
      setSavedBooks(books);
    } catch (error) {
      showAlert("Failed to load saved books", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (bookId, savedId) => {
    try {
      await bookService.removeSavedBook(savedId || bookId);
      showAlert("Book removed from saved list", "success");
      fetchSavedBooks();
    } catch (error) {
      showAlert("Failed to remove book from saved list", "error");
    }
  };

  const showAlert = (message, type = "error") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  if (loading) {
    return <LoadingSpinner text="Loading your saved books..." />;
  }

  return (
    <div className="saved-books">
      <div className="container">
        <div className="page-header">
          <h1>Saved Books</h1>
          <p>Your personal collection of favorite books</p>
        </div>

        {alert.show && <Alert type={alert.type} message={alert.message} />}

        <div className="saved-books-content">
          {savedBooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h2>No Saved Books Yet</h2>
              <p>
                Start building your reading list by saving books you're
                interested in.
              </p>
              <Link to="/catalog">
                <Button variant="primary">Browse Catalog</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h2>Your Saved Books ({savedBooks.length})</h2>
              </div>

              <BookGrid books={savedBooks} />

              <div className="saved-books-actions">
                {savedBooks.map((book) => (
                  <div key={book.id} className="saved-book-item">
                    <div className="book-info">
                      <img
                        src={
                          book.cover_image || "/images/default-book-cover.jpg"
                        }
                        alt={book.title}
                        className="book-thumbnail"
                      />
                      <div className="book-details">
                        <Link to={`/book/${book.id}`}>
                          <h3>{book.title}</h3>
                        </Link>
                        <p className="book-author">by {book.author}</p>
                        <div className="book-meta">
                          <span>Rating: {book.rating}/5</span>
                          <span>Available: {book.available_copies}</span>
                        </div>
                      </div>
                    </div>
                    <div className="book-actions">
                      <Link to={`/book/${book.id}`}>
                        <Button variant="secondary" size="small">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() =>
                          handleRemoveSaved(book.id, book.saved_id)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedBooks;
