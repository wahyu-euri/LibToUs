import React from "react";
import { useBorrows } from "../../hooks/useBorrow";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Pagination from "../../components/common/Pagination";
import { formatDate } from "../../utils/helpers";
import "./styles/CurrentBorrows.css";

const CurrentBorrows = () => {
  const {
    borrows,
    loading,
    error,
    status,
    pagination,
    updateStatus,
    changePage,
    returnBook,
  } = useBorrows("active");

  const handleReturn = async (borrowId) => {
    const result = await returnBook(borrowId);
    if (result.success) {
      // Status will be updated automatically via refresh
    }
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeBorrows = borrows.filter(
    (borrow) => borrow.status === "borrowed" || borrow.status === "overdue"
  );

  return (
    <div className="current-borrows">
      <div className="container">
        <div className="page-header">
          <h1>Current Borrows</h1>
          <p>Books you currently have borrowed</p>
        </div>
        <div className="btn-borrow-history">
            <a href="/borrow-history" className="btn btn-secondary">
              View Borrow History
            </a>
          </div>

        {error && <Alert type="error" message={error} />}

        <div className="borrows-content">
          {loading ? (
            <div className="loading">Loading your borrows...</div>
          ) : activeBorrows.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h2>No Active Borrows</h2>
              <p>You don't have any books borrowed at the moment.</p>
              <a href="/catalog" className="btn btn-primary">
                Browse Books
              </a>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h2>Active Borrows ({activeBorrows.length})</h2>
              </div>

              <div className="borrows-list">
                {activeBorrows.map((borrow) => {
                  const daysRemaining = getDaysRemaining(borrow.due_date);
                  const isOverdue = daysRemaining < 0;

                  return (
                    <div key={borrow.id} className="borrow-card">
                      <div className="book-info">
                        <img
                          src={
                            borrow.book?.cover_image ||
                            "/images/default-book-cover.jpg"
                          }
                          alt={borrow.book?.title}
                          className="book-thumbnail"
                        />
                        <div className="book-details">
                          <h3>{borrow.book?.title}</h3>
                          <p className="book-author">
                            by {borrow.book?.author}
                          </p>
                          <div className="borrow-meta">
                            <div className="meta-item">
                              <span className="meta-label">Borrowed On</span>
                              <span className="meta-value">
                                {formatDate(borrow.borrow_date)}
                              </span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Due Date</span>
                              <span
                                className={`meta-value ${
                                  isOverdue ? "overdue" : ""
                                }`}
                              >
                                {formatDate(borrow.due_date)}
                              </span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Status</span>
                              <span
                                className={`status-badge ${
                                  isOverdue
                                    ? "status-overdue"
                                    : "status-borrowed"
                                }`}
                              >
                                {isOverdue ? "Overdue" : "Borrowed"}
                              </span>
                            </div>
                          </div>
                          {isOverdue && (
                            <div className="overdue-warning">
                              <strong>
                                Overdue by {Math.abs(daysRemaining)} days
                              </strong>
                              <span>
                                Please return this book as soon as possible.
                              </span>
                            </div>
                          )}
                          {!isOverdue && (
                            <div className="due-soon">
                              <strong>{daysRemaining} days remaining</strong>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="borrow-actions">
                        <Button
                          variant="primary"
                          onClick={() => handleReturn(borrow.id)}
                        >
                          Return Book
                        </Button>
                        <a
                          href={`/book/${borrow.book?.id}`}
                          className="btn btn-secondary"
                        >
                          View Book
                        </a>
                      </div>
                    </div>
                  );
                })}
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
    </div>
  );
};

export default CurrentBorrows;
