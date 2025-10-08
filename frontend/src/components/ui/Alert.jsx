import React from 'react';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  className = '' 
}) => {
  if (!message) return null;

  const alertClass = `alert alert-${type} ${className}`;

  return (
    <div className={alertClass}>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        {onClose && (
          <button className="alert-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;