import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import LoadingSpinner from '../common/LoadingSpinner';
import expenseService from '../../services/expenseService';

const CategoryChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const COLORS = {
    Food: '#ef4444',
    Transportation: '#3b82f6',
    Entertainment: '#8b5cf6',
    Healthcare: '#10b981',
    Shopping: '#f59e0b',
    Utilities: '#6b7280',
    Education: '#6366f1',
    Travel: '#ec4899',
    General: '#64748b'
  };

  useEffect(() => {
    loadCategoryData();
  }, []);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      const categoryData = await expenseService.getCategoryChartData();
      
      // Transform data for recharts
      const chartData = Object.entries(categoryData).map(([category, amount]) => ({
        name: category,
        value: parseFloat(amount),
        color: COLORS[category] || COLORS.General
      }));

      setData(chartData);
    } catch (error) {
      setError('Failed to load category data');
      console.error('Category chart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: <span className="font-semibold">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-semibold">{((data.value / data.payload.total) * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500">No expense data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {value}: {formatCurrency(entry.payload.value)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-y-2">
        {data.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {category.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(category.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
