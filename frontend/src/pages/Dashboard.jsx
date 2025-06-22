import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import StatsCards from '../components/dashboard/StatsCards';
import ExpenseList from '../components/expense/ExpenseList';
import ExpenseForm from '../components/expense/ExpenseForm';
import CategoryFilter from '../components/expense/CategoryFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import expenseService from '../services/expenseService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load expenses and stats
  useEffect(() => {
    loadExpenses();
    loadStats();
  }, []);

  
  useEffect(() => {
    filterExpensesByCategory();
  }, [expenses, selectedCategory]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      setError('Failed to load expenses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await expenseService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const filterExpensesByCategory = () => {
    if (selectedCategory === 'All') {
      setFilteredExpenses(expenses);
    } else {
      const filtered = expenses.filter(expense => expense.category === selectedCategory);
      setFilteredExpenses(filtered);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddExpense = async (expenseData) => {
    try {
      setFormLoading(true);
      await expenseService.createExpense(expenseData);
      setSuccess('Expense added successfully!');
      setShowForm(false);
      await loadExpenses();
      await loadStats();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditExpense = async (expenseData) => {
    try {
      setFormLoading(true);
      await expenseService.updateExpense(editingExpense.id, expenseData);
      setSuccess('Expense updated successfully!');
      setShowForm(false);
      setEditingExpense(null);
      await loadExpenses();
      await loadStats();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (!window.confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      return;
    }

    try {
      await expenseService.deleteExpense(expense.id);
      setSuccess('Expense deleted successfully!');
      await loadExpenses();
      await loadStats();
    } catch (error) {
      setError('Failed to delete expense: ' + error.message);
    }
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const openAddForm = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')} 
            className="mb-8"
          />
        )}
        
        {success && (
          <Alert 
            type="success" 
            message={success} 
            onClose={() => setSuccess('')} 
            className="mb-8"
          />
        )}

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-lg text-gray-600">Track and manage your expenses with ease</p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/analytics')}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <span>📊</span>
                <span>Analytics</span>
              </button>
              <button
                onClick={openAddForm}
                className="btn btn-primary flex items-center space-x-2"
              >
                <span>+</span>
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-10">
          <StatsCards stats={stats} loading={statsLoading} />
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          expenseStats={expenses}
        />

        {/* Expense Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <ExpenseForm
                  expense={editingExpense}
                  onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
                  onCancel={closeForm}
                  loading={formLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Expense List */}
        <ExpenseList
          expenses={expenses}
          filteredExpenses={filteredExpenses}
          loading={loading}
          onEdit={openEditForm}
          onDelete={handleDeleteExpense}
        />
      </main>
    </div>
  );
};

export default Dashboard;
