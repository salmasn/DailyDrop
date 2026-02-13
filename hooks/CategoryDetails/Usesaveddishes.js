import { useState } from 'react';
import { Alert } from 'react-native';
import dishService from '../../services/dishService';
import imageService from '../../services/imageService';

/**
 * Hook pour gérer la liste des plats en attente et leur soumission
 */
export const useSavedDishes = (categoryId, loadCategoryDetails) => {
  const [savedDishes, setSavedDishes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const addDishToList = (dishData, editingDishId) => {
    if (editingDishId) {
      // Éditer un plat en attente
      setSavedDishes(savedDishes.map(dish => 
        dish.id === editingDishId ? { ...dish, ...dishData } : dish
      ));
    } else {
      // Ajouter un nouveau plat en attente
      const newDish = {
        id: Date.now().toString(),
        ...dishData
      };
      setSavedDishes([...savedDishes, newDish]);
    }
  };

  const editSavedDish = (dishId) => {
    return savedDishes.find(d => d.id === dishId);
  };

  const deleteSavedDish = (dishId) => {
    Alert.alert(
      'Supprimer le plat',
      'Êtes-vous sûr de vouloir supprimer ce plat ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setSavedDishes(savedDishes.filter(d => d.id !== dishId));
          }
        }
      ]
    );
  };

  const submitAllDishes = async () => {
    if (savedDishes.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins un plat');
      return;
    }

    try {
      setSubmitting(true);

      const dishesToSubmit = await Promise.all(
        savedDishes.map(async (dish) => {
          let imageUrl = dish.dishImage;

          if (imageUrl && imageUrl.startsWith('file://')) {
            try {
              console.log("Upload de l'image pour:", dish.name);
              imageUrl = await imageService.uploadDishImage(imageUrl);
              console.log("Image uploadée:", imageUrl);
            } catch (error) {
              console.error('Erreur upload image:', error);
              imageUrl = null;
            }
          }

          const dishPayload = {
            name: dish.name,
            normalPrice: dish.normalPrice,
          };

          if (dish.description) dishPayload.description = dish.description;
          if (dish.discountedPrice) dishPayload.discountedPrice = dish.discountedPrice;
          if (dish.availableQuantity !== null && dish.availableQuantity !== undefined) {
            dishPayload.availableQuantity = dish.availableQuantity;
          }
          
          if (imageUrl && imageUrl.startsWith('http')) {
            dishPayload.imageUrl = imageUrl;
          }
          
          if (dish.components && dish.components.length > 0) {
            dishPayload.components = dish.components;
          }
          if (dish.timeslots && dish.timeslots.length > 0) {
            dishPayload.timeslots = dish.timeslots;
          }

          return dishPayload;
        })
      );

      await dishService.createManyDishes(categoryId, dishesToSubmit);
      
      Alert.alert(
        'Succès',
        `${savedDishes.length} plat${savedDishes.length > 1 ? 's' : ''} ajouté${savedDishes.length > 1 ? 's' : ''} avec succès !`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSavedDishes([]);
              loadCategoryDetails();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erreur soumission:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Échec de la soumission des plats';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    savedDishes,
    submitting,
    addDishToList,
    editSavedDish,
    deleteSavedDish,
    submitAllDishes,
  };
};