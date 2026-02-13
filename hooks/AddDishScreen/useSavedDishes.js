import { useState } from 'react';
import { Alert } from 'react-native';
import dishService from '../../services/dishService';
import imageService from '../../services/imageService';

/**
 * Hook pour gérer les plats sauvegardés et leur soumission
 */
export const useSavedDishes = (categoryId, navigation) => {
  const [savedDishes, setSavedDishes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const addDish = (dishData, editingDishId) => {
    if (editingDishId) {
      // Mise à jour d'un plat existant
      setSavedDishes(savedDishes.map(dish => 
        dish.id === editingDishId 
          ? { id: dish.id, ...dishData }
          : dish
      ));
    } else {
      // Ajout d'un nouveau plat
      const newDish = {
        id: Date.now().toString(),
        ...dishData,
      };
      setSavedDishes([...savedDishes, newDish]);
    }
  };

  const editDish = (dishId) => {
    return savedDishes.find(d => d.id === dishId);
  };

  const deleteDish = (dishId) => {
    Alert.alert(
      'Delete Dish',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedDishes(savedDishes.filter(d => d.id !== dishId));
          }
        }
      ]
    );
  };

  const submitAllDishes = async () => {
    console.log("Début handleSubmit dishes");
    
    if (savedDishes.length === 0) {
      Alert.alert('Error', 'Please add at least one dish');
      return;
    }

    console.log("Nombre de plats à soumettre:", savedDishes.length);
    console.log("Category ID:", categoryId);

    try {
      setSubmitting(true);

      const dishesToSubmit = await Promise.all(
        savedDishes.map(async (dish) => {
          let dishImageUrl = dish.dishImage;

          // Upload de l'image si locale
          if (dishImageUrl && dishImageUrl.startsWith('file://')) {
            try {
              console.log("Upload de l'image pour:", dish.name);
              dishImageUrl = await imageService.uploadImage(dishImageUrl);
              console.log("Image uploadée:", dishImageUrl);
            } catch (uploadError) {
              console.error('Erreur upload image pour:', dish.name, uploadError);
              dishImageUrl = undefined;
            }
          }

          const dishPayload = {
            name: dish.name,
            normalPrice: dish.normalPrice,
          };

          if (dish.description) {
            dishPayload.description = dish.description;
          }

          if (dish.discountedPrice) {
            dishPayload.discountedPrice = dish.discountedPrice;
          }

          if (dish.discountPercentage) {
            dishPayload.discountPercentage = dish.discountPercentage;
          }

          if (dish.availableQuantity !== null && dish.availableQuantity !== undefined) {
            dishPayload.availableQuantity = dish.availableQuantity;
          }

          if (dishImageUrl) {
            dishPayload.imageUrl = dishImageUrl;
          }

          if (dish.timeslots && dish.timeslots.length > 0) {
            dishPayload.timeslots = dish.timeslots;
          }

          console.log("Payload pour", dish.name, ":", dishPayload);
          return dishPayload;
        })
      );

      console.log("Envoi de", dishesToSubmit.length, "plats au serveur");
      const result = await dishService.createManyDishes(categoryId, dishesToSubmit);
      console.log("Réponse du serveur:", result);
      
      Alert.alert(
        'Success',
        `${savedDishes.length} dish${savedDishes.length > 1 ? 'es' : ''} added successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Erreur soumission:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit dishes';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
      console.log("Fin handleSubmit dishes");
    }
  };

  return {
    savedDishes,
    submitting,
    addDish,
    editDish,
    deleteDish,
    submitAllDishes,
  };
};