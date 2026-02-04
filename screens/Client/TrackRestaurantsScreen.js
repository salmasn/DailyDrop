// import React, { useState, useEffect, useRef } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Platform,
//   Dimensions,
//   Modal,
//   TextInput,
//   ScrollView,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import * as Location from 'expo-location';
// import { LinearGradient } from 'expo-linear-gradient';

// // Import du fichier JSON
// import restaurantsData from '../../restaurants.json';

// const { width, height } = Dimensions.get('window');

// const MAP_STYLES = [
//   { key: 'osm', label: 'Standard', icon: '📍', tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
//   { key: 'satellite', label: 'Satellite', icon: '🛰️', tiles: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
//   { key: 'topo', label: 'Topo', icon: '🗺️', tiles: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' },
// ];

// // Modes de filtrage
// const FILTER_MODES = {
//   ALL: 'all',
//   REALTIME: 'realtime',
//   CUSTOM_TIMESLOTS: 'custom_timeslots'
// };

// // Fonction pour obtenir la couleur selon le type de cuisine
// const getCuisineColor = (cuisineType) => {
//   const colors = {
//     'Marocain': '#e74c3c',
//     'International': '#3498db',
//     'Fast Food': '#f39c12',
//     'Italien': '#27ae60',
//     'Japonais': '#e67e22',
//     'Français': '#9b59b6',
//     'Fruits de mer': '#1abc9c',
//     'Espagnol': '#c0392b',
//     'Asiatique': '#d35400',
//     'Américain': '#2c3e50',
//     'Végétarien': '#16a085',
//     'Méditerranéen': '#16527a',
//     'Snack': '#e8a60e',
//     'default': '#7f8c8d'
//   };
//   return colors[cuisineType] || colors['default'];
// };

// // Fonction pour vérifier si une offre est disponible maintenant
// const isOfferAvailableNow = (offer) => {
//   const now = new Date();
//   const currentDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][now.getDay()];
//   const currentTime = now.getHours() * 60 + now.getMinutes();

//   return offer.timeslots.some(slot => {
//     // Gérer les plages de jours (ex: "Lundi-Vendredi")
//     const days = slot.day.includes('-') 
//       ? slot.day.split('-') 
//       : [slot.day];
    
//     const isDayMatch = days.length === 1 
//       ? days[0] === currentDay
//       : ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
//           .slice(
//             ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(days[0]),
//             ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(days[1]) + 1
//           ).includes(currentDay);

//     if (!isDayMatch) return false;

//     // Vérifier l'heure
//     const [startHour, startMin] = slot.start_time.split(':').map(Number);
//     const [endHour, endMin] = slot.end_time.split(':').map(Number);
//     const startTime = startHour * 60 + startMin;
//     const endTime = endHour * 60 + endMin;

//     return currentTime >= startTime && currentTime <= endTime;
//   });
// };

// // Fonction pour vérifier si une offre correspond aux timeslots personnalisés
// const isOfferInCustomTimeslots = (offer, customTimeslots) => {
//   if (!customTimeslots || customTimeslots.length === 0) return false;

//   return offer.timeslots.some(offerSlot => {
//     return customTimeslots.some(customSlot => {
//       if (!customSlot.start || !customSlot.end) return false;

//       const [offerStartH, offerStartM] = offerSlot.start_time.split(':').map(Number);
//       const [offerEndH, offerEndM] = offerSlot.end_time.split(':').map(Number);
//       const [customStartH, customStartM] = customSlot.start.split(':').map(Number);
//       const [customEndH, customEndM] = customSlot.end.split(':').map(Number);

//       const offerStart = offerStartH * 60 + offerStartM;
//       const offerEnd = offerEndH * 60 + offerEndM;
//       const customStart = customStartH * 60 + customStartM;
//       const customEnd = customEndH * 60 + customEndM;

//       // Vérifier s'il y a un chevauchement entre les créneaux
//       return (offerStart <= customEnd && offerEnd >= customStart);
//     });
//   });
// };

// // Fonction pour calculer la distance entre deux points (en mètres)
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371e3; // Rayon de la Terre en mètres
//   const φ1 = lat1 * Math.PI / 180;
//   const φ2 = lat2 * Math.PI / 180;
//   const Δφ = (lat2 - lat1) * Math.PI / 180;
//   const Δλ = (lon2 - lon1) * Math.PI / 180;

//   const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//           Math.cos(φ1) * Math.cos(φ2) *
//           Math.sin(Δλ/2) * Math.sin(Δλ/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//   return R * c;
// };

// function TrackRestaurantsScreen({ navigation }) {
//   const webViewRef = useRef(null);
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [mapType, setMapType] = useState('osm');
  
//   // Configuration modal
//   const [showConfigModal, setShowConfigModal] = useState(true);
//   const [selectedRadius, setSelectedRadius] = useState('1000');
//   const [configComplete, setConfigComplete] = useState(false);

//   // Mode de sélection de position
//   const [isSelectingLocation, setIsSelectingLocation] = useState(false);
//   const [locationMode, setLocationMode] = useState('gps'); // 'gps' ou 'manual'

//   // Filtrage
//   const [filterMode, setFilterMode] = useState(FILTER_MODES.ALL);
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [customTimeslots, setCustomTimeslots] = useState([{ start: '', end: '' }]);

//   // Restaurants filtrés
//   const [allRestaurantsInRadius, setAllRestaurantsInRadius] = useState([]);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   /* ─── Géolocalisation ─── */
//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   const getCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Requise', "Veuillez autoriser l'accès à la localisation");
//         setLoading(false);
//         return;
//       }
//       const cur = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
//       const userLoc = { latitude: cur.coords.latitude, longitude: cur.coords.longitude };
//       setLocation(userLoc);
//       setLocationMode('gps');
//       setLoading(false);
//     } catch (e) {
//       console.error(e);
//       setLoading(false);
//     }
//   };

//   /* ─── Sélection manuelle de position ─── */
//   const toggleLocationSelection = () => {
//     if (isSelectingLocation) {
//       setIsSelectingLocation(false);
//       Alert.alert('Annulé', 'Sélection de position annulée');
//     } else {
//       setIsSelectingLocation(true);
//       Alert.alert(
//         'Mode Sélection 📍',
//         'Cliquez sur la carte pour définir votre position',
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   /* ─── Filtrer les restaurants selon le rayon ─── */
//   useEffect(() => {
//     if (!location || !configComplete) return;

//     const radius = parseInt(selectedRadius);
//     const inRadius = restaurantsData.restaurants.filter(restaurant => {
//       const distance = calculateDistance(
//         location.latitude,
//         location.longitude,
//         restaurant.location.latitude,
//         restaurant.location.longitude
//       );
//       return distance <= radius;
//     });

//     setAllRestaurantsInRadius(inRadius);
//   }, [location, selectedRadius, configComplete]);

//   /* ─── Appliquer le filtre selon le mode ─── */
//   useEffect(() => {
//     if (allRestaurantsInRadius.length === 0) {
//       setFilteredRestaurants([]);
//       return;
//     }

//     let filtered = [];

//     switch (filterMode) {
//       case FILTER_MODES.ALL:
//         // Tous les restaurants dans le rayon
//         filtered = allRestaurantsInRadius;
//         break;

//       case FILTER_MODES.REALTIME:
//         // Restaurants avec offres disponibles maintenant
//         filtered = allRestaurantsInRadius.filter(restaurant => {
//           return restaurant.offers && restaurant.offers.length > 0 && 
//                  restaurant.offers.some(offer => isOfferAvailableNow(offer));
//         });
//         break;

//       case FILTER_MODES.CUSTOM_TIMESLOTS:
//         // Restaurants avec offres dans les timeslots personnalisés
//         filtered = allRestaurantsInRadius.filter(restaurant => {
//           return restaurant.offers && restaurant.offers.length > 0 && 
//                  restaurant.offers.some(offer => isOfferInCustomTimeslots(offer, customTimeslots));
//         });
//         break;

//       default:
//         filtered = allRestaurantsInRadius;
//     }

//     setFilteredRestaurants(filtered);
//   }, [allRestaurantsInRadius, filterMode, customTimeslots]);

//   const validateAndStartSearch = () => {
//     const radius = parseInt(selectedRadius);
//     if (isNaN(radius) || radius < 100 || radius > 10000) {
//       Alert.alert('Rayon Invalide', 'Veuillez entrer un rayon entre 100 et 10000 mètres');
//       return;
//     }
    
//     setConfigComplete(true);
//     setShowConfigModal(false);
//   };

//   /* ─── Gestion des timeslots personnalisés ─── */
//   const addTimeslot = () => {
//     setCustomTimeslots([...customTimeslots, { start: '', end: '' }]);
//   };

//   const removeTimeslot = (index) => {
//     if (customTimeslots.length === 1) return;
//     setCustomTimeslots(customTimeslots.filter((_, i) => i !== index));
//   };

//   const updateTimeslot = (index, field, value) => {
//     const updated = [...customTimeslots];
//     updated[index][field] = value;
//     setCustomTimeslots(updated);
//   };

//   const applyFilter = () => {
//     if (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS) {
//       // Valider les timeslots
//       const valid = customTimeslots.every(slot => {
//         if (!slot.start || !slot.end) return false;
//         const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//         return timeRegex.test(slot.start) && timeRegex.test(slot.end);
//       });

//       if (!valid) {
//         Alert.alert('Timeslots Invalides', 'Veuillez entrer des heures valides (ex: 11:00)');
//         return;
//       }
//     }

//     setShowFilterModal(false);
    
//     // Forcer le refresh de la carte
//     setTimeout(() => {
//       if (webViewRef.current) {
//         webViewRef.current.reload();
//       }
//     }, 300);
//   };

//   /* ─── Communication WebView ─── */
//   const handleWebViewMessage = (event) => {
//     try {
//       const data = JSON.parse(event.nativeEvent.data);
      
