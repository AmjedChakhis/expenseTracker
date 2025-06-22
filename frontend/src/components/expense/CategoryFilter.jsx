// src/components/expense/CategoryFilter.jsx - Enhanced Minimalistic Version
import React from 'react';

const CategoryFilter = ({ selectedCategory, onCategoryChange, expenseStats }) => {
  // Available categories
  const categories = [
    'All',
    'General',
    'Food',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Utilities',
    'Education',
    'Travel'
  ];

  // Get count for each category
  const getCategoryCount = (category) => {
    if (category === 'All') {
      return expenseStats ? expenseStats.length : 0;
    }
    return expenseStats ? expenseStats.filter(expense => expense.category === category).length : 0;
  };

  const selectedCount = getCategoryCount(selectedCategory);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
          Category Filter
        </label>
        <span className="text-sm text-gray-500">
          {selectedCount} {selectedCount === 1 ? 'expense' : 'expenses'}
        </span>
      </div>
      
      <div className="relative">
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full md:w-64 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-900 cursor-pointer transition-all duration-200 hover:border-gray-300 appearance-none pr-10"
        >
          {categories.map((category) => {
            const count = getCategoryCount(category);
            return (
              <option key={category} value={category}>
                {category} ({count})
              </option>
            );
          })}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;