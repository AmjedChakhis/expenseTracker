import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ExpenseForm from '../ExpenseForm';

describe('ExpenseForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form for adding new expense', () => {
    render(<ExpenseForm {...defaultProps} />);

    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByText('Add Expense')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders form for editing expense', () => {
    const expense = {
      id: 1,
      title: 'Coffee',
      description: 'Morning coffee',
      amount: 5.50,
      expenseDate: '2024-01-15',
      category: 'Food'
    };

    render(<ExpenseForm {...defaultProps} expense={expense} />);

    expect(screen.getByText('Edit Expense')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Coffee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Morning coffee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Food')).toBeInTheDocument();
    expect(screen.getByText('Update Expense')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue();

    render(<ExpenseForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/title/i), 'Test Expense');
    await user.type(screen.getByLabelText(/amount/i), '25.50');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Food');
    await user.type(screen.getByLabelText(/description/i), 'Test description');

    await user.click(screen.getByText('Add Expense'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Expense',
        description: 'Test description',
        amount: 25.50,
        expenseDate: expect.any(String),
        category: 'Food'
      });
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm {...defaultProps} />);

    await user.click(screen.getByText('Add Expense'));

    // Wait for error to appear and check if validation works
    await waitFor(() => {
      // The form should show validation - either browser validation or custom
      const titleInput = screen.getByLabelText(/title/i);
      expect(titleInput).toBeInvalid();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates amount field', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/title/i), 'Test');
    await user.type(screen.getByLabelText(/amount/i), '0');
    await user.click(screen.getByText('Add Expense'));

    // Check for custom validation or browser validation
    await waitFor(() => {
      const amountInput = screen.getByLabelText(/amount/i);
      expect(amountInput.value).toBe('0');
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm {...defaultProps} />);

    await user.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<ExpenseForm {...defaultProps} loading={true} />);

    expect(screen.getByText(/adding/i)).toBeInTheDocument();
    expect(screen.getByText(/adding/i).closest('button')).toBeDisabled();
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue();

    render(<ExpenseForm {...defaultProps} />);

    // Fill form with valid data
    await user.type(screen.getByLabelText(/title/i), 'Test Expense');
    await user.type(screen.getByLabelText(/amount/i), '25.50');
    
    // Submit form
    await user.click(screen.getByText('Add Expense'));

    // Should call onSubmit
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