//       if (data.type === 'markerClick') {
//         const restaurant = [...allRestaurantsInRadius].find(r => r.id.toString() === data.id);
//         if (restaurant) {
//           setSelectedRestaurant(restaurant);
//           setShowDetailsModal(true);
//         }
//       } else if (data.type === 'mapClick' && isSelectingLocation) {
//         const newLocation = {
//           latitude: data.lat,
//           longitude: data.lng
//         };
//         setLocation(newLocation);
//         setLocationMode('manual');
//         setIsSelectingLocation(false);
        
//         Alert.alert(
//           'Position Définie ✓',
//           `Nouvelle position:\nLat: ${data.lat.toFixed(6)}\nLng: ${data.lng.toFixed(6)}`,
//           [{ text: 'OK' }]
//         );
        
//         setTimeout(() => {
//           if (webViewRef.current) {
//             webViewRef.current.reload();
//           }
//         }, 500);
//       }
//     } catch (err) {
//       console.error('WebView message error:', err);
//     }
//   };

//   /* ─── Contrôles caméra ─── */
//   const centerOnLocation = () => {
//     if (!location || !webViewRef.current) return;
//     const js = `map.setView([${location.latitude}, ${location.longitude}], 15); true;`;
//     webViewRef.current.injectJavaScript(js);
//   };

//   const zoomIn = () => {
//     if (!webViewRef.current) return;
//     webViewRef.current.injectJavaScript(`map.zoomIn(); true;`);
//   };

//   const zoomOut = () => {
//     if (!webViewRef.current) return;
//     webViewRef.current.injectJavaScript(`map.zoomOut(); true;`);
//   };

//   /* ─── Changement de style ─── */
//   useEffect(() => {
//     if (!webViewRef.current || loading) return;
//     const selectedStyle = MAP_STYLES.find(s => s.key === mapType);
//     if (selectedStyle) {
//       const js = `
//         if (window.currentTileLayer) {
//           map.removeLayer(window.currentTileLayer);
//         }
//         window.currentTileLayer = L.tileLayer('${selectedStyle.tiles}', {
//           maxZoom: 19,
//           attribution: '© OpenStreetMap'
//         }).addTo(map);
//         true;
//       `;
//       webViewRef.current.injectJavaScript(js);
//     }
//   }, [mapType, loading]);

