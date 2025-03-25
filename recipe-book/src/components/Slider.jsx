// src/components/common/Slider.jsx
import React, { useState, useRef, useEffect } from 'react';

// Single Responsibility: Handles horizontal scrolling category filters
const FilterSidebar = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 sticky top-4">
      <h3 className="font-medium text-lg mb-3 text-gray-700">Categories</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`block w-full text-left px-3 py-2 rounded transition-colors ${
            activeCategory === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-700 hover:bg-blue-100'
          }`}
        >
          All Recipes
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`block w-full text-left px-3 py-2 rounded transition-colors ${
              activeCategory === category 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-blue-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};


const Loading = ({ message = 'Loading...' }) => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    );
  };

export {FilterSidebar, Loading};
  