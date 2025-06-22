import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseList from '../ExpenseList';

describe('ExpenseList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockExpenses = [
    {
      id: 1,
      title: 'Coffee',
      description: 'Morning coffee',
      amount: 5.50,
      category: 'Food',
      expenseDate: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Gas',
      description: 'Car fuel',
      amount: 45.00,
      category: 'Transportation',
      expenseDate: '2024-01-14',
      createdAt: '2024-01-14T15:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <ExpenseList
        expenses={[]}
        loading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Loading expenses...')).toBeInTheDocument();
  });

  it('renders empty state when no expenses', () => {
    render(
      <ExpenseList
        expenses={[]}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No expenses yet')).toBeInTheDocument();
    expect(screen.getByText('Start tracking your expenses by adding your first expense.')).toBeInTheDocument();
  });

  it('renders list of expenses', () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Gas')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Transportation')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockExpenses[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockExpenses[0]);
  });

  it('displays total amount correctly', () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Look for the formatted total - it might be in MAD currency or USD
    expect(screen.getByText(/50\.50/)).toBeInTheDocument();
    expect(screen.getByText('2 expenses')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 14, 2024')).toBeInTheDocument();
  });

  it('renders filtered expenses when provided', () => {
    const filteredExpenses = [mockExpenses[0]]; // Only coffee

    render(
      <ExpenseList
        expenses={mockExpenses}
        filteredExpenses={filteredExpenses}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.queryByText('Gas')).not.toBeInTheDocument();
    // Look for the amount in any currency format
    expect(screen.getByText(/5\.50/)).toBeInTheDocument();
    expect(screen.getByText('1 expense')).toBeInTheDocument();
  });

  it('shows no results message for filtered expenses', () => {
    render(
      <ExpenseList
        expenses={mockExpenses}
        filteredExpenses={[]}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No expenses found')).toBeInTheDocument();
    expect(screen.getByText('No expenses match the selected category filter.')).toBeInTheDocument();
  });
});
