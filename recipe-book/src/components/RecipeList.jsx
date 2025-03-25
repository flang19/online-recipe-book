import React from 'react';
import RecipeCard from './RecipeCard';
import { useRecipes } from '../back';

const RecipeList = () => {
  const { recipes, loading, error, deleteRecipe } = useRecipes();

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>Error loading recipes: {error}</p>;
  if (recipes.length === 0) return <p>No recipes found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(recipe => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onDelete={deleteRecipe}
          showDelete={true}
        />
      ))}
    </div>
  );
};

export default RecipeList;