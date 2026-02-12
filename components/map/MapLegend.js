import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FILTER_MODES } from '../../hooks/useRestaurantFiltering';

/**
 * Composant MapLegend - Affiche les informations et la légende des couleurs
 */
const MapLegend = ({
  totalRestaurants,
  filteredCount,
  filterMode,
  radius,
  locationMode,
  showRoute,
  routeDestination,
}) => {
  const [showColorLegend, setShowColorLegend] = useState(false);

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

  const displayCount = filterMode === FILTER_MODES.ALL ? totalRestaurants : filteredCount;

  return (
    <View style={styles.legendWrap}>
      <View style={styles.legend}>
        <TouchableOpacity 
          onPress={() => setShowColorLegend(!showColorLegend)}
          activeOpacity={0.8}
        >
          <View style={styles.legendHeader}>
            <View style={styles.legendTitleRow}>
              <Text style={styles.legendTitle}>
                {displayCount} restaurant{displayCount > 1 ? 's' : ''}
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
            
            {showRoute && routeDestination && (
              <View style={styles.routeActiveBadge}>
                <Text style={styles.routeActiveText}>
                  🧭 {routeDestination.name}
                </Text>
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
            
            <ColorLegendItem color="#e74c3c" label="Excellente (35%+)" />
            <ColorLegendItem color="#e67e22" label="Très bonne (30-34%)" />
            <ColorLegendItem color="#f39c12" label="Bonne (25-29%)" />
            <ColorLegendItem color="#f1c40f" label="Correcte (20-24%)" />
            <ColorLegendItem color="#3498db" label="Petite (1-19%)" />
            <ColorLegendItem color="#95a5a6" label="Aucune réduction" />
          </View>
        )}
      </View>
    </View>
  );
};

/**
 * Composant pour un élément de la légende des couleurs
 */
const ColorLegendItem = ({ color, label }) => (
  <View style={styles.colorLegendItem}>
    <View style={[styles.colorDot, { backgroundColor: color }]} />
    <Text style={styles.colorLegendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  legendWrap: { 
    position: 'absolute', 
    bottom: 24, 
    left: 16, 
    right: 80, 
    zIndex: 15 
  },
  legend: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 5,
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
  legendTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1a1a1a', 
    marginRight: 8 
  },
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
  routeActiveBadge: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  routeActiveText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  legendSub: { 
    fontSize: 11, 
    color: '#666', 
    fontStyle: 'italic' 
  },
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
});

export default MapLegend;