import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './back';

const RecipeSubmissionForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&w=800',
    difficulty: 'Medium',
    cookingTime: 30,
    servings: 4,
    category: 'Dinner',
    ingredients: [''],
    instructions: [''],
    tips: '',
    nutrition: {
      Calories: '',
      Protein: '',
      Carbs: '',
      Fat: ''
    }
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await api.getCategories();
        setCategories(fetchedCategories);
        
        // Set the first category as default if categories are available
        if (fetchedCategories.length > 0) {
          setFormData(prev => ({
            ...prev,
            category: fetchedCategories[0]
          }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback categories if API fails
        setCategories(['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Appetizer', 
                      'Soup', 'Salad', 'Vegetarian', 'Vegan', 'Gluten-Free']);
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [name]: value
      }
    }));
  };

  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.addRecipe(formData);
      navigate('/');
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to submit recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-blue-500 hover:underline"
      >
        ← Back to recipes
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold mb-6">Submit New Recipe</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Recipe Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    {categories.length > 0 ? (
                      categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))
                    ) : (
                      <option value="Loading">Loading categories...</option>
                    )}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cooking Time (minutes)</label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ingredients*</label>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleArrayChange(e, index, 'ingredients')}
                      className="w-full p-2 border rounded"
                      placeholder={`Ingredient ${index + 1}`}
                      required
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'ingredients')}
                        className="ml-2 text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients')}
                  className="text-blue-500 text-sm mt-1"
                >
                  + Add Ingredient
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Instructions*</label>
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex mb-2">
                    <textarea
                      value={instruction}
                      onChange={(e) => handleArrayChange(e, index, 'instructions')}
                      className="w-full p-2 border rounded"
                      placeholder={`Step ${index + 1}`}
                      rows="2"
                      required
                    />
                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'instructions')}
                        className="ml-2 text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('instructions')}
                  className="text-blue-500 text-sm mt-1"
                >
                  + Add Instruction
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Chef's Tips</label>
                <textarea
                  name="tips"
                  value={formData.tips}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nutrition Information</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="Calories"
                    value={formData.nutrition.Calories}
                    onChange={handleNutritionChange}
                    className="w-full p-2 border rounded"
                    placeholder="Calories (e.g., 320 kcal)"
                  />
                  <input
                    type="text"
                    name="Protein"
                    value={formData.nutrition.Protein}
                    onChange={handleNutritionChange}
                    className="w-full p-2 border rounded"
                    placeholder="Protein (e.g., 9g)"
                  />
                  <input
                    type="text"
                    name="Carbs"
                    value={formData.nutrition.Carbs}
                    onChange={handleNutritionChange}
                    className="w-full p-2 border rounded"
                    placeholder="Carbs (e.g., 42g)"
                  />
                  <input
                    type="text"
                    name="Fat"
                    value={formData.nutrition.Fat}
                    onChange={handleNutritionChange}
                    className="w-full p-2 border rounded"
                    placeholder="Fat (e.g., 12g)"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeSubmissionForm;