import { useState } from 'react';

/**
 * Hook pour gérer la sélection des meals
 */
export const useMealSelection = () => {
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [showMealDropdown, setShowMealDropdown] = useState(false);
  const [showMealInput, setShowMealInput] = useState(false);
  const [customMeal, setCustomMeal] = useState('');

  const handleMealSelect = (meal) => {
    if (meal.name === 'Other') {
      setShowMealInput(true);
      setShowMealDropdown(false);
    } else {
      const isAlreadySelected = selectedMeals.some(m => m.id === meal.id);
      if (!isAlreadySelected) {
        setSelectedMeals([...selectedMeals, meal]);
      }
      setShowMealDropdown(false);
    }
  };

  const handleAddCustomMeal = () => {
    if (customMeal.trim()) {
      const tempMeal = {
        id: `temp-${Date.now()}`,
        name: customMeal.trim(),
        isCustom: true
      };
      setSelectedMeals([...selectedMeals, tempMeal]);
      setCustomMeal('');
      setShowMealInput(false);
    }
  };

  const handleRemoveMeal = (mealId) => {
    setSelectedMeals(selectedMeals.filter(m => m.id !== mealId));
  };

  const resetMealSelection = () => {
    setSelectedMeals([]);
    setCustomMeal('');
    setShowMealDropdown(false);
    setShowMealInput(false);
  };

  const loadMealsForEdit = (meals) => {
    setSelectedMeals(meals);
  };

  return {
    selectedMeals,
    setSelectedMeals,
    showMealDropdown,
    setShowMealDropdown,
    showMealInput,
    setShowMealInput,
    customMeal,
    setCustomMeal,
    handleMealSelect,
    handleAddCustomMeal,
    handleRemoveMeal,
    resetMealSelection,
    loadMealsForEdit,
  };
};