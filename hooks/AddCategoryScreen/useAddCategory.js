import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import mealService from '../../services/mealService';

/**
 * Hook principal pour gérer l'état de l'écran d'ajout de catégorie
 */
export const useAddCategory = (restaurantId) => {
  const [availableMeals, setAvailableMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const meals = await mealService.getAllMeals();
      setAvailableMeals(meals);
    } catch (error) {
      console.error('Erreur chargement meals:', error);
      Alert.alert('Erreur', 'Impossible de charger les repas');
    } finally {
      setLoading(false);
    }
  };

  return {
    availableMeals,
    loading,
  };
};