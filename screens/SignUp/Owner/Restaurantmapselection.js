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
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

function RestaurantMapSelection({ navigation, route }) {
  const existingData = route?.params?.formData || {};
  const webViewRef = useRef(null);
  
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 32.3373,
    longitude: -6.3498,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('');

  
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
        const newPos = {
          latitude: location.latitude,
          longitude: location.longitude,
       
        };

        setMarkerPosition(newPos);
        getAddressFromCoordinates(location.latitude, location.longitude);

        // Animer la carte vers la nouvelle position
        if (webViewRef.current) {
          const js = `
            map.setView([${location.latitude}, ${location.longitude}], 16);
            marker.setLatLng([${location.latitude}, ${location.longitude}]);
            true;
          `;
          webViewRef.current.injectJavaScript(js);
        }
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
      
      setMarkerPosition({ latitude, longitude });
      
      getAddressFromCoordinates(latitude, longitude);

      // Animer vers la position actuelle
      if (webViewRef.current) {
        const js = `
          map.setView([${latitude}, ${longitude}], 16);
          marker.setLatLng([${latitude}, ${longitude}]);
          true;
        `;
        webViewRef.current.injectJavaScript(js);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
      console.error(error);
    }
  };

  // Gérer les messages de la WebView
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'mapClick') {
        const { lat, lng } = data;
        setMarkerPosition({ latitude: lat, longitude: lng });
        getAddressFromCoordinates(lat, lng);
      } else if (data.type === 'markerDrag') {
        const { lat, lng } = data;
        setMarkerPosition({ latitude: lat, longitude: lng });
        getAddressFromCoordinates(lat, lng);
      }
    } catch (err) {
      console.error('WebView message error:', err);
    }
  };

  // Confirmer la sélection
  const handleContinue = () => {
    if (!address) {
      Alert.alert('Attention', 'Veuillez sélectionner un emplacement sur la carte');
      return;
    }

    
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

  // HTML de la carte
  const mapHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Initialisation de la carte
        var map = L.map('map', {
          zoomControl: true,
          attributionControl: false
        }).setView([${markerPosition.latitude}, ${markerPosition.longitude}], 13);

        // Tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Marqueur draggable
        var marker = L.marker([${markerPosition.latitude}, ${markerPosition.longitude}], {
          draggable: true
        }).addTo(map);

        // Quand on clique sur la carte
        map.on('click', function(e) {
          var lat = e.latlng.lat;
          var lng = e.latlng.lng;
          marker.setLatLng([lat, lng]);
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapClick',
            lat: lat,
            lng: lng
          }));
        });

        // Quand on déplace le marqueur
        marker.on('dragend', function(e) {
          var pos = marker.getLatLng();
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerDrag',
            lat: pos.lat,
            lng: pos.lng
          }));
        });
      </script>
    </body>
  </html>
  `;

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

      {/* WebView Map */}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={styles.map}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

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

});


export default RestaurantMapSelection;