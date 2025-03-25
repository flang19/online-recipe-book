// src/App.jsx
import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './Home';
import RecipeDetailsPage from './RecipeDetails';
import RecipeSubmissionForm from './RecipeSubmissionForm';

// Dependency Inversion Principle: High-level modules (App) don't depend on low-level modules
// but both depend on abstractions (Routes)
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
            <Route path="/submit-recipe" element={<RecipeSubmissionForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;