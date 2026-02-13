import { useState } from 'react';

export const useRestaurantStep3Form = (existingData = {}) => {
  const [formData, setFormData] = useState({
    openingHours: existingData.openingHours || '',
    pickupTimeStart: existingData.pickupTimeStart || '',
    pickupTimeEnd: existingData.pickupTimeEnd || '',
  });
  
  
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    // Optionnel: ajouter une validation si nécessaire
    return true;
  };

  const getCompleteData = (additionalData = {}) => {
    return { ...existingData, ...formData, ...additionalData };
  };

  return {
    formData,
    error,
    updateField,
    validateForm,
    getCompleteData,
  };
};