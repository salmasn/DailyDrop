import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Hook pour gérer le formulaire d'ajout de plat
 */
export const useDishForm = () => {
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [normalPrice, setNormalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [dishImage, setDishImage] = useState(null);
  const [hasTimeslots, setHasTimeslots] = useState(false);
  const [timeslots, setTimeslots] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null);

  // Auto-calcul du pourcentage de remise
  useEffect(() => {
    if (normalPrice && discountedPrice) {
      const normal = parseFloat(normalPrice);
      const discounted = parseFloat(discountedPrice);
      if (normal > 0 && discounted < normal) {
        const percentage = Math.round(((normal - discounted) / normal) * 100);
        setDiscountPercentage(percentage.toString());
      } else {
        setDiscountPercentage('');
      }
    } else {
      setDiscountPercentage('');
    }
  }, [normalPrice, discountedPrice]);

  const handleSelectDishImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need your permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDishImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'An error occurred while selecting the image');
    }
  };

  const validateForm = () => {
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return false;
    }

    if (!normalPrice || parseFloat(normalPrice) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    return true;
  };

  const getFormData = () => ({
    name: dishName.trim(),
    description: dishDescription.trim(),
    normalPrice: parseFloat(normalPrice),
    discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
    discountPercentage: discountPercentage ? parseInt(discountPercentage) : null,
    availableQuantity: availableQuantity ? parseInt(availableQuantity) : null,
    dishImage: dishImage,
    timeslots: hasTimeslots ? timeslots : [],
  });

  const resetForm = () => {
    setDishName('');
    setDishDescription('');
    setNormalPrice('');
    setDiscountedPrice('');
    setDiscountPercentage('');
    setAvailableQuantity('');
    setDishImage(null);
    setHasTimeslots(false);
    setTimeslots([]);
    setEditingDishId(null);
  };

  const loadDishForEdit = (dish) => {
    setDishName(dish.name);
    setDishDescription(dish.description);
    setNormalPrice(dish.normalPrice.toString());
    setDiscountedPrice(dish.discountedPrice?.toString() || '');
    setDiscountPercentage(dish.discountPercentage?.toString() || '');
    setAvailableQuantity(dish.availableQuantity?.toString() || '');
    setDishImage(dish.dishImage);
    setHasTimeslots(dish.timeslots && dish.timeslots.length > 0);
    setTimeslots(dish.timeslots || []);
    setEditingDishId(dish.id);
  };

  return {
    dishName,
    setDishName,
    dishDescription,
    setDishDescription,
    normalPrice,
    setNormalPrice,
    discountedPrice,
    setDiscountedPrice,
    discountPercentage,
    availableQuantity,
    setAvailableQuantity,
    dishImage,
    hasTimeslots,
    setHasTimeslots,
    timeslots,
    editingDishId,
    handleSelectDishImage,
    validateForm,
    getFormData,
    resetForm,
    loadDishForEdit,
  };
};