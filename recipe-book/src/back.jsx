// src/services/api.js
// Local storage keys

// Load initial mock data
const initialMockData = {
  categories: [
    'Breakfast', 
    'Lunch', 
    'Dinner', 
    'Dessert', 
    'Appetizer', 
    'Soup', 
    'Salad', 
    'Vegetarian', 
    'Vegan', 
    'Gluten-Free'
  ],
  
  recipes: [
    {
      id: '1',
      name: 'Classic Pancakes',
      description: 'Fluffy, golden pancakes made from scratch. Top with your favorite fruits, syrups, or whipped cream for a delicious breakfast treat.',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800',
      difficulty: 'Easy',
      rating: 4.8,
      cookingTime: 20,
      servings: 4,
      category: 'Breakfast',
      ingredients: [
        '2 cups all-purpose flour',
        '2 tbsp sugar',
        '2 tsp baking powder',
        '1 tsp baking soda',
        '1/2 tsp salt',
        '2 cups buttermilk',
        '2 large eggs',
        '1/4 cup unsalted butter, melted',
        '1 tsp vanilla extract',
        'Cooking spray or additional butter for the pan'
      ],
      instructions: [
        'In a large bowl, whisk together the flour, sugar, baking powder, baking soda, and salt.',
        'In another bowl, whisk together the buttermilk, eggs, melted butter, and vanilla extract.',
        'Pour the wet ingredients into the dry ingredients and stir just until combined. Do not overmix; a few lumps are okay.',
        'Heat a griddle or large non-stick pan over medium heat. Lightly coat with cooking spray or butter.',
        'For each pancake, pour about 1/4 cup of batter onto the griddle.',
        'Cook until bubbles form on the surface and the edges look set, about 2-3 minutes.',
        'Flip and cook until golden brown on the other side, about 1-2 minutes more.',
        'Serve immediately with your favorite toppings.'
      ],
      tips: 'For extra fluffy pancakes, let the batter rest for 5 minutes before cooking. Also, don\'t flip until you see bubbles forming on the surface.',
      nutrition: {
        Calories: '320 kcal',
        Protein: '9g',
        Carbs: '42g',
        Fat: '12g'
      }
    }
  ]
};

// Initialize data in local storage if not exists
const STORAGE_KEYS = {
  RECIPES: 'app_recipes_data'
};

const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(initialMockData));
  }
};

// Get data from local storage
const getLocalData = () => {
  initializeLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES));
};

// Save data to local storage
const saveLocalData = (data) => {
  localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(data));
};

// Interface Segregation Principle: Clean API interface
const api = {
  // Fetch all recipes
  async getRecipes() {
    // Get from local storage with delay to simulate API
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData();
        resolve(data.recipes);
      }, 800);
    });
  },

  // Fetch a single recipe by ID
  async getRecipeById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = getLocalData();
        const recipe = data.recipes.find(recipe => recipe.id === id);
        if (recipe) {
          resolve(recipe);
        } else {
          reject(new Error('Recipe not found'));
        }
      }, 500);
    });
  },

  // Fetch all categories
  async getCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData();
        resolve(data.categories);
      }, 300);
    });
  },

  // Add a new recipe
  async addRecipe(recipeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData();
        // Generate a new ID (simple implementation)
        const newId = (Math.max(...data.recipes.map(r => parseInt(r.id)), 0) + 1).toString();
        // Add default rating if not provided
        const newRecipe = {
          ...recipeData,
          id: newId,
          rating: recipeData.rating || 5.0
        };
        // Add to local data
        data.recipes.push(newRecipe);
        saveLocalData(data);
        resolve(newRecipe);
      }, 600);
    });
  },
  
  // Delete a recipe by ID
  async deleteRecipe(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = getLocalData();
        const recipeIndex = data.recipes.findIndex(recipe => recipe.id === id);
        
        if (recipeIndex === -1) {
          reject(new Error('Recipe not found'));
          return;
        }
        
        // Remove the recipe
        data.recipes.splice(recipeIndex, 1);
        saveLocalData(data);
        
        resolve({ success: true, id });
      }, 600);
    });
  }
};

// Custom hook for fetching recipes
import { useState, useEffect } from 'react';

const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recipesData, categoriesData] = await Promise.all([
          api.getRecipes(),
          api.getCategories()
        ]);
        setRecipes(recipesData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRecipes = activeCategory === 'all'
    ? recipes
    : recipes.filter(recipe => recipe.category === activeCategory);

  // Function to delete a recipe
  const deleteRecipe = async (id) => {
    try {
      setLoading(true);
      await api.deleteRecipe(id);
      
      // Update local state after successful deletion
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    recipes: filteredRecipes,
    allRecipes: recipes, // Providing access to all recipes regardless of filter
    categories,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    // Function to refresh data
    refreshData: async () => {
      try {
        setLoading(true);
        const recipesData = await api.getRecipes();
        setRecipes(recipesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    // Added delete function
    deleteRecipe
  };
};

export { api, useRecipes };