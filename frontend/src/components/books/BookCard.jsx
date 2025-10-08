import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const {
    id,
    title,
    author,
    cover_image,
    rating,
    review_count,
    available_copies
  } = book;

  return (
    <div className="book-card">
      <Link to={`/book/${id}`} className="book-card-link">
        <div className="book-card-image">
          <img 
            src={cover_image || '/images/default-book-cover.jpg'} 
            alt={title}
            onError={(e) => {
              e.target.src = '/images/default-book-cover.jpg';
            }}
          />
          {available_copies === 0 && (
            <div className="book-unavailable">Out of Stock</div>
          )}
        </div>
        
        <div className="book-card-content">
          <h3 className="book-title">{title}</h3>
          <p className="book-author">by {author}</p>
          
          <div className="book-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.floor(rating))}
              {'☆'.repeat(5 - Math.floor(rating))}
            </span>
            <span className="rating-text">
              {rating} ({review_count} reviews)
            </span>
          </div>
          
          <div className="book-availability">
            {available_copies > 0 ? (
              <span className="available">{available_copies} available</span>
            ) : (
              <span className="unavailable">Out of stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;