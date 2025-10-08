// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format rating with stars
export const formatRating = (rating) => {
  const fullStars = '★'.repeat(Math.floor(rating));
  const emptyStars = '☆'.repeat(5 - Math.floor(rating));
  return fullStars + emptyStars;
};

// Format borrow status with colors
export const formatBorrowStatus = (status) => {
  const statusMap = {
    borrowed: { text: 'Borrowed', color: '#007bff' },
    returned: { text: 'Returned', color: '#28a745' },
    overdue: { text: 'Overdue', color: '#dc3545' },
    cancelled: { text: 'Cancelled', color: '#6c757d' }
  };

  return statusMap[status] || { text: status, color: '#6c757d' };
};

// Format user role
export const formatUserRole = (role) => {
  return role === 'admin' ? 'Administrator' : 'User';
};

// Format book availability
export const formatAvailability = (availableCopies, totalCopies) => {
  if (availableCopies === 0) {
    return { text: 'Out of Stock', color: '#dc3545' };
  } else if (availableCopies < totalCopies / 2) {
    return { text: 'Limited Stock', color: '#ffc107' };
  } else {
    return { text: 'In Stock', color: '#28a745' };
  }
};

// Format time ago
export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return 'just now';
};

// Format currency (Indonesian Rupiah)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};