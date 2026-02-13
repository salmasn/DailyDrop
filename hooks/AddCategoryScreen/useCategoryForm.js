import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const AVAILABLE_CATEGORIES = [
  'Pizza', 'Burger', 'Tacos', 'Sandwich', 'Salad',
  'Pasta', 'Meat', 'Fish', 'Vegetarian', 'Fast Food', 'Traditional',
  'Oriental', 'Asian', 'Sweet', 'Savory', 'Beverages', 'Dessert',
  'Pastries', 'Grilled', 'Wraps', 'Sushi', 'Crepes', 'Ice Cream',
  'Smoothies', 'Other'
];

/**
 * Hook pour gérer le formulaire de catégorie
 */
export const useCategoryForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const handleCategorySelect = (category) => {
    if (category === 'Other') {
      setShowCategoryInput(true);
      setShowCategoryDropdown(false);
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
      setShowCategoryDropdown(false);
      setShowCategoryInput(false);
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setSelectedCategory(customCategory.trim());
      setShowCategoryInput(false);
    }
  };

  const handleSelectCategoryImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need your permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setCategoryImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'An error occurred while selecting the image');
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setCustomCategory('');
    setCategoryDescription('');
    setCategoryImage(null);
    setShowCategoryDropdown(false);
    setShowCategoryInput(false);
    setEditingCategoryId(null);
  };

  const loadCategoryForEdit = (category) => {
    setSelectedCategory(category.name);
    setCategoryDescription(category.description);
    setCategoryImage(category.categoryImage);
    setEditingCategoryId(category.id);
  };

  const getFinalCategoryName = () => {
    return selectedCategory || customCategory;
  };

  const getFormData = () => ({
    name: getFinalCategoryName(),
    description: categoryDescription,
    categoryImage: categoryImage,
  });

  return {
    selectedCategory,
    setSelectedCategory,
    showCategoryDropdown,
    setShowCategoryDropdown,
    showCategoryInput,
    setShowCategoryInput,
    customCategory,
    setCustomCategory,
    categoryDescription,
    setCategoryDescription,
    categoryImage,
    setCategoryImage,
    editingCategoryId,
    setEditingCategoryId,
    handleCategorySelect,
    handleAddCustomCategory,
    handleSelectCategoryImage,
    resetForm,
    loadCategoryForEdit,
    getFinalCategoryName,
    getFormData,
  };
};