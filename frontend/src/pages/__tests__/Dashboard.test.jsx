import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../context/AuthContext';
import expenseService from '../../services/expenseService';

// Mock services
jest.mock('../../services/expenseService');

// Mock components
jest.mock('../../components/common/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../../components/dashboard/StatsCards', () => {
  return function MockStatsCards({ stats, loading }) {
    return (
      <div data-testid="stats-cards">
        {loading ? 'Loading stats...' : `Stats: ${stats?.totalExpenses || 0}`}
      </div>
    );
  };
});

jest.mock('../../components/expense/CategoryFilter', () => {
  return function MockCategoryFilter({ selectedCategory, onCategoryChange }) {
    return (
      <div data-testid="category-filter">
        <button onClick={() => onCategoryChange('Food')}>
          Filter: {selectedCategory}
        </button>
      </div>
    );
  };
});

jest.mock('../../components/expense/ExpenseList', () => {
  return function MockExpenseList({ expenses, onEdit, onDelete }) {
    return (
      <div data-testid="expense-list">
        {expenses?.map(expense => (
          <div key={expense.id}>
            {expense.title}
            <button onClick={() => onEdit(expense)}>Edit</button>
            <button onClick={() => onDelete(expense)}>Delete</button>
          </div>
        ))}
      </div>
    );
  };
});

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@test.com'
};

jest.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    isLoading: false
  })
}));

const DashboardWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Dashboard Component', () => {
  const mockExpenses = [
    { id: 1, title: 'Coffee', amount: 5.50, category: 'Food' },
    { id: 2, title: 'Gas', amount: 45.00, category: 'Transportation' }
  ];

  const mockStats = {
    totalExpenses: 1000,
    currentMonthTotal: 250,
    totalCount: 45,
    averageExpense: 22.22
  };

  beforeEach(() => {
    jest.clearAllMocks();
    expenseService.getAllExpenses.mockResolvedValue(mockExpenses);
    expenseService.getStatistics.mockResolvedValue(mockStats);
    expenseService.createExpense.mockResolvedValue({ id: 3, title: 'New Expense' });
    expenseService.updateExpense.mockResolvedValue({ id: 1, title: 'Updated Coffee' });
    expenseService.deleteExpense.mockResolvedValue();
  });

  it('renders dashboard with all components', async () => {
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
    expect(screen.getByTestId('category-filter')).toBeInTheDocument();
    expect(screen.getByTestId('expense-list')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument();
      expect(screen.getByText('Gas')).toBeInTheDocument();
    });
  });

  it('loads expenses and stats on mount', async () => {
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      expect(expenseService.getAllExpenses).toHaveBeenCalledTimes(1);
      expect(expenseService.getStatistics).toHaveBeenCalledTimes(1);
    });
  });

  it('handles category filter change', async () => {
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Filter: All')).toBeInTheDocument();
    });

    const filterButton = screen.getByText('Filter: All');
    fireEvent.click(filterButton);

    expect(screen.getByText('Filter: Food')).toBeInTheDocument();
  });

  it('opens add expense form', async () => {
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    const addButton = screen.getByText('Add Expense');
    fireEvent.click(addButton);

    expect(screen.getByTestId('expense-form')).toBeInTheDocument();
  });

  it('handles expense deletion with confirmation', async () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Coffee"?');
    
    await waitFor(() => {
      expect(expenseService.deleteExpense).toHaveBeenCalledWith(1);
    });
  });

  it('displays success message after adding expense', async () => {
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    const addButton = screen.getByText('Add Expense');
    fireEvent.click(addButton);

    // Simulate form submission
    const form = screen.getByTestId('expense-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Expense added successfully!')).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    expenseService.getAllExpenses.mockRejectedValue(new Error('API Error'));

    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load expenses: API Error')).toBeInTheDocument();
    });
  });
});
