export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const BORROW_STATUS = {
  BORROWED: 'borrowed',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Fantasy',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Horror',
  'Thriller',
  'Children',
  'Young Adult',
  'Poetry',
  'Drama',
  'Comedy',
  'Education',
  'Business',
  'Self-Help'
];

export const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'rating', label: 'Rating' },
  { value: 'publication_year', label: 'Publication Year' },
  { value: 'created_at', label: 'Date Added' }
];

export const ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' }
];

export const BORROW_DURATION_DAYS = 14;
export const FINE_PER_DAY = 1000; // Rp 1000 per day