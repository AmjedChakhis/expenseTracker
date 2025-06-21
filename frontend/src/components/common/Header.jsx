import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-sm">
              ET
            </div>
            <h1 className="ml-2 text-xl font-bold text-gray-900">
              ExpenseTracker
            </h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {user?.username || 'User'}
            </span>
            
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
