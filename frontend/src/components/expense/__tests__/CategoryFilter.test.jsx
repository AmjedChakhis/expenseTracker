import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter Component', () => {
  const mockOnCategoryChange = jest.fn();
  
  const mockExpenseStats = [
    { id: 1, category: 'Food', amount: 25.50, title: 'Lunch' },
    { id: 2, category: 'Food', amount: 15.75, title: 'Coffee' },
    { id: 3, category: 'Transportation', amount: 12.00, title: 'Bus fare' },
    { id: 4, category: 'Transportation', amount: 45.00, title: 'Gas' },
    { id: 5, category: 'Entertainment', amount: 30.00, title: 'Movie' },
    { id: 6, category: 'Shopping', amount: 120.00, title: 'Clothes' }
  ];

  beforeEach(() => {
    mockOnCategoryChange.mockClear();
  });

  it('renders category filter with label', () => {
    render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
        expenseStats={mockExpenseStats}
      />
    );

    expect(screen.getByText('Category Filter')).toBeInTheDocument();
    expect(screen.getByLabelText('Category Filter')).toBeInTheDocument();
  });

  it('displays correct expense count for selected category', () => {
    render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
        expenseStats={mockExpenseStats}
      />
    );

    expect(screen.getByText('6 expenses')).toBeInTheDocument();
  });

  it('displays singular "expense" when count is 1', () => {
    const singleExpense = [mockExpenseStats[0]];
    
    render(
      <CategoryFilter
        selectedCategory="Food"
        onCategoryChange={mockOnCategoryChange}
        expenseStats={singleExpense}
      />
    );

    expect(screen.getByText('1 expense')).toBeInTheDocument();
  });

  it('renders all category options with correct counts', () => {
    render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
        expenseStats={mockExpenseStats}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    expect(screen.getByRole('option', { name: 'All (6)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Food (2)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Transportation (2)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Entertainment (1)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Shopping (1)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'General (0)' })).toBeInTheDocument();
  });

  it('calls onCategoryChange when a category is selected', () => {
    render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
        expenseStats={mockExpenseStats}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Food' } });

    expect(mockOnCategoryChange).toHaveBeenCalledWith('Food');
    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
  });

  it('handles empty expense stats', () => {
    render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
        expenseStats={[]}
      />
    );

    expect(screen.getByText('0 expenses')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All (0)' })).toBeInTheDocument();
  });

  it('handles null expense stats', () => {
    render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
        expenseStats={null}
      />
    );

    expect(screen.getByText('0 expenses')).toBeInTheDocument();
  });
});
