import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const ExpenseList = ({ expenses, loading, onEdit, onDelete, filteredExpenses }) => {
  // Use filtered expenses if provided, otherwise use all expenses
  const displayExpenses = filteredExpenses || expenses;

  if (loading) {
    return (
      <div className="card">
        <LoadingSpinner />
        <p className="text-center text-gray-500 mt-4">Loading expenses...</p>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No expenses yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start tracking your expenses by adding your first expense.
        </p>
      </div>
    );
  }

  if (!displayExpenses || displayExpenses.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No expenses found
        </h3>
        <p className="text-gray-500 mb-6">
          No expenses match the selected category filter.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-red-50 text-red-600',
      Transportation: 'bg-blue-50 text-blue-600',
      Entertainment: 'bg-purple-50 text-purple-600',
      Healthcare: 'bg-green-50 text-green-600',
      Shopping: 'bg-yellow-50 text-yellow-600',
      Utilities: 'bg-gray-50 text-gray-600',
      Education: 'bg-indigo-50 text-indigo-600',
      Travel: 'bg-pink-50 text-pink-600',
      General: 'bg-gray-50 text-gray-600'
    };
    return colors[category] || colors.General;
  };

  // Calculate total for filtered expenses
  const totalAmount = displayExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {filteredExpenses ? 'Filtered' : 'Recent'} Expenses
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {displayExpenses.length} {displayExpenses.length === 1 ? 'expense' : 'expenses'}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            Total: {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {displayExpenses.map((expense) => (
          <div 
            key={expense.id} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-5 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {expense.title}
                  </h3>
                  <span className={`px-4 py-1 rounded text-xs font-small ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </div>
                
                {expense.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {expense.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{formatDate(expense.expenseDate)}</span>
                  <span>•</span>
                  <span>{formatDate(expense.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(expense)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
