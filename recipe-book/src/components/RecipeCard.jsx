import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../back'; // Assuming this is your API import

// StarRating component
export const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
  }
  return <div className="flex">{stars}</div>;
};

// DifficultyBadge component
export const DifficultyBadge = ({ difficulty, className = '' }) => {
  const getBadgeColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <span className={`${getBadgeColor()} text-white px-2 py-1 rounded text-xs font-medium ${className}`}>
      {difficulty}
    </span>
  );
};

// RecipeCard component with delete functionality
const RecipeCard = ({ recipe, onDelete, showDelete = false }) => {
  const { id, name, image, difficulty, rating, cookingTime } = recipe;

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent navigation to recipe details
    e.stopPropagation(); // Prevent event bubbling

    if (window.confirm(`Are you sure you want to delete the recipe "${name}"?`)) {
      try {
        await api.deleteRecipe(id);
        if (onDelete) {
          onDelete(id);
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };

  return (
    <Link to={`/recipe/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <DifficultyBadge difficulty={difficulty} className="absolute top-2 right-2" />
          
          {showDelete && (
            <button
              onClick={handleDelete}
              className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-300"
              aria-label="Delete recipe"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">{name}</h3>
          <div className="flex justify-between items-center">
            <StarRating rating={rating} />
            <span className="text-sm text-gray-600">{cookingTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;