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

  // Get category colors
  const getCategoryColor = (category) => {
    const colors = {
      All: 'bg-gray-100 text-gray-700 border-gray-300',
      Food: 'bg-red-50 text-red-600 border-red-200',
      Transportation: 'bg-blue-50 text-blue-600 border-blue-200',
      Entertainment: 'bg-purple-50 text-purple-600 border-purple-200',
      Healthcare: 'bg-green-50 text-green-600 border-green-200',
      Shopping: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      Utilities: 'bg-gray-50 text-gray-600 border-gray-200',
      Education: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      Travel: 'bg-pink-50 text-pink-600 border-pink-200',
      General: 'bg-gray-50 text-gray-600 border-gray-200'
    };
    return colors[category] || colors.General;
  };

  // Get count for each category
  const getCategoryCount = (category) => {
    if (category === 'All') {
      return expenseStats ? expenseStats.length : 0;
    }
    return expenseStats ? expenseStats.filter(expense => expense.category === category).length : 0;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Filter by Category</h3>
        <span className="text-xs text-gray-500">
          {selectedCategory === 'All' ? 'Showing all expenses' : `Showing ${selectedCategory} expenses`}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
        {categories.map((category) => {
          const count = getCategoryCount(category);
          const isSelected = selectedCategory === category;
          const colorClasses = getCategoryColor(category);
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`m-1 inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-blue-500 ring-offset-1 ' + colorClasses
            : colorClasses + ' hover:shadow-md hover:scale-105'
        }`}
            >
              {category}
              {count > 0 && (
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            isSelected ? 'bg-white bg-opacity-70' : 'bg-white bg-opacity-50'
          }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
