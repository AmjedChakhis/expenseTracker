import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

// Mock the AuthContext
const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@test.com'
};

const mockAuthContextValue = {
  user: mockUser,
  logout: jest.fn(),
  isAuthenticated: true,
  isLoading: false
};

// Mock useAuth hook
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockAuthContextValue
}));

// Mock useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/dashboard'
  }),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>
}));

describe('Header Component', () => {
  beforeEach(() => {
    mockAuthContextValue.logout.mockClear();
  });

  it('renders the header with logo and navigation', () => {
    render(<Header />);

    expect(screen.getByText('ExpenseTracker')).toBeInTheDocument();
    expect(screen.getByText('💰')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('displays user avatar with first letter of username', () => {
    render(<Header />);

    expect(screen.getByText('T')).toBeInTheDocument(); // First letter of 'testuser'
  });

  it('opens and closes user menu', () => {
    render(<Header />);

    const userButton = screen.getByText('T').closest('button');
    
    // Menu should not be visible initially
    expect(screen.queryByText('Profile Settings')).not.toBeInTheDocument();
    
    // Click to open menu
    fireEvent.click(userButton);
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('calls logout when sign out is clicked', () => {
    render(<Header />);

    const userButton = screen.getByText('T').closest('button');
    fireEvent.click(userButton);
    
    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    expect(mockAuthContextValue.logout).toHaveBeenCalledTimes(1);
  });

  it('has correct navigation links', () => {
    render(<Header />);

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const analyticsLink = screen.getByText('Analytics').closest('a');

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(analyticsLink).toHaveAttribute('href', '/analytics');
  });

  it('applies active class to current page', () => {
    render(<Header />);

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toHaveClass('bg-blue-100', 'text-blue-700');
  });
});
