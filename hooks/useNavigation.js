import { useState } from 'react';
import { Alert } from 'react-native';

/**
 * Hook personnalisé pour gérer la navigation et les itinéraires
 */
export const useNavigation = (location, webViewRef) => {
  const [showRoute, setShowRoute] = useState(false);
  const [selectedTransportMode, setSelectedTransportMode] = useState('driving');
  const [routeDestination, setRouteDestination] = useState(null);

  // Afficher l'itinéraire vers un restaurant
  const showNavigationRoute = (restaurant, transportMode) => {
    if (!location) {
      Alert.alert('Erreur', 'Position non disponible');
      return;
    }

    setRouteDestination(restaurant);
    setSelectedTransportMode(transportMode);
    setShowRoute(true);

    // Attendre que la modal se ferme complètement
    setTimeout(() => {
      if (webViewRef.current) {
        const routeJS = generateRouteJavaScript(
          location,
          restaurant,
          transportMode
        );
        
        console.log('Injection du code de navigation...');
        webViewRef.current.injectJavaScript(routeJS);
      }
    }, 600);
  };

  // Effacer l'itinéraire
  const clearRoute = () => {
    setShowRoute(false);
    setRouteDestination(null);
    
    if (webViewRef.current) {
      const clearJS = `
        (function() {
          console.log('Effacement de l\\'itinéraire...');
          if (window.routeLayer) {
            map.removeLayer(window.routeLayer);
            window.routeLayer = null;
            console.log('Route supprimée');
          }
          if (window.routeMarkers) {
            window.routeMarkers.forEach(m => map.removeLayer(m));
            window.routeMarkers = [];
            console.log('Marqueurs supprimés');
          }
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(clearJS);
    }
  };

  // Gérer les messages de la WebView concernant la navigation
  const handleRouteMessage = (data) => {
    if (data.type === 'routeInfo') {
      console.log('✓ Info itinéraire:', data);
      const modeText = data.mode === 'walking' ? 'À pied 🚶' : 'En voiture 🚗';
      Alert.alert(
        '🧭 Itinéraire calculé',
        `${modeText}\n\n🛣️ Distance: ${data.distance} km\n⏱️ Durée estimée: ${data.duration} min`,
        [{ text: 'OK' }]
      );
    } else if (data.type === 'routeError') {
      console.error('❌ Erreur route:', data.message);
      Alert.alert('Erreur de Navigation', data.message);
    }
  };

  return {
    showRoute,
    selectedTransportMode,
    routeDestination,
    showNavigationRoute,
    clearRoute,
    handleRouteMessage,
  };
};

/**
 * Génère le code JavaScript pour afficher l'itinéraire
 */
function generateRouteJavaScript(location, restaurant, transportMode) {
  return `
    (function() {
      try {
        console.log('Début du calcul de l\\'itinéraire...');
        
        // Supprimer l'ancien itinéraire s'il existe
        if (window.routeLayer) {
          map.removeLayer(window.routeLayer);
          window.routeLayer = null;
        }
        if (window.routeMarkers) {
          window.routeMarkers.forEach(m => map.removeLayer(m));
          window.routeMarkers = [];
        }

        // Récupérer l'itinéraire depuis OSRM
        const url = 'https://router.project-osrm.org/route/v1/${transportMode}/${location.longitude},${location.latitude};${restaurant.location.longitude},${restaurant.location.latitude}?overview=full&geometries=geojson&steps=true';
        console.log('URL OSRM:', url);
        
        fetch(url)
          .then(response => {
            console.log('Réponse OSRM status:', response.status);
            if (!response.ok) {
              throw new Error('Erreur HTTP ' + response.status);
            }
            return response.json();
          })
          .then(data => {
            console.log('Données OSRM reçues:', data.code);
            
            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
              
              console.log('Nombre de points de l\\'itinéraire:', coordinates.length);
              
              // Dessiner la route avec une ligne très visible
              window.routeLayer = L.polyline(coordinates, {
                color: '${transportMode === 'walking' ? '#FF6B35' : '#0066FF'}',
                weight: 8,
                opacity: 0.9,
                lineJoin: 'round',
                lineCap: 'round',
                dashArray: null,
                zIndexOffset: 1000
              }).addTo(map);

              console.log('Route dessinée sur la carte');

              // Initialiser le tableau de marqueurs
              window.routeMarkers = [];
              
              // Marqueur de départ (votre position)
              var startIcon = L.divIcon({
                className: '',
                html: '<div style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 4px solid white; box-shadow: 0 6px 15px rgba(0,0,0,0.6); z-index: 2000;">🚩</div>',
                iconSize: [40, 40]
              });
              var startMarker = L.marker([${location.latitude}, ${location.longitude}], {
                icon: startIcon,
                zIndexOffset: 2000
              })
                .addTo(map)
                .bindPopup('<div style="min-width: 150px;"><b style="font-size: 16px;">🚩 Départ</b><br><span style="font-size: 13px; color: #666;">Votre position</span></div>');
              window.routeMarkers.push(startMarker);

              console.log('Marqueur de départ ajouté');

              // Marqueur d'arrivée (restaurant)
              var endIcon = L.divIcon({
                className: '',
                html: '<div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 4px solid white; box-shadow: 0 6px 15px rgba(0,0,0,0.6); animation: pulse 2s infinite; z-index: 2000;">🎯</div>',
                iconSize: [44, 44]
              });
              var endMarker = L.marker([${restaurant.location.latitude}, ${restaurant.location.longitude}], {
                icon: endIcon,
                zIndexOffset: 2000
              })
                .addTo(map)
                .bindPopup('<div style="min-width: 180px;"><b style="font-size: 16px;">🎯 Destination</b><br><span style="font-size: 14px; color: #e74c3c; font-weight: bold;">${restaurant.name.replace(/'/g, "\\'")}</span></div>');
              window.routeMarkers.push(endMarker);

              console.log('Marqueur d\\'arrivée ajouté');

              // Ajuster la vue pour voir toute la route
              setTimeout(function() {
                const bounds = window.routeLayer.getBounds();
                map.fitBounds(bounds, {
                  padding: [80, 80],
                  maxZoom: 15,
                  animate: true,
                  duration: 1
                });
                console.log('Vue ajustée sur l\\'itinéraire');
              }, 200);

              // Calculer et afficher les infos de route
              const distance = (route.distance / 1000).toFixed(2);
              const duration = Math.round(route.duration / 60);
              
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'routeInfo',
                distance: distance,
                duration: duration,
                mode: '${transportMode}'
              }));
              
              console.log('✓ Itinéraire calculé avec succès:', distance, 'km,', duration, 'min');
            } else {
              console.error('Erreur OSRM code:', data.code);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'routeError',
                message: 'Code OSRM: ' + data.code
              }));
            }
          })
          .catch(error => {
            console.error('Erreur fetch OSRM:', error.message);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'routeError',
              message: 'Erreur: ' + error.message
            }));
          });
      } catch (e) {
        console.error('Erreur générale:', e.message);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'routeError',
          message: 'Erreur: ' + e.message
        }));
      }
    })();
    true;
  `;
}