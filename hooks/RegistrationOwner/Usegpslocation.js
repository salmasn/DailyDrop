import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

export const useGPSLocation = (navigation, route) => {
  const existingData = route?.params?.formData || {};
  
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const formatAddress = (addressData) => {
    const parts = [
      addressData.name,
      addressData.street,
      addressData.city,
      addressData.region,
      addressData.postalCode,
      addressData.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const handleContinue = () => {
    if (!location) {
      Alert.alert('Erreur', 'Veuillez autoriser l\'accès à la localisation');
      return;
    }

    navigation.navigate('RestaurantLocationChoice', {
      formData: {
        ...existingData,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: address,
          method: 'gps',
        }
      }
    });
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission refusée. Veuillez autoriser l\'accès à votre localisation.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse && addressResponse.length > 0) {
        setAddress(formatAddress(addressResponse[0]));
      } else {
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }

      setLoading(false);
    } catch (err) {
      console.error('Location error:', err);
      setError('Impossible d\'obtenir votre localisation. Vérifiez que le GPS est activé.');
      setLoading(false);
    }
  };

  const retry = () => {
    setError('');
    setLocation(null);
    setAddress('');
    getCurrentLocation();
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    loading,
    location,
    address,
    error,
    retry,
    handleContinue
  };
};
