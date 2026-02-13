import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import categoryService from '../../services/categoryService';
import dishService from '../../services/dishService';

/**
 * Hook principal pour gérer les données de la catégorie et des plats
 */
export const useCategoryDetails = (categoryId, passedCategory) => {
  const [category, setCategory] = useState(passedCategory || {
    id: categoryId,
    name: '',
    description: '',
    imageUrl: null,
    meal: { name: '' }
  });
  
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(!passedCategory);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategoryDetails();
  }, [categoryId]);

  const loadCategoryDetails = async () => {
    try {
      setLoading(true);
      console.log("Chargement des détails pour catégorie:", categoryId);
      
      if (!passedCategory || !passedCategory.name) {
        console.log("Chargement de la catégorie depuis API...");
        const categoryData = await categoryService.getCategoryById(categoryId);
        console.log("Catégorie chargée:", categoryData);
        setCategory(categoryData);
      } else {
        console.log("Catégorie déjà disponible:", category.name);
      }

      const dishesData = await dishService.getDishesByCategory(categoryId);
      console.log("Plats chargés:", dishesData.length, "plats");
      setDishes(dishesData);
      
    } catch (error) {
      console.error('Erreur chargement détails:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategoryDetails();
    setRefreshing(false);
  };

  const handleDeleteDish = async (dishId) => {
    Alert.alert(
      'Supprimer le plat',
      'Êtes-vous sûr de vouloir supprimer ce plat ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await dishService.deleteDish(dishId);
              Alert.alert('Succès', 'Plat supprimé avec succès');
              await loadCategoryDetails();
            } catch (error) {
              console.error('Erreur suppression plat:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le plat');
            }
          }
        }
      ]
    );
  };

  return {
    category,
    dishes,
    loading,
    refreshing,
    onRefresh,
    loadCategoryDetails,
    handleDeleteDish,
  };
};