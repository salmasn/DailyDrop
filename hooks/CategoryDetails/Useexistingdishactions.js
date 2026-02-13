import { useState } from 'react';
import { Alert } from 'react-native';
import dishService from '../../services/dishService';
import imageService from '../../services/imageService';

/**
 * Hook pour gérer les actions sur les plats existants (édition, mise à jour)
 */
export const useExistingDishActions = (loadCategoryDetails) => {
  const [submitting, setSubmitting] = useState(false);

  const loadDishForEdit = async (dishId) => {
    try {
      console.log('Chargement du plat pour édition:', dishId);
      const dishData = await dishService.getDishById(dishId);
      console.log('Plat chargé pour édition:', dishData);
      return dishData;
    } catch (error) {
      console.error('Erreur chargement plat:', error);
      Alert.alert('Erreur', 'Impossible de charger le plat pour modification');
      return null;
    }
  };

  const updateExistingDish = async (dishId, formData) => {
    try {
      setSubmitting(true);
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        normalPrice: formData.normalPrice,
        discountedPrice: formData.discountedPrice,
        availableQuantity: formData.availableQuantity,
        components: formData.components,
        timeslots: formData.timeslots,
      };

      // Gérer l'image si elle a changé
      if (formData.dishImage && formData.dishImage.startsWith('file://')) {
        try {
          console.log("Upload de la nouvelle image...");
          const imageUrl = await imageService.uploadDishImage(formData.dishImage);
          updateData.imageUrl = imageUrl;
          console.log("Nouvelle image uploadée:", imageUrl);
        } catch (error) {
          console.error('Erreur upload image:', error);
          Alert.alert('Attention', 'Erreur lors de l\'upload de l\'image, le plat sera mis à jour sans nouvelle image');
        }
      }

      console.log('Mise à jour du plat:', dishId);
      console.log('Données de mise à jour:', updateData);
      
      await dishService.updateDish(dishId, updateData);
      
      Alert.alert('Succès', 'Plat mis à jour avec succès !', [
        {
          text: 'OK',
          onPress: () => {
            loadCategoryDetails();
          }
        }
      ]);
      
      return true;
    } catch (error) {
      console.error('Erreur mise à jour plat:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Échec de la mise à jour';
      Alert.alert('Erreur', errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    loadDishForEdit,
    updateExistingDish,
  };
};