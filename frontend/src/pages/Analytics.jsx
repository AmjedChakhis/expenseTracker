import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import CategoryChart from '../components/charts/CategoryChart';
import MonthlyChart from '../components/charts/MonthlyChart';
import StatsCards from '../components/dashboard/StatsCards';
import LoadingSpinner from '../components/common/LoadingSpinner';
import expenseService from '../services/expenseService';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all'); // 'all', '30d', '90d', 'year'

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Visualize your spending patterns and trends</p>
          </div>
          
          {/* Date Range Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input w-auto"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsCards stats={stats} loading={loading} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CategoryChart />
          <MonthlyChart />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Category</h3>
            <div className="text-center">
              <div className="text-3xl mb-2">🍔</div>
              <p className="font-semibold text-gray-900">Food</p>
              <p className="text-sm text-gray-600">35% of total expenses</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Trend</h3>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <p className="font-semibold text-green-600">+12%</p>
              <p className="text-sm text-gray-600">vs last month</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Status</h3>
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <p className="font-semibold text-blue-600">On Track</p>
              <p className="text-sm text-gray-600">85% of budget used</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
