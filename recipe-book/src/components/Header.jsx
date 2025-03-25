// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">Recipe Book</Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            </li>
            <li>
              <Link to="/submit-recipe" className="text-gray-700 hover:text-blue-600">Add Recipe</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;