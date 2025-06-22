import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const ExpenseForm = ({ expense, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    category: 'General'
  });
  const [error, setError] = useState('');

  // Categories for dropdown
  const categories = [
    'General',
    'Food',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Utilities',
    'Education',
    'Travel'
  ];

  // Populate form if editing
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        expenseDate: expense.expenseDate || new Date().toISOString().split('T')[0],
        category: expense.category || 'General'
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!formData.expenseDate) {
      setError('Date is required');
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      await onSubmit(expenseData);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="input"
              placeholder="e.g., Grocery shopping"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="input"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="input"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="expenseDate" className="form-label">
              Date *
            </label>
            <input
              type="date"
              id="expenseDate"
              name="expenseDate"
              className="input"
              value={formData.expenseDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            className="input"
            rows="3"
            placeholder="Add a description..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {expense ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              expense ? 'Update Expense' : 'Add Expense'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
