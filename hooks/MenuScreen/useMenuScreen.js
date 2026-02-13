import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import storageService from '../../services/storageService';
import restaurantService from '../../services/restaurantService';
import categoryService from '../../services/categoryService';

// Fonction pour décoder le JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error);
    return null;
  }
};

/**
 * Hook principal pour gérer l'état et la logique du MenuScreen
 */
export const useMenuScreen = () => {
  const [selectedMeal, setSelectedMeal] = useState('All');
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uniqueMeals, setUniqueMeals] = useState([]);

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  /**
   * Récupère les données du restaurant et charge les catégories
   */
  const fetchRestaurantData = async () => {
    console.log("🚀 === DÉBUT FETCHRESTAURANTDATA ===");
    try {
      setLoading(true);
      
      // 1. Récupérer le token JWT
      const token = await storageService.getToken();
      if (!token) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      // 2. Décoder le token pour obtenir le user_id
      const decodedToken = decodeJWT(token);
      const userId = decodedToken?.id || decodedToken?.userId || decodedToken?.sub || decodedToken?.user_id;
      
      if (!userId) {
        Alert.alert("Erreur", "Token invalide. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      // 3. Récupérer le restaurant de l'utilisateur
      const restaurants = await restaurantService.findByUserId(userId);
      
      if (restaurants && restaurants.length > 0) {
        const firstRestaurant = restaurants[0];
        setRestaurantId(firstRestaurant.id);
        console.log("✅ Restaurant ID:", firstRestaurant.id);

        // 4. Charger les catégories du restaurant
        await loadCategories(firstRestaurant.id);
      } else {
        Alert.alert("Information", "Aucun restaurant associé à votre compte.");
      }
    } catch (error) {
      console.error('❌ Erreur dans fetchRestaurantData:', error);
      Alert.alert("Erreur", "Impossible de charger les informations du restaurant.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charge les catégories du restaurant
   */
  const loadCategories = async (restId) => {
    try {
      console.log("📱 Chargement des catégories pour restaurant:", restId);
      const categoriesData = await categoryService.getCategoriesByRestaurant(String(restId));
      console.log("✅ Catégories chargées - Count:", categoriesData?.length);
      
      if (!categoriesData || !Array.isArray(categoriesData)) {
        console.error("❌ Les données retournées ne sont pas un tableau:", categoriesData);
        Alert.alert('Erreur', 'Format de données invalide reçu du serveur');
        return;
      }
      
      setCategories(categoriesData);

      // Extraire les meals uniques
      const mealsMap = new Map();
      categoriesData.forEach((category, index) => {
        console.log(`Catégorie ${index + 1}:`, {
          name: category.name,
          meals: category.meals
        });
        
        if (category.meals && Array.isArray(category.meals)) {
          category.meals.forEach(meal => {
            if (meal && meal.id && !mealsMap.has(meal.id)) {
              mealsMap.set(meal.id, {
                id: meal.id,
                name: meal.name,
              });
            }
          });
        }
      });
      
      const uniqueMealsArray = Array.from(mealsMap.values());
      console.log("✅ Meals uniques extraits:", uniqueMealsArray);
      setUniqueMeals(uniqueMealsArray);
      
    } catch (error) {
      console.error('❌ Erreur chargement catégories:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
      Alert.alert('Erreur', `Impossible de charger les catégories: ${errorMessage}`);
    }
  };

  /**
   * Rafraîchit les données
   */
  const onRefresh = async () => {
    setRefreshing(true);
    if (restaurantId) {
      await loadCategories(restaurantId);
    }
    setRefreshing(false);
  };

  /**
   * Filtre les catégories par meal sélectionné
   */
  const getFilteredCategories = () => {
    return selectedMeal === 'All' 
      ? categories 
      : categories.filter(cat => 
          cat.meals && 
          Array.isArray(cat.meals) && 
          cat.meals.some(meal => meal.name === selectedMeal)
        );
  };

  return {
    selectedMeal,
    setSelectedMeal,
    restaurantId,
    loading,
    refreshing,
    categories,
    uniqueMeals,
    onRefresh,
    loadCategories,
    getFilteredCategories,
  };
};