import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '1.5rem', height: '1.5rem' },
    lg: { width: '2rem', height: '2rem' },
    xl: { width: '3rem', height: '3rem' }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="spinner"
        style={sizeStyles[size]}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