//   /* ─── HTML de la carte ─── */
//   const radius = parseInt(selectedRadius) || 1000;
//   const mapHTML = `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
//       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
//       <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
//       <style>
//         html, body, #map {
//           height: 100%;
//           margin: 0;
//           padding: 0;
//         }
//         ${isSelectingLocation ? `
//         #map {
//           cursor: crosshair !important;
//         }
//         ` : ''}
//         .user-marker {
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           background: radial-gradient(circle, #4285F4 0%, #1565C0 100%);
//           border: 3px solid #fff;
//           box-shadow: 0 3px 8px rgba(66,133,244,0.5);
//           animation: pulse 2s infinite;
//         }
//         .user-marker-manual {
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           background: radial-gradient(circle, #f39c12 0%, #e67e22 100%);
//           border: 3px solid #fff;
//           box-shadow: 0 3px 8px rgba(243,156,18,0.5);
//           animation: pulse 2s infinite;
//         }
//         @keyframes pulse {
//           0%, 100% { box-shadow: 0 3px 8px rgba(66,133,244,0.5); }
//           50% { box-shadow: 0 3px 8px rgba(66,133,244,0.8), 0 0 0 10px rgba(66,133,244,0.3); }
//         }
//         .restaurant-marker {
//           width: 44px;
//           height: 44px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 22px;
//           border: 3px solid #fff;
//           cursor: pointer;
//           transition: transform 0.2s;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.3);
//         }
//         .restaurant-marker:hover {
//           transform: scale(1.15);
//         }
//         .restaurant-marker-inactive {
//           opacity: 0.4;
//           filter: grayscale(70%);
//         }
//         .available-badge {
//           position: absolute;
//           top: -5px;
//           right: -5px;
//           width: 14px;
//           height: 14px;
//           background: #27ae60;
//           border: 2px solid white;
//           border-radius: 50%;
//           animation: blink 1.5s infinite;
//         }
//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.3; }
//         }
//         .selection-banner {
//           position: absolute;
//           top: 10px;
//           left: 50%;
//           transform: translateX(-50%);
//           background: #f39c12;
//           color: white;
//           padding: 12px 24px;
//           border-radius: 25px;
//           font-weight: bold;
//           z-index: 1000;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.3);
//           animation: slideDown 0.3s ease-out;
//         }
//         @keyframes slideDown {
//           from { top: -50px; opacity: 0; }
//           to { top: 10px; opacity: 1; }
//         }
//       </style>
//     </head>
//     <body>
//       <div id="map"></div>
//       ${isSelectingLocation ? '<div class="selection-banner">📍 Cliquez sur la carte pour définir votre position</div>' : ''}
//       <script>
//         var map = L.map('map', { 
//           zoomControl: false,
//           attributionControl: false
//         }).setView([${location ? location.latitude : 33.589}, ${location ? location.longitude : -7.645}], 15);

//         window.currentTileLayer = L.tileLayer('${MAP_STYLES[0].tiles}', {
//           maxZoom: 19,
//           attribution: '© OpenStreetMap'
//         }).addTo(map);

//         // Gérer les clics sur la carte
//         ${isSelectingLocation ? `
//         map.on('click', function(e) {
//           window.ReactNativeWebView.postMessage(JSON.stringify({
//             type: 'mapClick',
//             lat: e.latlng.lat,
//             lng: e.latlng.lng
//           }));
//         });
//         ` : ''}

//         // Cercle de rayon
//         ${location ? `
//           L.circle([${location.latitude}, ${location.longitude}], {
//             radius: ${radius},
//             color: '${locationMode === 'manual' ? '#f39c12' : '#5a2c1c'}',
//             fillColor: '${locationMode === 'manual' ? '#f39c12' : '#5a2c1c'}',
//             fillOpacity: 0.1,
//             weight: 2
//           }).addTo(map);
//         ` : ''}

//         // Marqueur utilisateur
//         ${location ? `
//           var userIcon = L.divIcon({
//             className: '${locationMode === 'manual' ? 'user-marker-manual' : 'user-marker'}',
//             iconSize: [${locationMode === 'manual' ? 32 : 28}, ${locationMode === 'manual' ? 32 : 28}],
//             html: ''
//           });
//           L.marker([${location.latitude}, ${location.longitude}], {icon: userIcon})
//             .addTo(map)
//             .bindPopup("<b>${locationMode === 'manual' ? '📍 Position Manuelle' : '📍 Votre Position GPS'}</b>");
//         ` : ''}

//         // Marqueurs restaurants (TOUS dans le rayon)
//         ${allRestaurantsInRadius.map(r => {
//           const color = getCuisineColor(r.cuisine_type);
//           const hasOffers = r.offers && r.offers.length > 0;
//           const isInFilteredList = filteredRestaurants.some(fr => fr.id === r.id);
//           const hasActiveOffer = hasOffers && r.offers.some(offer => {
//             if (filterMode === FILTER_MODES.REALTIME) {
//               return isOfferAvailableNow(offer);
//             } else if (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS) {
//               return isOfferInCustomTimeslots(offer, customTimeslots);
//             }
//             return false;
//           });
          
//           const isInactive = filterMode !== FILTER_MODES.ALL && !isInFilteredList;
          
//           return `
//           var marker${r.id} = document.createElement('div');
//           marker${r.id}.className = 'restaurant-marker ${isInactive ? 'restaurant-marker-inactive' : ''}';
//           marker${r.id}.style.background = 'linear-gradient(135deg, ${color} 0%, ${color}dd 100%)';
//           marker${r.id}.style.position = 'relative';
//           marker${r.id}.innerHTML = '🍽️${hasActiveOffer && !isInactive ? '<div class="available-badge"></div>' : ''}';
          
//           var icon${r.id} = L.divIcon({
//             className: '',
//             iconSize: [44, 44],
//             html: marker${r.id}.outerHTML
//           });
          
//           var popupContent = \`
//             <div style="min-width: 200px;">
//               <b style="font-size: 16px; color: #333;">${r.name.replace(/'/g, "\\'")}</b><br>
//               <span style="color: #666; font-size: 13px;">${r.cuisine_type}</span><br>
//               <span style="color: #888; font-size: 12px;">📍 ${r.address.substring(0, 30)}...</span>
//               ${hasOffers ? `
//                 <div style="margin-top: 8px; padding: 8px; background: ${hasActiveOffer && !isInactive ? '#e8f5e9' : '#f5f5f5'}; border-radius: 6px;">
//                   ${hasActiveOffer && !isInactive ? `
//                     <b style="color: #27ae60; font-size: 13px;">✨ Offre(s) disponible(s)</b>
//                   ` : `
//                     <b style="color: #999; font-size: 13px;">Offres disponibles</b>
//                   `}
//                 </div>
//               ` : '<div style="margin-top: 6px; color: #999; font-size: 12px;">Aucune offre actuellement</div>'}
//             </div>
//           \`;
          
//           L.marker([${r.location.latitude}, ${r.location.longitude}], {icon: icon${r.id}})
//             .addTo(map)
//             .bindPopup(popupContent)
//             .on('click', function() {
//               window.ReactNativeWebView.postMessage(JSON.stringify({
//                 type: 'markerClick',
//                 id: '${r.id}'
//               }));
//             });
//         `}).join('\n')}
//       </script>
//     </body>
//   </html>
//   `;

//   /* ─── Loading ─── */
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#5a2c1c" />
//         <Text style={styles.loadingText}>Chargement de la carte…</Text>
//       </View>
//     );
//   }

//   /* ─── Render Filter Mode Label ─── */
//   const getFilterLabel = () => {
//     switch (filterMode) {
//       case FILTER_MODES.ALL:
//         return 'Tous les restaurants';
//       case FILTER_MODES.REALTIME:
//         return 'Offres disponibles maintenant';
//       case FILTER_MODES.CUSTOM_TIMESLOTS:
//         return 'Offres dans mes créneaux';
//       default:
//         return 'Tous';
//     }
//   };

//   /* ─── Render ─── */
//   return (
//     <View style={styles.container}>
//       {/* Barre supérieure avec styles et filtre */}
//       <View style={styles.topBar}>
//         <View style={styles.styleRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Text style={styles.backButtonText}>←</Text>
//           </TouchableOpacity>
//           {MAP_STYLES.map(s => {
//             const active = mapType === s.key;
//             return (
//               <TouchableOpacity
//                 key={s.key}
//                 style={[styles.styleBtn, active && styles.styleBtnActive]}
//                 onPress={() => setMapType(s.key)}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.styleBtnIcon}>{s.icon}</Text>
//                 <Text style={[styles.styleBtnLabel, active && styles.styleBtnLabelActive]}>
//                   {s.label}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* Bouton Filtre */}
//         <TouchableOpacity 
//           style={styles.filterButton}
//           onPress={() => setShowFilterModal(true)}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.filterIcon}>🔍</Text>
//           <Text style={styles.filterLabel}>Filtrer</Text>
//         </TouchableOpacity>
//       </View>

//       {/* WebView Map */}
//       <WebView
//         ref={webViewRef}
//         originWhitelist={['*']}
//         source={{ html: mapHTML }}
//         style={styles.map}
//         onMessage={handleWebViewMessage}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//       />

//       {/* Contrôles */}
//       <View style={styles.controls}>
//         <TouchableOpacity 
//           style={[styles.ctrlBtn, isSelectingLocation && styles.ctrlBtnActive]} 
//           onPress={toggleLocationSelection}
//         >
//           <Text style={styles.ctrlIcon}>{isSelectingLocation ? '✖' : '📌'}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.ctrlBtn} onPress={getCurrentLocation}>
//           <Text style={styles.ctrlIcon}>🎯</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.ctrlBtn} onPress={centerOnLocation}>
//           <Text style={styles.ctrlIcon}>📍</Text>
//         </TouchableOpacity>

//         <View style={styles.zoomWrap}>
//           <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}>
//             <Text style={styles.zoomText}>+</Text>
//           </TouchableOpacity>
//           <View style={styles.zoomDiv} />
//           <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut}>
//             <Text style={styles.zoomText}>−</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Légende */}
//       <View style={styles.legendWrap}>
//         <View style={styles.legend}>
//           <View style={styles.legendHeader}>
//             <View style={styles.legendTitleRow}>
//               <Text style={styles.legendTitle}>
//                 {filterMode === FILTER_MODES.ALL ? allRestaurantsInRadius.length : filteredRestaurants.length} restaurant{(filterMode === FILTER_MODES.ALL ? allRestaurantsInRadius.length : filteredRestaurants.length) > 1 ? 's' : ''}
//               </Text>
//               <View style={styles.filterModeBadge}>
//                 <Text style={styles.filterModeText}>{getFilterLabel()}</Text>
//               </View>
//             </View>
//             {locationMode === 'manual' && (
//               <View style={styles.manualBadge}>
//                 <Text style={styles.manualBadgeText}>📌 Manuel</Text>
//               </View>
//             )}
//           </View>
//           <Text style={styles.legendSub}>
//             Rayon: {radius >= 1000 ? `${radius/1000} km` : `${radius}m`}
//           </Text>
//         </View>
//       </View>

//       {/* Modal de Configuration Initiale */}
//       <Modal
//         visible={showConfigModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => configComplete && setShowConfigModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.configModal}>
//             <LinearGradient
//               colors={['#3c1d04', '#824104']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.configGradient}
//             >
//               <Text style={styles.configTitle}>Rayon de Recherche</Text>
//               <Text style={styles.configSubtitle}>
//                 Définissez la distance de recherche autour de votre position
//               </Text>

//               <View style={styles.radiusInputContainer}>
//                 <TextInput
//                   style={styles.radiusInput}
//                   placeholder="Ex: 1000"
//                   placeholderTextColor="rgba(255,255,255,0.5)"
//                   value={selectedRadius}
//                   onChangeText={setSelectedRadius}
//                   keyboardType="numeric"
//                 />
//                 <Text style={styles.radiusUnit}>mètres</Text>
//               </View>
//               <Text style={styles.radiusHint}>Entre 100m et 10km (10000m)</Text>

//               <View style={styles.quickOptions}>
//                 {[500, 1000, 2000, 5000].map(val => (
//                   <TouchableOpacity
//                     key={val}
//                     style={[
//                       styles.quickOption,
//                       selectedRadius === val.toString() && styles.quickOptionActive
//                     ]}
//                     onPress={() => setSelectedRadius(val.toString())}
//                     activeOpacity={0.7}
//                   >
//                     <Text style={[
//                       styles.quickOptionText,
//                       selectedRadius === val.toString() && styles.quickOptionTextActive
//                     ]}>
//                       {val >= 1000 ? `${val/1000} km` : `${val}m`}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <TouchableOpacity
//                 style={styles.confirmBtn}
//                 onPress={validateAndStartSearch}
//                 activeOpacity={0.9}
//               >
//                 <Text style={styles.confirmBtnText}>Confirmer</Text>
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </View>
//       </Modal>

//       {/* Modal de Filtrage */}
//       <Modal
//         visible={showFilterModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowFilterModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.filterModal}>
//             <ScrollView style={styles.filterScroll}>
//               <Text style={styles.filterModalTitle}>🔍 Options de Filtrage</Text>
              
//               {/* Mode Tous */}
//               <TouchableOpacity
//                 style={[
//                   styles.filterOptionCard,
//                   filterMode === FILTER_MODES.ALL && styles.filterOptionCardActive
//                 ]}
//                 onPress={() => setFilterMode(FILTER_MODES.ALL)}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.filterOptionHeader}>
//                   <Text style={styles.filterOptionIcon}>🗺️</Text>
//                   <View style={styles.filterOptionTextContainer}>
//                     <Text style={[
//                       styles.filterOptionTitle,
//                       filterMode === FILTER_MODES.ALL && styles.filterOptionTitleActive
//                     ]}>
//                       Tous les restaurants
//                     </Text>
//                     <Text style={styles.filterOptionDescription}>
//                       Afficher tous les restaurants dans le rayon
//                     </Text>
//                   </View>
//                   {filterMode === FILTER_MODES.ALL && (
//                     <Text style={styles.checkmark}>✓</Text>
//                   )}
//                 </View>
//               </TouchableOpacity>

//               {/* Mode Temps Réel */}
//               <TouchableOpacity
//                 style={[
//                   styles.filterOptionCard,
//                   filterMode === FILTER_MODES.REALTIME && styles.filterOptionCardActive
//                 ]}
//                 onPress={() => setFilterMode(FILTER_MODES.REALTIME)}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.filterOptionHeader}>
//                   <Text style={styles.filterOptionIcon}>⚡</Text>
//                   <View style={styles.filterOptionTextContainer}>
//                     <Text style={[
//                       styles.filterOptionTitle,
//                       filterMode === FILTER_MODES.REALTIME && styles.filterOptionTitleActive
//                     ]}>
//                       Offres disponibles maintenant
//                     </Text>
//                     <Text style={styles.filterOptionDescription}>
//                       Restaurants avec offres actives en ce moment
//                     </Text>
//                   </View>
//                   {filterMode === FILTER_MODES.REALTIME && (
//                     <Text style={styles.checkmark}>✓</Text>
//                   )}
//                 </View>
//               </TouchableOpacity>

//               {/* Mode Créneaux Personnalisés */}
//               <TouchableOpacity
//                 style={[
//                   styles.filterOptionCard,
//                   filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && styles.filterOptionCardActive
//                 ]}
//                 onPress={() => setFilterMode(FILTER_MODES.CUSTOM_TIMESLOTS)}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.filterOptionHeader}>
//                   <Text style={styles.filterOptionIcon}>🕐</Text>
//                   <View style={styles.filterOptionTextContainer}>
//                     <Text style={[
//                       styles.filterOptionTitle,
//                       filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && styles.filterOptionTitleActive
//                     ]}>
//                       Créneaux horaires personnalisés
//                     </Text>
//                     <Text style={styles.filterOptionDescription}>
//                       Définir vos propres créneaux de recherche
//                     </Text>
//                   </View>
//                   {filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && (
//                     <Text style={styles.checkmark}>✓</Text>
//                   )}
//                 </View>
//               </TouchableOpacity>

//               {/* Input Timeslots */}
//               {filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && (
//                 <View style={styles.timeslotsSection}>
//                   <Text style={styles.timeslotsSectionTitle}>⏰ Vos Créneaux</Text>
                  
//                   {customTimeslots.map((slot, index) => (
//                     <View key={index} style={styles.timeslotRow}>
//                       <TextInput
//                         style={styles.timeInput}
//                         placeholder="11:00"
//                         placeholderTextColor="#999"
//                         value={slot.start}
//                         onChangeText={(text) => updateTimeslot(index, 'start', text)}
//                       />
//                       <Text style={styles.timeSeparator}>→</Text>
//                       <TextInput
//                         style={styles.timeInput}
//                         placeholder="14:00"
//                         placeholderTextColor="#999"
//                         value={slot.end}
//                         onChangeText={(text) => updateTimeslot(index, 'end', text)}
//                       />
//                       {customTimeslots.length > 1 && (
//                         <TouchableOpacity
//                           style={styles.removeTimeslotBtn}
//                           onPress={() => removeTimeslot(index)}
//                         >
//                           <Text style={styles.removeTimeslotText}>✕</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   ))}

//                   <TouchableOpacity
//                     style={styles.addTimeslotBtn}
//                     onPress={addTimeslot}
//                     activeOpacity={0.8}
//                   >
//                     <Text style={styles.addTimeslotText}>+ Ajouter un créneau</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </ScrollView>

//             {/* Boutons d'action */}
//             <View style={styles.filterModalActions}>
//               <TouchableOpacity
//                 style={styles.cancelFilterBtn}
//                 onPress={() => setShowFilterModal(false)}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.cancelFilterText}>Annuler</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.applyFilterBtn}
//                 onPress={applyFilter}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.applyFilterText}>Appliquer</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Modal Détails Restaurant */}
//       <Modal
//         visible={showDetailsModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowDetailsModal(false)}
//       >
//         <View style={styles.detailsOverlay}>
//           <View style={styles.detailsModal}>
//             <ScrollView style={styles.detailsScroll}>
//               {selectedRestaurant && (
//                 <>
//                   <Text style={styles.detailsName}>{selectedRestaurant.name}</Text>
//                   <Text style={styles.detailsCuisine}>{selectedRestaurant.cuisine_type}</Text>
//                   <Text style={styles.detailsDescription}>{selectedRestaurant.description}</Text>
                  
//                   <View style={styles.detailsInfo}>
//                     <Text style={styles.detailsInfoLabel}>📍 Adresse</Text>
//                     <Text style={styles.detailsInfoText}>{selectedRestaurant.address}</Text>
//                   </View>

//                   <View style={styles.detailsInfo}>
//                     <Text style={styles.detailsInfoLabel}>⏰ Horaires</Text>
//                     <Text style={styles.detailsInfoText}>{selectedRestaurant.opening_hours}</Text>
//                   </View>

//                   <View style={styles.detailsInfo}>
//                     <Text style={styles.detailsInfoLabel}>💰 Gamme de prix</Text>
//                     <Text style={styles.detailsInfoText}>{selectedRestaurant.average_price_range}</Text>
//                   </View>

//                   {selectedRestaurant.offers && selectedRestaurant.offers.length > 0 && (
//                     <>
//                       <Text style={styles.offersTitle}>🔥 Offres disponibles</Text>
//                       {selectedRestaurant.offers.map(offer => {
//                         const isAvailableNow = isOfferAvailableNow(offer);
//                         const isInCustomSlots = isOfferInCustomTimeslots(offer, customTimeslots);
//                         const isRelevant = filterMode === FILTER_MODES.ALL || 
//                                           (filterMode === FILTER_MODES.REALTIME && isAvailableNow) ||
//                                           (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && isInCustomSlots);

//                         return (
//                           <View 
//                             key={offer.id} 
//                             style={[
//                               styles.offerCard, 
//                               !isRelevant && styles.offerCardInactive
//                             ]}
//                           >
//                             <View style={styles.offerHeader}>
//                               <Text style={styles.offerName}>{offer.dish_name}</Text>
//                               {isAvailableNow && filterMode === FILTER_MODES.REALTIME && (
//                                 <Text style={styles.availableBadge}>✨ Disponible</Text>
//                               )}
//                               {isInCustomSlots && filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && (
//                                 <Text style={styles.availableBadge}>✨ Disponible</Text>
//                               )}
//                             </View>
//                             <Text style={styles.offerDescription}>{offer.description}</Text>
//                             <View style={styles.offerPrices}>
//                               <Text style={styles.offerOldPrice}>{offer.normal_price} DH</Text>
//                               <Text style={styles.offerNewPrice}>{offer.discounted_price} DH</Text>
//                               <Text style={styles.offerDiscount}>-{offer.discount_percentage}%</Text>
//                             </View>
//                             <Text style={styles.offerTimeslots}>
//                               {offer.timeslots.map(slot => `${slot.day} ${slot.start_time}-${slot.end_time}`).join(', ')}
//                             </Text>
//                             <Text style={styles.offerQuantity}>Quantité: {offer.available_quantity}</Text>
//                           </View>
//                         );
//                       })}
//                     </>
//                   )}

//                   {(!selectedRestaurant.offers || selectedRestaurant.offers.length === 0) && (
//                     <Text style={styles.noOffers}>Aucune offre disponible pour le moment</Text>
//                   )}
//                 </>
//               )}
//             </ScrollView>

//             <TouchableOpacity
//               style={styles.closeDetailsBtn}
//               onPress={() => setShowDetailsModal(false)}
//             >
//               <Text style={styles.closeDetailsBtnText}>Fermer</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// /* ════════════════════════════ STYLES ════════════════════════════ */
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   loadingContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff' },
//   loadingText: { marginTop:10, fontSize:16, color:'#666' },

//   topBar: {
//     position:'absolute',
//     top: Platform.OS === 'ios' ? 40 : 40,
//     left:0, right:0,
//     zIndex:20,
//     paddingHorizontal:16,
//   },

//   styleRow: {
//     flexDirection:'row',
//     justifyContent:'center',
//     gap:8,
//     marginBottom:12,
//   },
//   backButton: { 
//     padding:8,
//     backgroundColor:'rgba(255,255,255,0.92)',
//     borderRadius:20,
//     marginRight: 4,
//   },
//   backButtonText: { fontSize:20, color:'#5a2c1c', fontWeight:'600' },
//   styleBtn: {
//     flexDirection:'row', alignItems:'center', gap:4,
//     backgroundColor:'rgba(255,255,255,0.92)',
//     borderRadius:20,
//     paddingHorizontal:12, paddingVertical:6,
//     borderWidth:1.5, borderColor:'transparent',
//     shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.22, shadowRadius:4,
//     elevation:5,
//   },
//   styleBtnActive: {
//     backgroundColor:'#5a2c1c',
//     borderColor:'#5a2c1c',
//   },
//   styleBtnIcon: { fontSize:15 },
//   styleBtnLabel: { fontSize:12, fontWeight:'600', color:'#333' },
//   styleBtnLabelActive: { color:'#fff' },

//   filterButton: {
//     flexDirection:'row',
//     alignItems:'center',
//     gap:8,
//     backgroundColor:'rgba(255,255,255,0.92)',
//     borderRadius:20,
//     paddingHorizontal:16,
//     paddingVertical:10,
//     alignSelf:'center',
//     shadowColor:'#000',
//     shadowOffset:{width:0,height:2},
//     shadowOpacity:0.22,
//     shadowRadius:4,
//     elevation:5,
//   },
//   filterIcon: { fontSize:18 },
//   filterLabel: { fontSize:14, fontWeight:'bold', color:'#5a2c1c' },

//   map: { flex: 1 },

//   controls: { position:'absolute', right:16, bottom:100, gap:12, zIndex:15 },
//   ctrlBtn: {
//     backgroundColor:'#fff', width:48, height:48, borderRadius:24,
//     justifyContent:'center', alignItems:'center',
//     shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4,
//     elevation:5,
//   },
//   ctrlBtnActive: {
//     backgroundColor:'#f39c12',
//   },
//   ctrlIcon: { fontSize:22 },

//   zoomWrap: {
//     backgroundColor:'#fff', borderRadius:24, overflow:'hidden',
//     shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4,
//     elevation:5,
//   },
//   zoomBtn: { width:48, height:44, justifyContent:'center', alignItems:'center' },
//   zoomText: { fontSize:24, fontWeight:'bold', color:'#333' },
//   zoomDiv: { height:1, backgroundColor:'#e0e0e0' },

//   legendWrap: { position:'absolute', bottom:24, left:16, right:80, zIndex:15 },
//   legend: {
//     backgroundColor:'rgba(255,255,255,0.95)', borderRadius:14, padding:14,
//     shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.18, shadowRadius:5,
//     elevation:5,
//   },
//   legendHeader: {
//     flexDirection: 'column',
//     marginBottom: 3,
//   },
//   legendTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//     flexWrap: 'wrap',
//   },
//   legendTitle: { fontSize:14, fontWeight:'bold', color:'#1a1a1a', marginRight:8 },
//   filterModeBadge: {
//     backgroundColor: '#5a2c1c',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },
//   filterModeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   manualBadge: {
//     backgroundColor: '#f39c12',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     alignSelf: 'flex-start',
//   },
//   manualBadgeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   legendSub: { fontSize:12, color:'#666' },

//   // Modal Config
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.75)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   configModal: {
//     width: width * 0.85,
//     maxWidth: 400,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   configGradient: {
//     padding: 30,
//   },
//   configTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   configSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//     marginBottom: 25,
//   },
//   radiusInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.25)',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.4)',
//     marginBottom: 8,
//   },
//   radiusInput: {
//     flex: 1,
//     paddingVertical: 16,
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   radiusUnit: {
//     color: 'rgba(255,255,255,0.9)',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   radiusHint: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.7)',
//     textAlign: 'center',
//     marginBottom: 20,
//     fontStyle: 'italic',
//   },
//   quickOptions: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 25,
//   },
//   quickOption: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 10,
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   quickOptionActive: {
//     backgroundColor: 'white',
//     borderColor: 'white',
//   },
//   quickOptionText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: 'white',
//   },
//   quickOptionTextActive: {
//     color: '#5a2c1c',
//   },
//   confirmBtn: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   confirmBtnText: {
//     color: '#5a2c1c',
//     fontSize: 17,
//     fontWeight: 'bold',
//   },

//   // Modal Filtre
//   filterModal: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.85,
//     paddingBottom: Platform.OS === 'ios' ? 34 : 20,
//   },
//   filterScroll: {
//     padding: 20,
//     maxHeight: height * 0.65,
//   },
//   filterModalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 20,
//   },
//   filterOptionCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//   },
//   filterOptionCardActive: {
//     borderColor: '#5a2c1c',
//     backgroundColor: '#fff8f0',
//   },
//   filterOptionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   filterOptionIcon: {
//     fontSize: 28,
//     marginRight: 12,
//   },
//   filterOptionTextContainer: {
//     flex: 1,
//   },
//   filterOptionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   filterOptionTitleActive: {
//     color: '#5a2c1c',
//   },
//   filterOptionDescription: {
//     fontSize: 13,
//     color: '#666',
//   },
//   checkmark: {
//     fontSize: 24,
//     color: '#5a2c1c',
//   },

//   timeslotsSection: {
//     marginTop: 16,
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//   },
//   timeslotsSectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//   },
//   timeslotRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   timeInput: {
//     flex: 1,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   timeSeparator: {
//     marginHorizontal: 8,
//     fontSize: 18,
//     color: '#666',
//   },
//   removeTimeslotBtn: {
//     backgroundColor: '#e74c3c',
//     borderRadius: 8,
//     width: 36,
//     height: 36,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   removeTimeslotText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   addTimeslotBtn: {
//     backgroundColor: '#5a2c1c',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   addTimeslotText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },

//   filterModalActions: {
//     flexDirection: 'row',
//     gap: 12,
//     paddingHorizontal: 20,
//     paddingTop: 16,
//   },
//   cancelFilterBtn: {
//     flex: 1,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   cancelFilterText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   applyFilterBtn: {
//     flex: 1,
//     backgroundColor: '#5a2c1c',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   applyFilterText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // Modal Détails
//   detailsOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   detailsModal: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.8,
//     paddingBottom: Platform.OS === 'ios' ? 34 : 20,
//   },
//   detailsScroll: {
//     padding: 20,
//   },
//   detailsName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   detailsCuisine: {
//     fontSize: 16,
//     color: '#5a2c1c',
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   detailsDescription: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   detailsInfo: {
//     marginBottom: 15,
//   },
//   detailsInfoLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   detailsInfoText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   offersTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginTop: 20,
//     marginBottom: 15,
//   },
//   offerCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: '#27ae60',
//   },
//   offerCardInactive: {
//     borderColor: '#ddd',
//     opacity: 0.6,
//   },
//   offerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   offerName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     flex: 1,
//   },
//   availableBadge: {
//     backgroundColor: '#27ae60',
//     color: 'white',
//     fontSize: 11,
//     fontWeight: 'bold',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   offerDescription: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 12,
//   },
//   offerPrices: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   offerOldPrice: {
//     fontSize: 14,
//     color: '#999',
//     textDecorationLine: 'line-through',
//     marginRight: 12,
//   },
//   offerNewPrice: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#e74c3c',
//     marginRight: 8,
//   },
//   offerDiscount: {
//     backgroundColor: '#e74c3c',
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   offerTimeslots: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   offerQuantity: {
//     fontSize: 12,
//     color: '#999',
//   },
//   noOffers: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     padding: 20,
//   },
//   closeDetailsBtn: {
//     backgroundColor: '#5a2c1c',
//     margin: 20,
//     marginBottom: 0,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   closeDetailsBtnText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default TrackRestaurantsScreen;



import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

// Import du fichier JSON
import restaurantsData from '../../restaurants.json';

const { width, height } = Dimensions.get('window');

const MAP_STYLES = [
  { key: 'osm', label: 'Standard', icon: '📍', tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
  { key: 'satellite', label: 'Satellite', icon: '🛰️', tiles: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
  { key: 'topo', label: 'Topo', icon: '🗺️', tiles: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' },
];

// Modes de filtrage
const FILTER_MODES = {
  ALL: 'all',
  REALTIME: 'realtime',
  CUSTOM_TIMESLOTS: 'custom_timeslots'
};

// Fonction pour obtenir la couleur selon le pourcentage de réduction
const getDiscountColor = (restaurant) => {
  // Si pas d'offres, retourner gris
  if (!restaurant.offers || restaurant.offers.length === 0) {
    return '#95a5a6'; // Gris
  }

  // Calculer le meilleur pourcentage de réduction
  const maxDiscount = Math.max(...restaurant.offers.map(offer => offer.discount_percentage || 0));

  // Système de couleurs basé sur le pourcentage
  if (maxDiscount >= 35) {
    return '#e74c3c'; // Rouge - Excellente réduction (35%+)
  } else if (maxDiscount >= 30) {
    return '#e67e22'; // Orange foncé - Très bonne réduction (30-34%)
  } else if (maxDiscount >= 25) {
    return '#f39c12'; // Orange - Bonne réduction (25-29%)
  } else if (maxDiscount >= 20) {
    return '#f1c40f'; // Jaune - Réduction correcte (20-24%)
  } else if (maxDiscount > 0) {
    return '#3498db'; // Bleu - Petite réduction (1-19%)
  } else {
    return '#95a5a6'; // Gris - Pas de réduction
  }
};

// Fonction pour obtenir le label de la catégorie de réduction
const getDiscountCategory = (discountPercentage) => {
  if (discountPercentage >= 35) return 'Excellente';
  if (discountPercentage >= 30) return 'Très bonne';
  if (discountPercentage >= 25) return 'Bonne';
  if (discountPercentage >= 20) return 'Correcte';
  if (discountPercentage > 0) return 'Petite';
  return 'Aucune';
};

// Fonction pour vérifier si une offre est disponible maintenant
const isOfferAvailableNow = (offer) => {
  const now = new Date();
  const currentDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][now.getDay()];
  const currentTime = now.getHours() * 60 + now.getMinutes();

  return offer.timeslots.some(slot => {
    // Gérer les plages de jours (ex: "Lundi-Vendredi")
    const days = slot.day.includes('-') 
      ? slot.day.split('-') 
      : [slot.day];
    
    const isDayMatch = days.length === 1 
      ? days[0] === currentDay
      : ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
          .slice(
            ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(days[0]),
            ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(days[1]) + 1
          ).includes(currentDay);

    if (!isDayMatch) return false;

    // Vérifier l'heure
    const [startHour, startMin] = slot.start_time.split(':').map(Number);
    const [endHour, endMin] = slot.end_time.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime <= endTime;
  });
};

// Fonction pour vérifier si une offre correspond aux timeslots personnalisés
const isOfferInCustomTimeslots = (offer, customTimeslots) => {
  if (!customTimeslots || customTimeslots.length === 0) return false;

  return offer.timeslots.some(offerSlot => {
    return customTimeslots.some(customSlot => {
      if (!customSlot.start || !customSlot.end) return false;

      const [offerStartH, offerStartM] = offerSlot.start_time.split(':').map(Number);
      const [offerEndH, offerEndM] = offerSlot.end_time.split(':').map(Number);
      const [customStartH, customStartM] = customSlot.start.split(':').map(Number);
      const [customEndH, customEndM] = customSlot.end.split(':').map(Number);

      const offerStart = offerStartH * 60 + offerStartM;
      const offerEnd = offerEndH * 60 + offerEndM;
      const customStart = customStartH * 60 + customStartM;
      const customEnd = customEndH * 60 + customEndM;

      // Vérifier s'il y a un chevauchement entre les créneaux
      return (offerStart <= customEnd && offerEnd >= customStart);
    });
  });
};

// Fonction pour calculer la distance entre deux points (en mètres)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

function TrackRestaurantsScreen({ navigation }) {
  const webViewRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState('osm');
  
  // Configuration modal
  const [showConfigModal, setShowConfigModal] = useState(true);
  const [selectedRadius, setSelectedRadius] = useState('1000');
  const [configComplete, setConfigComplete] = useState(false);

  // Mode de sélection de position
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [locationMode, setLocationMode] = useState('gps'); // 'gps' ou 'manual'

  // Filtrage
  const [filterMode, setFilterMode] = useState(FILTER_MODES.ALL);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [customTimeslots, setCustomTimeslots] = useState([{ start: '', end: '' }]);

  // Restaurants filtrés
  const [allRestaurantsInRadius, setAllRestaurantsInRadius] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Afficher/masquer la légende des couleurs
  const [showColorLegend, setShowColorLegend] = useState(false);

  /* ─── Géolocalisation ─── */
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Requise', "Veuillez autoriser l'accès à la localisation");
        setLoading(false);
        return;
      }
      const cur = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const userLoc = { latitude: cur.coords.latitude, longitude: cur.coords.longitude };
      setLocation(userLoc);
      setLocationMode('gps');
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  /* ─── Sélection manuelle de position ─── */
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

  /* ─── Filtrer les restaurants selon le rayon ─── */
  useEffect(() => {
    if (!location || !configComplete) return;

    const radius = parseInt(selectedRadius);
    const inRadius = restaurantsData.restaurants.filter(restaurant => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        restaurant.location.latitude,
        restaurant.location.longitude
      );
      return distance <= radius;
    });

    setAllRestaurantsInRadius(inRadius);
  }, [location, selectedRadius, configComplete]);

  /* ─── Appliquer le filtre selon le mode ─── */
  useEffect(() => {
    if (allRestaurantsInRadius.length === 0) {
      setFilteredRestaurants([]);
      return;
    }

    let filtered = [];

    switch (filterMode) {
      case FILTER_MODES.ALL:
        // Tous les restaurants dans le rayon
        filtered = allRestaurantsInRadius;
        break;

      case FILTER_MODES.REALTIME:
        // Restaurants avec offres disponibles maintenant
        filtered = allRestaurantsInRadius.filter(restaurant => {
          return restaurant.offers && restaurant.offers.length > 0 && 
                 restaurant.offers.some(offer => isOfferAvailableNow(offer));
        });
        break;

      case FILTER_MODES.CUSTOM_TIMESLOTS:
        // Restaurants avec offres dans les timeslots personnalisés
        filtered = allRestaurantsInRadius.filter(restaurant => {
          return restaurant.offers && restaurant.offers.length > 0 && 
                 restaurant.offers.some(offer => isOfferInCustomTimeslots(offer, customTimeslots));
        });
        break;

      default:
        filtered = allRestaurantsInRadius;
    }

    setFilteredRestaurants(filtered);
  }, [allRestaurantsInRadius, filterMode, customTimeslots]);

  const validateAndStartSearch = () => {
    const radius = parseInt(selectedRadius);
    if (isNaN(radius) || radius < 100 || radius > 10000) {
      Alert.alert('Rayon Invalide', 'Veuillez entrer un rayon entre 100 et 10000 mètres');
      return;
    }
    
    setConfigComplete(true);
    setShowConfigModal(false);
  };

  /* ─── Gestion des timeslots personnalisés ─── */
  const addTimeslot = () => {
    setCustomTimeslots([...customTimeslots, { start: '', end: '' }]);
  };

  const removeTimeslot = (index) => {
    if (customTimeslots.length === 1) return;
    setCustomTimeslots(customTimeslots.filter((_, i) => i !== index));
  };

  const updateTimeslot = (index, field, value) => {
    const updated = [...customTimeslots];
    updated[index][field] = value;
    setCustomTimeslots(updated);
  };

  const applyFilter = () => {
    if (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS) {
      // Valider les timeslots
      const valid = customTimeslots.every(slot => {
        if (!slot.start || !slot.end) return false;
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(slot.start) && timeRegex.test(slot.end);
      });

      if (!valid) {
        Alert.alert('Timeslots Invalides', 'Veuillez entrer des heures valides (ex: 11:00)');
        return;
      }
    }

    setShowFilterModal(false);
    
    // Forcer le refresh de la carte
    setTimeout(() => {
      if (webViewRef.current) {
        webViewRef.current.reload();
      }
    }, 300);
  };

  /* ─── Communication WebView ─── */
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'markerClick') {
        const restaurant = [...allRestaurantsInRadius].find(r => r.id.toString() === data.id);
        if (restaurant) {
          setSelectedRestaurant(restaurant);
          setShowDetailsModal(true);
        }
      } else if (data.type === 'mapClick' && isSelectingLocation) {
        const newLocation = {
          latitude: data.lat,
          longitude: data.lng
        };
        setLocation(newLocation);
        setLocationMode('manual');
        setIsSelectingLocation(false);
        
        Alert.alert(
          'Position Définie ✓',
          `Nouvelle position:\nLat: ${data.lat.toFixed(6)}\nLng: ${data.lng.toFixed(6)}`,
          [{ text: 'OK' }]
        );
        
        setTimeout(() => {
          if (webViewRef.current) {
            webViewRef.current.reload();
          }
        }, 500);
      }
    } catch (err) {
      console.error('WebView message error:', err);
    }
  };

  /* ─── Contrôles caméra ─── */
  const centerOnLocation = () => {
    if (!location || !webViewRef.current) return;
    const js = `map.setView([${location.latitude}, ${location.longitude}], 15); true;`;
    webViewRef.current.injectJavaScript(js);
  };

  const zoomIn = () => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript(`map.zoomIn(); true;`);
  };

  const zoomOut = () => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript(`map.zoomOut(); true;`);
  };

  /* ─── Changement de style ─── */
  useEffect(() => {
    if (!webViewRef.current || loading) return;
    const selectedStyle = MAP_STYLES.find(s => s.key === mapType);
    if (selectedStyle) {
      const js = `
        if (window.currentTileLayer) {
          map.removeLayer(window.currentTileLayer);
        }
        window.currentTileLayer = L.tileLayer('${selectedStyle.tiles}', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);
        true;
      `;
      webViewRef.current.injectJavaScript(js);
    }
  }, [mapType, loading]);

  /* ─── HTML de la carte ─── */
  const radius = parseInt(selectedRadius) || 1000;
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
        ${isSelectingLocation ? `
        #map {
          cursor: crosshair !important;
        }
        ` : ''}
        .user-marker {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: radial-gradient(circle, #4285F4 0%, #1565C0 100%);
          border: 3px solid #fff;
          box-shadow: 0 3px 8px rgba(66,133,244,0.5);
          animation: pulse 2s infinite;
        }
        .user-marker-manual {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle, #f39c12 0%, #e67e22 100%);
          border: 3px solid #fff;
          box-shadow: 0 3px 8px rgba(243,156,18,0.5);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 3px 8px rgba(66,133,244,0.5); }
          50% { box-shadow: 0 3px 8px rgba(66,133,244,0.8), 0 0 0 10px rgba(66,133,244,0.3); }
        }
        .restaurant-marker {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          border: 3px solid #fff;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .restaurant-marker:hover {
          transform: scale(1.15);
        }
        .restaurant-marker-inactive {
          opacity: 0.4;
          filter: grayscale(70%);
        }
        .available-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 14px;
          height: 14px;
          background: #27ae60;
          border: 2px solid white;
          border-radius: 50%;
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .selection-banner {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: #f39c12;
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: bold;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { top: -50px; opacity: 0; }
          to { top: 10px; opacity: 1; }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      ${isSelectingLocation ? '<div class="selection-banner">📍 Cliquez sur la carte pour définir votre position</div>' : ''}
      <script>
        var map = L.map('map', { 
          zoomControl: false,
          attributionControl: false
        }).setView([${location ? location.latitude : 33.589}, ${location ? location.longitude : -7.645}], 15);

        window.currentTileLayer = L.tileLayer('${MAP_STYLES[0].tiles}', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Gérer les clics sur la carte
        ${isSelectingLocation ? `
        map.on('click', function(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapClick',
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }));
        });
        ` : ''}

        // Cercle de rayon
        ${location ? `
          L.circle([${location.latitude}, ${location.longitude}], {
            radius: ${radius},
            color: '${locationMode === 'manual' ? '#f39c12' : '#5a2c1c'}',
            fillColor: '${locationMode === 'manual' ? '#f39c12' : '#5a2c1c'}',
            fillOpacity: 0.1,
            weight: 2
          }).addTo(map);
        ` : ''}

        // Marqueur utilisateur
        ${location ? `
          var userIcon = L.divIcon({
            className: '${locationMode === 'manual' ? 'user-marker-manual' : 'user-marker'}',
            iconSize: [${locationMode === 'manual' ? 32 : 28}, ${locationMode === 'manual' ? 32 : 28}],
            html: ''
          });
          L.marker([${location.latitude}, ${location.longitude}], {icon: userIcon})
            .addTo(map)
            .bindPopup("<b>${locationMode === 'manual' ? '📍 Position Manuelle' : '📍 Votre Position GPS'}</b>");
        ` : ''}

        // Marqueurs restaurants (TOUS dans le rayon)
        ${allRestaurantsInRadius.map(r => {
          const color = getDiscountColor(r);
          const hasOffers = r.offers && r.offers.length > 0;
          const maxDiscount = hasOffers ? Math.max(...r.offers.map(o => o.discount_percentage || 0)) : 0;
          const isInFilteredList = filteredRestaurants.some(fr => fr.id === r.id);
          const hasActiveOffer = hasOffers && r.offers.some(offer => {
            if (filterMode === FILTER_MODES.REALTIME) {
              return isOfferAvailableNow(offer);
            } else if (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS) {
              return isOfferInCustomTimeslots(offer, customTimeslots);
            }
            return false;
          });
          
          const isInactive = filterMode !== FILTER_MODES.ALL && !isInFilteredList;
          
          return `
          var marker${r.id} = document.createElement('div');
          marker${r.id}.className = 'restaurant-marker ${isInactive ? 'restaurant-marker-inactive' : ''}';
          marker${r.id}.style.background = 'linear-gradient(135deg, ${color} 0%, ${color}dd 100%)';
          marker${r.id}.style.position = 'relative';
          marker${r.id}.innerHTML = '🍽️${hasActiveOffer && !isInactive ? '<div class="available-badge"></div>' : ''}';
          
          var icon${r.id} = L.divIcon({
            className: '',
            iconSize: [44, 44],
            html: marker${r.id}.outerHTML
          });
          
          var popupContent = \`
            <div style="min-width: 220px;">
              <b style="font-size: 16px; color: #333;">${r.name.replace(/'/g, "\\'")}</b><br>
              <span style="color: #666; font-size: 13px;">${r.cuisine_type}</span><br>
              <span style="color: #888; font-size: 12px;">📍 ${r.address.substring(0, 30)}...</span>
              ${hasOffers ? `
                <div style="margin-top: 8px; padding: 8px; background: ${hasActiveOffer && !isInactive ? '#e8f5e9' : '#f5f5f5'}; border-radius: 6px;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    ${hasActiveOffer && !isInactive ? `
                      <b style="color: #27ae60; font-size: 13px;">✨ Offre disponible</b>
                    ` : `
                      <b style="color: #999; font-size: 13px;">Offres disponibles</b>
                    `}
                    <span style="background: ${color}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-left: 8px;">-${maxDiscount}%</span>
                  </div>
                </div>
              ` : '<div style="margin-top: 6px; color: #999; font-size: 12px;">Aucune offre actuellement</div>'}
            </div>
          \`;
          
          L.marker([${r.location.latitude}, ${r.location.longitude}], {icon: icon${r.id}})
            .addTo(map)
            .bindPopup(popupContent)
            .on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerClick',
                id: '${r.id}'
              }));
            });
        `}).join('\n')}
      </script>
    </body>
  </html>
  `;

  /* ─── Loading ─── */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5a2c1c" />
        <Text style={styles.loadingText}>Chargement de la carte…</Text>
      </View>
    );
  }

  /* ─── Render Filter Mode Label ─── */
  const getFilterLabel = () => {
    switch (filterMode) {
      case FILTER_MODES.ALL:
        return 'Tous les restaurants';
      case FILTER_MODES.REALTIME:
        return 'Offres disponibles maintenant';
      case FILTER_MODES.CUSTOM_TIMESLOTS:
        return 'Offres dans mes créneaux';
      default:
        return 'Tous';
    }
  };

  /* ─── Render ─── */
  return (
    <View style={styles.container}>
      {/* Barre supérieure avec styles et filtre */}
      <View style={styles.topBar}>
        <View style={styles.styleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          {MAP_STYLES.map(s => {
            const active = mapType === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.styleBtn, active && styles.styleBtnActive]}
                onPress={() => setMapType(s.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.styleBtnIcon}>{s.icon}</Text>
                <Text style={[styles.styleBtnLabel, active && styles.styleBtnLabelActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bouton Filtre */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/Icons/filter.png')}
            resizeMode="contain"
            style={styles.filterIcon}
          />
          {/* <Text style={styles.filterLabel}>Filtrer</Text> */}
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

      {/* Contrôles */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.ctrlBtn, isSelectingLocation && styles.ctrlBtnActive]} 
          onPress={toggleLocationSelection}
        >
          <Text style={styles.ctrlIcon}>{isSelectingLocation ? '✖' : '📌'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} onPress={getCurrentLocation}>
          <Text style={styles.ctrlIcon}>🎯</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} onPress={centerOnLocation}>
          <Text style={styles.ctrlIcon}>📍</Text>
        </TouchableOpacity>

        <View style={styles.zoomWrap}>
          <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <View style={styles.zoomDiv} />
          <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut}>
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Légende avec code couleur */}
      <View style={styles.legendWrap}>
        <View style={styles.legend}>
          <TouchableOpacity 
            onPress={() => setShowColorLegend(!showColorLegend)}
            activeOpacity={0.8}
          >
            <View style={styles.legendHeader}>
              <View style={styles.legendTitleRow}>
                <Text style={styles.legendTitle}>
                  {filterMode === FILTER_MODES.ALL ? allRestaurantsInRadius.length : filteredRestaurants.length} restaurant{(filterMode === FILTER_MODES.ALL ? allRestaurantsInRadius.length : filteredRestaurants.length) > 1 ? 's' : ''}
                </Text>
                <View style={styles.filterModeBadge}>
                  <Text style={styles.filterModeText}>{getFilterLabel()}</Text>
                </View>
              </View>
              {locationMode === 'manual' && (
                <View style={styles.manualBadge}>
                  <Text style={styles.manualBadgeText}>📌 Manuel</Text>
                </View>
              )}
            </View>
            <Text style={styles.legendSub}>
              Rayon: {radius >= 1000 ? `${radius/1000} km` : `${radius}m`} • {showColorLegend ? 'Masquer' : 'Voir'} le code couleur
            </Text>
          </TouchableOpacity>

          {/* Code couleur des réductions */}
          {showColorLegend && (
            <View style={styles.colorLegendContainer}>
              <Text style={styles.colorLegendTitle}>Code Couleur des Réductions</Text>
              
              <View style={styles.colorLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.colorLegendText}>Excellente (35%+)</Text>
              </View>
              
              <View style={styles.colorLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#e67e22' }]} />
                <Text style={styles.colorLegendText}>Très bonne (30-34%)</Text>
              </View>
              
              <View style={styles.colorLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#f39c12' }]} />
                <Text style={styles.colorLegendText}>Bonne (25-29%)</Text>
              </View>
              
              <View style={styles.colorLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#f1c40f' }]} />
                <Text style={styles.colorLegendText}>Correcte (20-24%)</Text>
              </View>
              
              <View style={styles.colorLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#3498db' }]} />
                <Text style={styles.colorLegendText}>Petite (1-19%)</Text>
              </View>
              
              <View style={styles.colorLegendItem}>
                <View style={[styles.colorDot, { backgroundColor: '#95a5a6' }]} />
                <Text style={styles.colorLegendText}>Aucune réduction</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Modal de Configuration Initiale */}
      <Modal
        visible={showConfigModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => configComplete && setShowConfigModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.configModal}>
            <LinearGradient
              colors={['#3c1d04', '#824104']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.configGradient}
            >
              <Text style={styles.configTitle}>Rayon de Recherche</Text>
              <Text style={styles.configSubtitle}>
                Définissez la distance de recherche autour de votre position
              </Text>

              <View style={styles.radiusInputContainer}>
                <TextInput
                  style={styles.radiusInput}
                  placeholder="Ex: 1000"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={selectedRadius}
                  onChangeText={setSelectedRadius}
                  keyboardType="numeric"
                />
                <Text style={styles.radiusUnit}>mètres</Text>
              </View>
              <Text style={styles.radiusHint}>Entre 100m et 10km (10000m)</Text>

              <View style={styles.quickOptions}>
                {[500, 1000, 2000, 5000].map(val => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.quickOption,
                      selectedRadius === val.toString() && styles.quickOptionActive
                    ]}
                    onPress={() => setSelectedRadius(val.toString())}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.quickOptionText,
                      selectedRadius === val.toString() && styles.quickOptionTextActive
                    ]}>
                      {val >= 1000 ? `${val/1000} km` : `${val}m`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={validateAndStartSearch}
                activeOpacity={0.9}
              >
                <Text style={styles.confirmBtnText}>Confirmer</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Modal de Filtrage */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <ScrollView style={styles.filterScroll}>
              <Text style={styles.filterModalTitle}>🔍 Options de Filtrage</Text>
              
              {/* Mode Tous */}
              <TouchableOpacity
                style={[
                  styles.filterOptionCard,
                  filterMode === FILTER_MODES.ALL && styles.filterOptionCardActive
                ]}
                onPress={() => setFilterMode(FILTER_MODES.ALL)}
                activeOpacity={0.8}
              >
                <View style={styles.filterOptionHeader}>
                  <Text style={styles.filterOptionIcon}>🗺️</Text>
                  <View style={styles.filterOptionTextContainer}>
                    <Text style={[
                      styles.filterOptionTitle,
                      filterMode === FILTER_MODES.ALL && styles.filterOptionTitleActive
                    ]}>
                      Tous les restaurants
                    </Text>
                    <Text style={styles.filterOptionDescription}>
                      Afficher tous les restaurants dans le rayon
                    </Text>
                  </View>
                  {filterMode === FILTER_MODES.ALL && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Mode Temps Réel */}
              <TouchableOpacity
                style={[
                  styles.filterOptionCard,
                  filterMode === FILTER_MODES.REALTIME && styles.filterOptionCardActive
                ]}
                onPress={() => setFilterMode(FILTER_MODES.REALTIME)}
                activeOpacity={0.8}
              >
                <View style={styles.filterOptionHeader}>
                  <Text style={styles.filterOptionIcon}>⚡</Text>
                  <View style={styles.filterOptionTextContainer}>
                    <Text style={[
                      styles.filterOptionTitle,
                      filterMode === FILTER_MODES.REALTIME && styles.filterOptionTitleActive
                    ]}>
                      Offres disponibles maintenant
                    </Text>
                    <Text style={styles.filterOptionDescription}>
                      Restaurants avec offres actives en ce moment
                    </Text>
                  </View>
                  {filterMode === FILTER_MODES.REALTIME && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Mode Créneaux Personnalisés */}
              <TouchableOpacity
                style={[
                  styles.filterOptionCard,
                  filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && styles.filterOptionCardActive
                ]}
                onPress={() => setFilterMode(FILTER_MODES.CUSTOM_TIMESLOTS)}
                activeOpacity={0.8}
              >
                <View style={styles.filterOptionHeader}>
                  <Text style={styles.filterOptionIcon}>🕐</Text>
                  <View style={styles.filterOptionTextContainer}>
                    <Text style={[
                      styles.filterOptionTitle,
                      filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && styles.filterOptionTitleActive
                    ]}>
                      Créneaux horaires personnalisés
                    </Text>
                    <Text style={styles.filterOptionDescription}>
                      Définir vos propres créneaux de recherche
                    </Text>
                  </View>
                  {filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Input Timeslots */}
              {filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && (
                <View style={styles.timeslotsSection}>
                  <Text style={styles.timeslotsSectionTitle}>⏰ Vos Créneaux</Text>
                  
                  {customTimeslots.map((slot, index) => (
                    <View key={index} style={styles.timeslotRow}>
                      <TextInput
                        style={styles.timeInput}
                        placeholder="11:00"
                        placeholderTextColor="#999"
                        value={slot.start}
                        onChangeText={(text) => updateTimeslot(index, 'start', text)}
                      />
                      <Text style={styles.timeSeparator}>→</Text>
                      <TextInput
                        style={styles.timeInput}
                        placeholder="14:00"
                        placeholderTextColor="#999"
                        value={slot.end}
                        onChangeText={(text) => updateTimeslot(index, 'end', text)}
                      />
                      {customTimeslots.length > 1 && (
                        <TouchableOpacity
                          style={styles.removeTimeslotBtn}
                          onPress={() => removeTimeslot(index)}
                        >
                          <Text style={styles.removeTimeslotText}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.addTimeslotBtn}
                    onPress={addTimeslot}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addTimeslotText}>+ Ajouter un créneau</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            {/* Boutons d'action */}
            <View style={styles.filterModalActions}>
              <TouchableOpacity
                style={styles.cancelFilterBtn}
                onPress={() => setShowFilterModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelFilterText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFilterBtn}
                onPress={applyFilter}
                activeOpacity={0.8}
              >
                <Text style={styles.applyFilterText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Détails Restaurant */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.detailsOverlay}>
          <View style={styles.detailsModal}>
            <ScrollView style={styles.detailsScroll}>
              {selectedRestaurant && (
                <>
                  <Text style={styles.detailsName}>{selectedRestaurant.name}</Text>
                  <Text style={styles.detailsCuisine}>{selectedRestaurant.cuisine_type}</Text>
                  <Text style={styles.detailsDescription}>{selectedRestaurant.description}</Text>
                  
                  <View style={styles.detailsInfo}>
                    <Text style={styles.detailsInfoLabel}>📍 Adresse</Text>
                    <Text style={styles.detailsInfoText}>{selectedRestaurant.address}</Text>
                  </View>

                  <View style={styles.detailsInfo}>
                    <Text style={styles.detailsInfoLabel}>⏰ Horaires</Text>
                    <Text style={styles.detailsInfoText}>{selectedRestaurant.opening_hours}</Text>
                  </View>

                  <View style={styles.detailsInfo}>
                    <Text style={styles.detailsInfoLabel}>💰 Gamme de prix</Text>
                    <Text style={styles.detailsInfoText}>{selectedRestaurant.average_price_range}</Text>
                  </View>

                  {selectedRestaurant.offers && selectedRestaurant.offers.length > 0 && (
                    <>
                      <Text style={styles.offersTitle}>🔥 Offres disponibles</Text>
                      {selectedRestaurant.offers.map(offer => {
                        const isAvailableNow = isOfferAvailableNow(offer);
                        const isInCustomSlots = isOfferInCustomTimeslots(offer, customTimeslots);
                        const isRelevant = filterMode === FILTER_MODES.ALL || 
                                          (filterMode === FILTER_MODES.REALTIME && isAvailableNow) ||
                                          (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && isInCustomSlots);
                        
                        const discountCategory = getDiscountCategory(offer.discount_percentage);
                        const discountColor = offer.discount_percentage >= 35 ? '#e74c3c' :
                                            offer.discount_percentage >= 30 ? '#e67e22' :
                                            offer.discount_percentage >= 25 ? '#f39c12' :
                                            offer.discount_percentage >= 20 ? '#f1c40f' :
                                            '#3498db';

                        return (
                          <View 
                            key={offer.id} 
                            style={[
                              styles.offerCard, 
                              !isRelevant && styles.offerCardInactive,
                              { borderColor: discountColor }
                            ]}
                          >
                            <View style={styles.offerHeader}>
                              <Text style={styles.offerName}>{offer.dish_name}</Text>
                              {isAvailableNow && filterMode === FILTER_MODES.REALTIME && (
                                <Text style={styles.availableBadge}>✨ Disponible</Text>
                              )}
                              {isInCustomSlots && filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && (
                                <Text style={styles.availableBadge}>✨ Disponible</Text>
                              )}
                            </View>
                            <View style={styles.discountCategoryBadge}>
                              <Text style={[styles.discountCategoryText, { color: discountColor }]}>
                                {discountCategory} réduction
                              </Text>
                            </View>
                            <Text style={styles.offerDescription}>{offer.description}</Text>
                            <View style={styles.offerPrices}>
                              <Text style={styles.offerOldPrice}>{offer.normal_price} DH</Text>
                              <Text style={styles.offerNewPrice}>{offer.discounted_price} DH</Text>
                              <Text style={[styles.offerDiscount, { backgroundColor: discountColor }]}>
                                -{offer.discount_percentage}%
                              </Text>
                            </View>
                            <Text style={styles.offerTimeslots}>
                              {offer.timeslots.map(slot => `${slot.day} ${slot.start_time}-${slot.end_time}`).join(', ')}
                            </Text>
                            <Text style={styles.offerQuantity}>Quantité: {offer.available_quantity}</Text>
                          </View>
                        );
                      })}
                    </>
                  )}

                  {(!selectedRestaurant.offers || selectedRestaurant.offers.length === 0) && (
                    <Text style={styles.noOffers}>Aucune offre disponible pour le moment</Text>
                  )}
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeDetailsBtn}
              onPress={() => setShowDetailsModal(false)}
            >
              <Text style={styles.closeDetailsBtnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ════════════════════════════ STYLES ════════════════════════════ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff' },
  loadingText: { marginTop:10, fontSize:16, color:'#666' },

  topBar: {
    position:'absolute',
    top: Platform.OS === 'ios' ? 40 : 40,
    left:0, right:0,
    zIndex:20,
    paddingHorizontal:16,
  },

  styleRow: {
    flexDirection:'row',
    justifyContent:'center',
    gap:8,
    marginBottom:12,
  },
  backButton: { 
    padding:8,
    backgroundColor:'rgba(255,255,255,0.92)',
    borderRadius:20,
    marginRight: 4,
  },
  backButtonText: { fontSize:20, color:'#5a2c1c', fontWeight:'600' },
  styleBtn: {
    flexDirection:'row', alignItems:'center', gap:4,
    backgroundColor:'rgba(255,255,255,0.92)',
    borderRadius:20,
    paddingHorizontal:12, paddingVertical:6,
    borderWidth:1.5, borderColor:'transparent',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.22, shadowRadius:4,
    elevation:5,
  },
  styleBtnActive: {
    backgroundColor:'#5a2c1c',
    borderColor:'#5a2c1c',
  },
  styleBtnIcon: { fontSize:15 },
  styleBtnLabel: { fontSize:12, fontWeight:'600', color:'#333' },
  styleBtnLabelActive: { color:'#fff' },

  filterButton: {
    flexDirection:'row',
    alignItems:'center',
    position:'absolute',
    right:10,
    top:50,
    gap:8,
    backgroundColor:'rgba(255,255,255,0.92)',
    borderRadius:20,
    paddingHorizontal:6,
    paddingVertical: 8,
    alignSelf:'center',
    shadowColor:'#000',
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.22,
    shadowRadius:4,
    elevation:5,
  },
  filterIcon: 
  { 
    width:40,
    height:30, 
  },
  filterLabel: { fontSize:14, fontWeight:'bold', color:'#5a2c1c' },

  map: { flex: 1 },

  controls: { position:'absolute', right:16, bottom:180, gap:12, zIndex:15 },
  ctrlBtn: {
    backgroundColor:'#fff', width:48, height:48, borderRadius:24,
    justifyContent:'center', alignItems:'center',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4,
    elevation:5,
  },
  ctrlBtnActive: {
    backgroundColor:'#f39c12',
  },
  ctrlIcon: { fontSize:22 },

  zoomWrap: {
    backgroundColor:'#fff', borderRadius:24, overflow:'hidden',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4,
    elevation:5,
  },
  zoomBtn: { width:48, height:44, justifyContent:'center', alignItems:'center' },
  zoomText: { fontSize:24, fontWeight:'bold', color:'#333' },
  zoomDiv: { height:1, backgroundColor:'#e0e0e0' },

  legendWrap: { position:'absolute', bottom:24, left:16, right:80, zIndex:15 },
  legend: {
    backgroundColor:'rgba(255,255,255,0.95)', borderRadius:14, padding:14,
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.18, shadowRadius:5,
    elevation:5,
  },
  legendHeader: {
    flexDirection: 'column',
    marginBottom: 3,
  },
  legendTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  legendTitle: { fontSize:14, fontWeight:'bold', color:'#1a1a1a', marginRight:8 },
  filterModeBadge: {
    backgroundColor: '#5a2c1c',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  filterModeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  manualBadge: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  manualBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legendSub: { fontSize:11, color:'#666', fontStyle: 'italic' },

  // Code couleur
  colorLegendContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  colorLegendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  colorLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  colorLegendText: {
    fontSize: 11,
    color: '#555',
  },

  // Modal Config
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  configModal: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  configGradient: {
    padding: 30,
  },
  configTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  configSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 25,
  },
  radiusInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  },
  radiusInput: {
    flex: 1,
    paddingVertical: 16,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  radiusUnit: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '600',
  },
  radiusHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  quickOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  quickOption: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickOptionActive: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  quickOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  quickOptionTextActive: {
    color: '#5a2c1c',
  },
  confirmBtn: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: {
    color: '#5a2c1c',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // Modal Filtre
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  filterScroll: {
    padding: 20,
    maxHeight: height * 0.65,
  },
  filterModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  filterOptionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  filterOptionCardActive: {
    borderColor: '#5a2c1c',
    backgroundColor: '#fff8f0',
  },
  filterOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOptionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  filterOptionTextContainer: {
    flex: 1,
  },
  filterOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  filterOptionTitleActive: {
    color: '#5a2c1c',
  },
  filterOptionDescription: {
    fontSize: 13,
    color: '#666',
  },
  checkmark: {
    fontSize: 24,
    color: '#5a2c1c',
  },

  timeslotsSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  timeslotsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  timeslotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timeSeparator: {
    marginHorizontal: 8,
    fontSize: 18,
    color: '#666',
  },
  removeTimeslotBtn: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeTimeslotText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addTimeslotBtn: {
    backgroundColor: '#5a2c1c',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addTimeslotText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  filterModalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  cancelFilterBtn: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelFilterText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyFilterBtn: {
    flex: 1,
    backgroundColor: '#5a2c1c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyFilterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal Détails
  detailsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  detailsScroll: {
    padding: 20,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  detailsCuisine: {
    fontSize: 16,
    color: '#5a2c1c',
    fontWeight: '600',
    marginBottom: 12,
  },
  detailsDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  detailsInfo: {
    marginBottom: 15,
  },
  detailsInfoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detailsInfoText: {
    fontSize: 14,
    color: '#666',
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 15,
  },
  offerCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  offerCardInactive: {
    opacity: 0.6,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  availableBadge: {
    backgroundColor: '#27ae60',
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountCategoryBadge: {
    marginBottom: 8,
  },
  discountCategoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  offerDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  offerPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerOldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  offerNewPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 8,
  },
  offerDiscount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  offerTimeslots: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  offerQuantity: {
    fontSize: 12,
    color: '#999',
  },
  noOffers: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  closeDetailsBtn: {
    backgroundColor: '#5a2c1c',
    margin: 20,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeDetailsBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrackRestaurantsScreen;