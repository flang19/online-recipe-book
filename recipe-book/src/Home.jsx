// src/components/pages/HomePage.jsx
import React, { useEffect } from 'react';
import RecipeCard from './components/RecipeCard';
import {FilterSidebar, Loading} from './components/Slider';
import {useRecipes} from './back'
import { Link, useLocation } from 'react-router-dom';
import RecipeList from './components/RecipeList';


// Open/Closed Principle: Component is open for extension (adding new features) but closed for modification
const HomePage = () => {
  const { recipes, categories, loading, error, activeCategory, setActiveCategory, refreshData } = useRecipes();
  const location = useLocation();

  // Refresh data when navigating back to homepage
  useEffect(() => {
    if (location.state?.refresh) {
      refreshData();
    }
  }, [location.state, refreshData]);

  if (loading) {
    return <Loading message="Loading recipes..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Recipe Collection</h1>
        <Link 
          to="/submit-recipe"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Submit Recipe
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No recipes found in this category.</p>
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-blue-500 hover:underline"
              >
                View all recipes
              </button>
            </div>
          ) : (
            <RecipeList />
          )}
        </div>
        
        <div className="md:w-1/4 order-first md:order-last">
          <FilterSidebar 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;