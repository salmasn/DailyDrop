import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

/**
 * Custom hook for managing RestaurantLocationChoice state and handlers
 * Handles location selection logic and navigation listeners
 */
export const useRestaurantLocationChoice = (navigation, route) => {
  const existingData = route?.params?.formData || {};
  
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [locationMethod, setLocationMethod] = useState('');
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  /**
   * Load existing coordinates if available
   */
  useEffect(() => {
    if (existingData.location) {
      setLatitude(existingData.location.latitude.toFixed(6));
      setLongitude(existingData.location.longitude.toFixed(6));
      setAddress(existingData.location.address);
      setLocationMethod(existingData.location.method);
      setLocationConfirmed(true);
    }
  }, []);

  /**
   * Listen for navigation focus events to update location data
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = route?.params;
      if (params?.formData?.location) {
        const loc = params.formData.location;
        setLatitude(loc.latitude.toFixed(6));
        setLongitude(loc.longitude.toFixed(6));
        setAddress(loc.address);
        setLocationMethod(loc.method);
        setLocationConfirmed(true);
      }
    });

    return unsubscribe;
  }, [navigation, route]);

  /**
   * Navigate to GPS location screen
   */
  const handleGPSLocation = () => {
    navigation.navigate('RestaurantGPSLocation', {
      formData: existingData
    });
  };

  /**
   * Navigate to map selection screen
   */
  const handleMapSelection = () => {
    navigation.navigate('RestaurantMapSelection', {
      formData: existingData
    });
  };

  /**
   * Validate location and continue to next step
   */
  const handleContinue = () => {
    if (!locationConfirmed) {
      Alert.alert('Attention', 'Veuillez d\'abord sélectionner une localisation');
      return;
    }

    navigation.navigate('RestaurantSignUpStep3', {
      formData: {
        ...existingData,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address: address,
          method: locationMethod,
        }
      }
    });
  };

  /**
   * Reset location selection to allow choosing a different location
   */
  const handleChangeLocation = () => {
    setLocationConfirmed(false);
    setLatitude('');
    setLongitude('');
    setAddress('');
    setLocationMethod('');
  };

  /**
   * Navigate back to previous screen
   */
  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    latitude,
    longitude,
    address,
    locationMethod,
    locationConfirmed,
    handleGPSLocation,
    handleMapSelection,
    handleContinue,
    handleChangeLocation,
    handleGoBack,
  };
};