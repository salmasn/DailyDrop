import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

/**
 * Hook personnalisé pour gérer la géolocalisation
 * Gère à la fois la position GPS et la position manuelle
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationMode, setLocationMode] = useState('gps'); // 'gps' ou 'manual'
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  // Récupérer la position GPS actuelle
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Requise', "Veuillez autoriser l'accès à la localisation");
        setLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.High 
      });
      
      const userLocation = { 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude 
      };
      
      setLocation(userLocation);
      setLocationMode('gps');
      setLoading(false);
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      setLoading(false);
    }
  };

  // Définir manuellement une position
  const setManualLocation = (lat, lng) => {
    const newLocation = { latitude: lat, longitude: lng };
    setLocation(newLocation);
    setLocationMode('manual');
    setIsSelectingLocation(false);
    
    Alert.alert(
      'Position Définie ✓',
      `Nouvelle position:\nLat: ${lat.toFixed(6)}\nLng: ${lng.toFixed(6)}`,
      [{ text: 'OK' }]
    );
  };

  // Basculer le mode de sélection manuelle
  const toggleLocationSelection = () => {
    if (isSelectingLocation) {
      setIsSelectingLocation(false);
      Alert.alert('Annulé', 'Sélection de position annulée');
    } else {
      setIsSelectingLocation(true);
      Alert.alert(
        'Mode Sélection 📍',
        'Cliquez sur la carte pour définir votre position',
        [{ text: 'OK' }]
      );
    }
  };

  // Charger la position au montage du composant
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    loading,
    locationMode,
    isSelectingLocation,
    getCurrentLocation,
    setManualLocation,
    toggleLocationSelection,
  };
};