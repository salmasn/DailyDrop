import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Hook pour gérer l'état du formulaire de plat
 */
export const useDishForm = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [normalPrice, setNormalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [dishImage, setDishImage] = useState(null);
  const [dishComponents, setDishComponents] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null);
  const [editingExistingDishId, setEditingExistingDishId] = useState(null);

  const handleSelectDishImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder aux photos.');
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
      console.error('Erreur sélection image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image');
    }
  };

  const resetForm = () => {
    setDishName('');
    setDishDescription('');
    setNormalPrice('');
    setDiscountedPrice('');
    setAvailableQuantity('');
    setDishImage(null);
    setDishComponents([]);
    setTimeslots([]);
    setEditingDishId(null);
    setEditingExistingDishId(null);
  };

  const loadDishDataForEdit = (dish, isExisting = false) => {
    setDishName(dish.name);
    setDishDescription(dish.description || '');
    setNormalPrice(dish.normalPrice?.toString() || '');
    setDiscountedPrice(dish.discountedPrice?.toString() || '');
    setAvailableQuantity(dish.availableQuantity?.toString() || '');
    setDishImage(isExisting ? dish.imageUrl : dish.dishImage);
    setDishComponents(dish.components || []);
    setTimeslots(dish.timeslots || []);
    
    if (isExisting) {
      setEditingExistingDishId(dish.id);
      setEditingDishId(null);
    } else {
      setEditingDishId(dish.id);
      setEditingExistingDishId(null);
    }
    
    setShowAddForm(true);
  };

  const getFormData = () => ({
    name: dishName.trim(),
    description: dishDescription.trim(),
    normalPrice: parseFloat(normalPrice),
    discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
    availableQuantity: availableQuantity ? parseInt(availableQuantity) : null,
    dishImage: dishImage,
    components: dishComponents.length > 0 ? dishComponents : null,
    timeslots: timeslots.length > 0 ? timeslots.map(t => ({
      day: t.day,
      start_time: t.start_time,
      end_time: t.end_time
    })) : null,
  });

  const validateForm = () => {
    if (!dishName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de plat');
      return false;
    }

    if (!normalPrice || parseFloat(normalPrice) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un prix valide');
      return false;
    }

    return true;
  };

  return {
    showAddForm,
    setShowAddForm,
    dishName,
    setDishName,
    dishDescription,
    setDishDescription,
    normalPrice,
    setNormalPrice,
    discountedPrice,
    setDiscountedPrice,
    availableQuantity,
    setAvailableQuantity,
    dishImage,
    setDishImage,
    dishComponents,
    setDishComponents,
    timeslots,
    setTimeslots,
    editingDishId,
    setEditingDishId,
    editingExistingDishId,
    setEditingExistingDishId,
    handleSelectDishImage,
    resetForm,
    loadDishDataForEdit,
    getFormData,
    validateForm,
  };
};