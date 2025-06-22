import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <LoadingSpinner />
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const statsData = [
    {
      title: 'Total Expenses',
      value: formatCurrency(stats?.totalExpenses),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      icon: '💰'
    },
    {
      title: 'This Month',
      value: formatCurrency(stats?.currentMonthTotal),
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      icon: '📅'
    },
    {
      title: 'Total Count',
      value: stats?.totalCount || 0,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      icon: '📊'
    },
    {
      title: 'Average',
      value: formatCurrency(stats?.averageExpense),
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      icon: '📈'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className={`card ${stat.bgColor} hover-lift`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className="text-2xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
