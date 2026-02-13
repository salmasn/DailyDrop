import { Alert } from 'react-native';
import categoryService from '../../services/categoryService';

/**
 * Hook pour gérer les actions sur les catégories (ajout, suppression, navigation)
 */
export const useCategoryActions = (navigation, restaurantId, loadCategories) => {
  
  /**
   * Navigue vers l'écran d'ajout de catégorie
   */
  const handleAddCategory = () => {
    if (!restaurantId) {
      Alert.alert(
        "Action impossible", 
        "L'ID du restaurant n'a pas été trouvé. Veuillez patienter ou redémarrer l'application."
      );
      return;
    }
    navigation.navigate('AddCategoryScreen', { restaurantId: String(restaurantId) });
  };

  /**
   * Supprime une catégorie
   */
  const handleDeleteCategory = async (categoryId) => {
    Alert.alert(
      'Supprimer la catégorie',
      'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await categoryService.deleteCategory(categoryId);
              Alert.alert('Succès', 'Catégorie supprimée avec succès');
              if (restaurantId) {
                await loadCategories(restaurantId);
              }
            } catch (error) {
              console.error('❌ Erreur suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la catégorie');
            }
          }
        }
      ]
    );
  };

  /**
   * Navigue vers les détails d'une catégorie
   */
  const handleViewCategory = (category) => {
    navigation.navigate('CategoryDetails', { 
      categoryId: category.id,
      category: category
    });
  };

  /**
   * Navigue vers l'édition d'une catégorie
   */
  const handleEditCategory = (categoryId) => {
    navigation.navigate('EditCategory', { categoryId });
  };

  return {
    handleAddCategory,
    handleDeleteCategory,
    handleViewCategory,
    handleEditCategory,
  };
};