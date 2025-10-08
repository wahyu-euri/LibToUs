import React, { useState } from 'react';
import { useBorrows } from '../../hooks/useBorrows';
import Pagination from '../../components/common/Pagination';
import Alert from '../../components/ui/Alert';
import { formatDate } from '../../utils/helpers';

const BorrowHistory = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  
  const {
    borrows,
    loading,
    error,
    pagination,
    updateStatus,
    changePage
  } = useBorrows(statusFilter);

  const handleStatusFilter = (newStatus) => {
    setStatusFilter(newStatus);
    updateStatus(newStatus);
  };

  const getStatusColor = (status) => {
    const colors = {
      borrowed: 'status-borrowed',
      returned: 'status-returned',
      overdue: 'status-overdue',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-cancelled';
  };

  return (
    <div className="borrow-history">
      <div className="page-header">
        <h1>Borrow History</h1>
        <p>Your complete borrowing history</p>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Status</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="history-content">
        {loading ? (
          <div className="loading">Loading history...</div>
        ) : borrows.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2>No Borrow History</h2>
            <p>You haven't borrowed any books yet.</p>
            <a href="/catalog" className="btn btn-primary">Browse Books</a>
          </div>
        ) : (
          <>
            <div className="section-header">
              <h2>Borrowing History ({pagination.totalItems})</h2>
            </div>

            <div className="history-list">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                      <th>Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrows.map(borrow => (
                      <tr key={borrow.id}>
                        <td>
                          <div className="book-info-small">
                            <img 
                              src={borrow.book?.cover_image || '/images/default-book-cover.jpg'} 
                              alt={borrow.book?.title}
                              className="book-thumbnail-small"
                            />
                            <div>
                              <strong>{borrow.book?.title}</strong>
                              <span>by {borrow.book?.author}</span>
                            </div>
                          </div>
                        </td>
                        <td>{formatDate(borrow.borrow_date)}</td>
                        <td>{formatDate(borrow.due_date)}</td>
                        <td>
                          {borrow.return_date ? formatDate(borrow.return_date) : '-'}
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColor(borrow.status)}`}>
                            {borrow.status}
                          </span>
                        </td>
                        <td>
                          {borrow.fine_amount ? 
                            `Rp ${borrow.fine_amount.toLocaleString()}` : '-'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={changePage}
                className="mt-4"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BorrowHistory;