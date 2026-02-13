import { useState } from 'react';

/**
 * Custom hook for managing RestaurantSignUpStep1 form state and handlers
 * Handles all business logic for the first step of restaurant signup
 */
export const useRestaurantSignUpStep1 = (navigation, route) => {
  const existingData = route?.params?.formData || {};
  
  const [formData, setFormData] = useState({
    ownerFullName: existingData.ownerFullName || '',
    ownerEmail: existingData.ownerEmail || '',
    ownerPassword: existingData.ownerPassword || '',
    ownerConfirmPassword: existingData.ownerConfirmPassword || '',
    phoneNumber: existingData.phoneNumber || '',
  });
  
  const [error, setError] = useState('');

  /**
   * Updates a specific field in the form data
   * @param {string} field - The field name to update
   * @param {string} value - The new value
   */
  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  /**
   * Validates form data and navigates to next step
   * Currently no validation, but can be extended
   */
  const validateAndContinue = () => {
    navigation.navigate('RestaurantSignUpStep2', {
      formData: { ...existingData, ...formData }
    });
  };

  /**
   * Handles navigation back to previous screen
   */
  const handleGoBack = () => {
    navigation.goBack();
  };

  /**
   * Navigates to login screen
   */
  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    formData,
    error,
    updateFormData,
    validateAndContinue,
    handleGoBack,
    handleNavigateToLogin,
  };
};