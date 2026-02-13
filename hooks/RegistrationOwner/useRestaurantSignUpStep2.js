import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useRestaurantSignUpStep2 = (navigation, route) => {
  // CORRECTION: Accéder à formData dans params
  const existingData = route?.params?.formData || {};
  
  const [formData, setFormData] = useState({
    restaurantName: existingData.restaurantName || '',
    restaurantAddress: existingData.restaurantAddress || '',
    cuisineType: existingData.cuisineType || '',
    restaurantDescription: existingData.restaurantDescription || '',
    restaurantImage: existingData.restaurantImage || null,
  });
  
  const [error, setError] = useState('');

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la galerie nécessaire.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      updateFormData('restaurantImage', {
        uri: asset.uri,
        type: 'image/jpeg',
        name: asset.fileName || `restaurant_${Date.now()}.jpg`,
      });
    }
  };

  const validateForm = () => {
    if (!formData.restaurantName.trim()) {
      setError('Restaurant name is required');
      return false;
    }
    if (!formData.cuisineType.trim()) {
      setError('Cuisine type is required');
      return false;
    }
    return true;
  };

  const validateAndContinue = () => {
    if (validateForm()) {
      // CORRECTION: Passer les données dans un objet formData
      navigation.navigate('RestaurantLocationChoice', {
        formData: {
          ...existingData,
          ...formData,
        }
      });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    formData,
    error,
    updateFormData,
    pickImage,
    validateForm,
    validateAndContinue,
    handleGoBack,
  };
};