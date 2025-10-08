import React, { useState, useEffect } from 'react';
import { borrowService } from '../../services/borrows';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

const AdminBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchBorrows();
  }, [pagination.currentPage, statusFilter]);

  const fetchBorrows = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await borrowService.getBorrows(params);
      const borrowsData = response.data.data || response.data;
      
      setBorrows(borrowsData);
      setPagination({
        currentPage: response.data.current_page || page,
        totalPages: response.data.last_page || 1,
        totalItems: response.data.total || borrowsData.length
      });
    } catch (error) {
      showAlert('Failed to fetch borrows', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (borrowId, newStatus) => {
    try {
      await borrowService.updateBorrow(borrowId, { status: newStatus });
      showAlert('Borrow status updated successfully', 'success');
      fetchBorrows(pagination.currentPage);
    } catch (error) {
      showAlert('Failed to update borrow status', 'error');
    }
  };

  const calculateFine = (dueDate, returnDate) => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    const daysLate = Math.max(0, Math.floor((returned - due) / (1000 * 60 * 60 * 24)));
    return daysLate * 1000; // Rp 1000 per day
  };

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
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
    <div className="admin-borrows">
      <div className="page-header">
        <h1>Manage Borrows</h1>
        <p>Track and manage book borrows and returns</p>
      </div>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
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

      {loading ? (
        <LoadingSpinner text="Loading borrows..." />
      ) : (
        <>
          <div className="borrows-section">
            <div className="section-header">
              <h2>Borrow Records ({pagination.totalItems})</h2>
            </div>

            <div className="borrows-list">
              {borrows.length === 0 ? (
                <div className="no-data">
                  <p>No borrow records found</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Book</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                        <th>Fine</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrows.map(borrow => {
                        const fineAmount = borrow.status === 'overdue' 
                          ? calculateFine(borrow.due_date, borrow.return_date)
                          : borrow.fine_amount || 0;

                        return (
                          <tr key={borrow.id}>
                            <td>
                              <div className="user-info-small">
                                <strong>{borrow.user?.username}</strong>
                                <span>{borrow.user?.email}</span>
                              </div>
                            </td>
                            <td>
                              <div className="book-info-small">
                                <strong>{borrow.book?.title}</strong>
                                <span>by {borrow.book?.author}</span>
                              </div>
                            </td>
                            <td>{formatDate(borrow.borrow_date)}</td>
                            <td>{formatDate(borrow.due_date)}</td>
                            <td>{borrow.return_date ? formatDate(borrow.return_date) : '-'}</td>
                            <td>
                              <span className={`status-badge ${getStatusColor(borrow.status)}`}>
                                {borrow.status}
                              </span>
                            </td>
                            <td>
                              {fineAmount > 0 ? `Rp ${fineAmount.toLocaleString()}` : '-'}
                            </td>
                            <td>
                              <div className="action-buttons">
                                {borrow.status === 'borrowed' && (
                                  <>
                                    <Button
                                      size="small"
                                      onClick={() => handleStatusUpdate(borrow.id, 'returned')}
                                    >
                                      Mark Returned
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="small"
                                      onClick={() => handleStatusUpdate(borrow.id, 'overdue')}
                                    >
                                      Mark Overdue
                                    </Button>
                                  </>
                                )}
                                {borrow.status === 'overdue' && (
                                  <Button
                                    size="small"
                                    onClick={() => handleStatusUpdate(borrow.id, 'returned')}
                                  >
                                    Mark Returned
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={changePage}
                className="mt-4"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBorrows;