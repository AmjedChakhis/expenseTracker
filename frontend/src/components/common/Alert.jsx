import React from 'react';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const alertClass = `alert alert-${type} ${className}`;

  return (
    <div className={alertClass}>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-4 text-sm font-medium hover:opacity-75"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
