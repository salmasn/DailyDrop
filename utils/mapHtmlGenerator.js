import { MAP_STYLES } from '../components/map/TopBar';
import { getDiscountColor, isOfferAvailableNow, isOfferInCustomTimeslots } from './offerUtils';
import { FILTER_MODES } from '../hooks/useRestaurantFiltering';

/**
 * Génère le code HTML de la carte Leaflet
 */
export const generateMapHTML = ({
  location,
  radius,
  locationMode,
  isSelectingLocation,
  allRestaurantsInRadius,
  filteredRestaurants,
  filterMode,
  customTimeslots,
}) => {
  return `
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
        console.log('Initialisation de la carte Leaflet...');
        
        var map = L.map('map', { 
          zoomControl: false,
          attributionControl: false
        }).setView([${location ? location.latitude : 33.589}, ${location ? location.longitude : -7.645}], 15);

        window.currentTileLayer = L.tileLayer('${MAP_STYLES[0].tiles}', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        console.log('Carte initialisée');

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
        ${generateRestaurantMarkers(
          allRestaurantsInRadius,
          filteredRestaurants,
          filterMode,
          customTimeslots
        )}

        console.log('Tous les marqueurs ajoutés');
      </script>
    </body>
  </html>
  `;
};

/**
 * Génère le code JavaScript des marqueurs de restaurants
 */
function generateRestaurantMarkers(
  allRestaurants,
  filteredRestaurants,
  filterMode,
  customTimeslots
) {
  return allRestaurants.map(restaurant => {
    const color = getDiscountColor(restaurant);
    const hasOffers = restaurant.offers && restaurant.offers.length > 0;
    const maxDiscount = hasOffers 
      ? Math.max(...restaurant.offers.map(o => o.discount_percentage || 0)) 
      : 0;
    
    const isInFilteredList = filteredRestaurants.some(fr => fr.id === restaurant.id);
    
    const hasActiveOffer = hasOffers && restaurant.offers.some(offer => {
      if (filterMode === FILTER_MODES.REALTIME) {
        return isOfferAvailableNow(offer);
      } else if (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS) {
        return isOfferInCustomTimeslots(offer, customTimeslots);
      }
      return false;
    });
    
    const isInactive = filterMode !== FILTER_MODES.ALL && !isInFilteredList;
    
    return `
      var marker${restaurant.id} = document.createElement('div');
      marker${restaurant.id}.className = 'restaurant-marker ${isInactive ? 'restaurant-marker-inactive' : ''}';
      marker${restaurant.id}.style.background = 'linear-gradient(135deg, ${color} 0%, ${color}dd 100%)';
      marker${restaurant.id}.style.position = 'relative';
      marker${restaurant.id}.innerHTML = '🍽️${hasActiveOffer && !isInactive ? '<div class="available-badge"></div>' : ''}';
      
      var icon${restaurant.id} = L.divIcon({
        className: '',
        iconSize: [44, 44],
        html: marker${restaurant.id}.outerHTML
      });
      
      var popupContent = \`
        <div style="min-width: 220px;">
          <b style="font-size: 16px; color: #333;">${restaurant.name.replace(/'/g, "\\'")}</b><br>
          <span style="color: #666; font-size: 13px;">${restaurant.cuisine_type}</span><br>
          <span style="color: #888; font-size: 12px;">📍 ${restaurant.address.substring(0, 30)}...</span>
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
      
      L.marker([${restaurant.location.latitude}, ${restaurant.location.longitude}], {icon: icon${restaurant.id}})
        .addTo(map)
        .bindPopup(popupContent)
        .on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerClick',
            id: '${restaurant.id}'
          }));
        });
    `;
  }).join('\n');
}