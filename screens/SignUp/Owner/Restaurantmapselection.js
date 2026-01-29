import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

function RestaurantMapSelection({ navigation, route }) {
  const existingData = route?.params?.formData || {};
  const mapRef = useRef(null);
  
  const [region, setRegion] = useState({
    latitude: 32.3373,
    longitude: -6.3498,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: 32.3373,
    longitude: -6.3498,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('');

  // Quand l'utilisateur clique sur la carte
  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerPosition(coordinate);
    getAddressFromCoordinates(coordinate.latitude, coordinate.longitude);
  };

  // Obtenir l'adresse depuis les coordonnées
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const addr = result[0];
        const parts = [
          addr.name,
          addr.street,
          addr.city,
          addr.region,
          addr.country
        ].filter(Boolean);
        setAddress(parts.join(', '));
      } else {
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
    } catch (error) {
      setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
  };

  // Rechercher une adresse
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse à rechercher');
      return;
    }

    Keyboard.dismiss();

    try {
      const result = await Location.geocodeAsync(searchQuery);

      if (result && result.length > 0) {
        const location = result[0];
        const newRegion = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setMarkerPosition({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        mapRef.current?.animateToRegion(newRegion, 1000);
        getAddressFromCoordinates(location.latitude, location.longitude);
      } else {
        Alert.alert('Introuvable', 'Aucun résultat trouvé pour cette adresse');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rechercher cette adresse');
      console.error(error);
    }
  };

  // Obtenir la position actuelle
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Veuillez autoriser l\'accès à votre localisation');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setMarkerPosition({ latitude, longitude });
      mapRef.current?.animateToRegion(newRegion, 1000);
      getAddressFromCoordinates(latitude, longitude);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
      console.error(error);
    }
  };

  // Confirmer la sélection
  const handleContinue = () => {
    if (!address) {
      Alert.alert('Attention', 'Veuillez sélectionner un emplacement sur la carte');
      return;
    }

    // Retourner vers RestaurantLocationChoice avec les coordonnées
    navigation.navigate('RestaurantLocationChoice', {
      formData: {
        ...existingData,
        location: {
          latitude: markerPosition.latitude,
          longitude: markerPosition.longitude,
          address: address,
          method: 'map',
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header avec logo et back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an address..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gpsButton}
          onPress={getCurrentLocation}
        >
           <Image
                source={require('../../../assets/Icons/map.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={markerPosition}
          draggable
          onDragEnd={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setMarkerPosition({ latitude, longitude });
            getAddressFromCoordinates(latitude, longitude);
          }}
        />
      </MapView>

      {/* Info de localisation sélectionnée */}
      {address ? (
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>📍 Selected location :</Text>
          <Text style={styles.locationText}>{address}</Text>
        </View>
      ) : null}

      {/* Bouton de confirmation */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Confirm Location →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changeMethodButton}
          onPress={() => navigation.goBack()}
        >
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    flex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5a2c1c',
    fontWeight: '600',
  },
  logo: {
    width: 30,
    height: 30,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#5a2c1c',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#5a2c1c',
    borderRadius: 10,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchButtonText: {
    fontSize: 18,
  },
  gpsButton: {
    backgroundColor: '#2196f3',
    borderRadius: 10,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsButtonText: {
    fontSize: 18,
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  continueButton: {
    backgroundColor: '#5a2c1c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#441a0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeMethodButton: {
    alignItems: 'center',
    marginTop: 12,
    padding: 10,
  },
  changeMethodText: {
    color: '#5a2c1c',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default RestaurantMapSelection;