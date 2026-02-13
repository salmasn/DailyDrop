import { useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import * as Location from 'expo-location';

export const useMapSelection = (initialPosition = { latitude: 32.3373, longitude: -6.3498 }) => {
  const [markerPosition, setMarkerPosition] = useState(initialPosition);
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('');

  const formatAddress = (addressData) => {
    const parts = [
      addressData.name,
      addressData.street,
      addressData.city,
      addressData.region,
      addressData.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        setAddress(formatAddress(result[0]));
      } else {
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse à rechercher');
      return null;
    }

    Keyboard.dismiss();

    try {
      const result = await Location.geocodeAsync(searchQuery);

      if (result && result.length > 0) {
        const location = result[0];
        const newPos = {
          latitude: location.latitude,
          longitude: location.longitude,
        };

        setMarkerPosition(newPos);
        await getAddressFromCoordinates(location.latitude, location.longitude);
        
        return newPos;
      } else {
        Alert.alert('Introuvable', 'Aucun résultat trouvé pour cette adresse');
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      Alert.alert('Erreur', 'Impossible de rechercher cette adresse');
      return null;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Veuillez autoriser l\'accès à votre localisation');
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      const newPos = { latitude, longitude };
      
      setMarkerPosition(newPos);
      await getAddressFromCoordinates(latitude, longitude);
      
      return newPos;
    } catch (error) {
      console.error('Current location error:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
      return null;
    }
  };

  const updateMarkerPosition = async (latitude, longitude) => {
    setMarkerPosition({ latitude, longitude });
    await getAddressFromCoordinates(latitude, longitude);
  };

  return {
    markerPosition,
    searchQuery,
    address,
    setSearchQuery,
    handleSearch,
    getCurrentLocation,
    updateMarkerPosition,
  };
};