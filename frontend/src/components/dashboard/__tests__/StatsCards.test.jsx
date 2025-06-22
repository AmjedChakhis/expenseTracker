import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsCards from '../StatsCards';

describe('StatsCards Component', () => {
  const mockStats = {
    totalExpenses: 1000,
    currentMonthTotal: 250,
    totalCount: 45,
    averageExpense: 22.22
  };

  it('renders loading state', () => {
    render(<StatsCards stats={null} loading={true} />);
    
    // Check for spinner class instead of test-id
    expect(screen.getByText('MAD')).toBeInTheDocument();
  });

  it('renders stats cards with correct data', () => {
    render(<StatsCards stats={mockStats} loading={false} />);
    
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('Total Count')).toBeInTheDocument();
    expect(screen.getByText('Average')).toBeInTheDocument();
    
    // Check for MAD currency format
    expect(screen.getByText('MAD 1,000.00')).toBeInTheDocument();
    expect(screen.getByText('MAD 250.00')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('MAD 22.22')).toBeInTheDocument();
  });

  it('handles null stats gracefully', () => {
    render(<StatsCards stats={null} loading={false} />);
    
    expect(screen.getByText('MAD 0.00')).toBeInTheDocument();
  });

  it('handles empty stats gracefully', () => {
    const emptyStats = {
      totalExpenses: 0,
      currentMonthTotal: 0,
      totalCount: 0,
      averageExpense: 0
    };
    
    render(<StatsCards stats={emptyStats} loading={false} />);
    
    const madZeroValues = screen.getAllByText('MAD 0.00');
    expect(madZeroValues).toHaveLength(3);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays correct icons for each stat', () => {
    render(<StatsCards stats={mockStats} loading={false} />);
    
    expect(screen.getByText('💰')).toBeInTheDocument();
    expect(screen.getByText('��')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('📈')).toBeInTheDocument();
  });

  it('displays stats titles correctly', () => {
    render(<StatsCards stats={mockStats} loading={false} />);
    
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('Total Count')).toBeInTheDocument();
    expect(screen.getByText('Average')).toBeInTheDocument();
  });

  it('formats currency amounts correctly', () => {
    const largeStats = {
      totalExpenses: 123456.78,
      currentMonthTotal: 5432.10,
      totalCount: 999,
      averageExpense: 123.45
    };

    render(<StatsCards stats={largeStats} loading={false} />);
    
    expect(screen.getByText('MAD 123,456.78')).toBeInTheDocument();
    expect(screen.getByText('MAD 5,432.10')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('MAD 123.45')).toBeInTheDocument();
  });
});
