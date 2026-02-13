import { useState } from 'react';
import { Alert } from 'react-native';
import { restaurantOwnerService } from '../../services/restaurantOwnerService';

export const useRestaurantRegistration = (existingData = {}) => {
  const [formData, setFormData] = useState({
    averagePriceRange: existingData.averagePriceRange || '',
    paymentMethods: existingData.paymentMethods || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRegistration = async (onSuccess) => {
    setLoading(true);
    setError('');

    try {
      const completeData = { ...existingData, ...formData };
      console.log('Données complètes:', completeData);

      const response = await restaurantOwnerService.register(completeData);
      console.log('Inscription réussie:', response);

      setLoading(false);

      Alert.alert(
        'Inscription réussie !',
        `Votre restaurant "${response.restaurant.name}" a été créé avec succès. Statut: ${response.restaurant.status}`,
        [
          {
            text: 'OK',
            onPress: onSuccess
          }
        ]
      );

      return { success: true, data: response };
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      setLoading(false);
      
      Alert.alert(
        'Erreur d\'inscription',
        errorMessage
      );

      return { success: false, error: err };
    }
  };

  const getCompleteData = (additionalData = {}) => {
    return { ...existingData, ...formData, ...additionalData };
  };

  return {
    formData,
    loading,
    error,
    updateField,
    handleRegistration,
    getCompleteData,
  };
};