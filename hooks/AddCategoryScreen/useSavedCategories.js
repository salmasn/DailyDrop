import { useState } from 'react';
import { Alert } from 'react-native';
import categoryService from '../../services/categoryService';
import imageService from '../../services/imageService';

/**
 * Hook pour gérer les catégories sauvegardées et leur soumission
 */
export const useSavedCategories = (restaurantId, navigation) => {
  const [savedCategories, setSavedCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const addCategory = (categoryData, meals, editingCategoryId) => {
    const finalCategory = categoryData.name;
    
    if (!finalCategory || meals.length === 0) {
      Alert.alert('Error', 'Please select a category and at least one meal');
      return false;
    }

    if (editingCategoryId) {
      setSavedCategories(savedCategories.map(cat => 
        cat.id === editingCategoryId 
          ? {
              ...cat,
              name: finalCategory,
              meals: meals,
              description: categoryData.description,
              categoryImage: categoryData.categoryImage,
            }
          : cat
      ));
    } else {
      const newCategory = {
        id: Date.now().toString(),
        name: finalCategory,
        meals: meals,
        description: categoryData.description,
        categoryImage: categoryData.categoryImage,
      };
      setSavedCategories([...savedCategories, newCategory]);
    }

    return true;
  };

  const editCategory = (categoryId) => {
    return savedCategories.find(cat => cat.id === categoryId);
  };

  const deleteCategory = (categoryId) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedCategories(savedCategories.filter(cat => cat.id !== categoryId));
          }
        }
      ]
    );
  };

  const submitAllCategories = async () => {
    if (savedCategories.length === 0) {
      Alert.alert('Error', 'Please add at least one category');
      return;
    }

    if (!restaurantId) {
      Alert.alert('Error', 'Restaurant ID not found');
      return;
    }

    try {
      setSubmitting(true);

      const categoriesToSubmit = await Promise.all(
        savedCategories.map(async (category) => {
          let categoryImageUrl = category.categoryImage;

          if (categoryImageUrl?.startsWith('file://')) {
            try {
              categoryImageUrl = await imageService.uploadImage(categoryImageUrl);
            } catch (uploadError) {
              console.error('Erreur upload image:', uploadError);
              categoryImageUrl = undefined;
            }
          }

          const categoryPayload = {
            name: category.name,
            mealNames: category.meals.map(meal => meal.name),
          };

          if (category.description?.trim()) {
            categoryPayload.description = category.description;
          }

          if (categoryImageUrl) {
            categoryPayload.imageUrl = categoryImageUrl;
          }

          return categoryPayload;
        })
      );

      await categoryService.createManyCategories(restaurantId, categoriesToSubmit);
      
      Alert.alert(
        'Success',
        `${savedCategories.length} categor${savedCategories.length > 1 ? 'ies' : 'y'} added successfully!`,
        [{ text: 'Finish', onPress: () => navigation.navigate('OwnerHome') }]
      );
    } catch (error) {
      console.error('Erreur soumission:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit categories';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    savedCategories,
    submitting,
    addCategory,
    editCategory,
    deleteCategory,
    submitAllCategories,
  };
};