// src/components/pages/RecipeDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {api}from './back'
import {DifficultyBadge, StarRating} from './components/RecipeCard'
import {Loading } from './components/Slider'

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await api.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <Loading message="Loading recipe details..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to recipes
        </button>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-blue-500 hover:underline"
      >
        ← Back to recipes
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-72 md:h-96">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{recipe.name}</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <DifficultyBadge difficulty={recipe.difficulty} />
            <div className="flex items-center">
              <StarRating rating={recipe.rating} />
              <span className="ml-2 text-gray-600">({recipe.rating} / 5)</span>
            </div>
            <span className="text-gray-600">Cooking time: {recipe.cookingTime} min</span>
            // src/components/pages/RecipeDetailsPage.jsx (continued)
            <span className="text-gray-600">Servings: {recipe.servings}</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {recipe.category}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700">{recipe.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.tips && (
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <h2 className="text-xl font-semibold mb-2">Chef's Tips</h2>
              <p className="text-gray-700">{recipe.tips}</p>
            </div>
          )}

          {recipe.nutrition && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Nutrition Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(recipe.nutrition).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-gray-500 text-sm">{key}</div>
                    <div className="font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;