import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export const MAP_STYLES = [
  { key: 'osm', label: 'Standard', icon: '📍', tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
  { key: 'satellite', label: 'Satellite', icon: '🛰️', tiles: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
  { key: 'topo', label: 'Topo', icon: '🗺️', tiles: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' },
];

/**
 * Composant TopBar - Barre supérieure avec contrôles de style de carte
 */
const TopBar = ({ navigation, mapType, onMapTypeChange, onFilterPress }) => {
  return (
    <View style={styles.topBar}>
      <View style={styles.styleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        {MAP_STYLES.map(style => {
          const active = mapType === style.key;
          return (
            <TouchableOpacity
              key={style.key}
              style={[styles.styleBtn, active && styles.styleBtnActive]}
              onPress={() => onMapTypeChange(style.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.styleBtnIcon}>{style.icon}</Text>
              <Text style={[styles.styleBtnLabel, active && styles.styleBtnLabelActive]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bouton Filtre */}
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={onFilterPress}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/Icons/filter.png')}
          resizeMode="contain"
          style={styles.filterIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 16,
  },
  styleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  backButton: { 
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    marginRight: 4,
  },
  backButtonText: { 
    fontSize: 20, 
    color: '#5a2c1c', 
    fontWeight: '600' 
  },
  styleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 5,
  },
  styleBtnActive: {
    backgroundColor: '#5a2c1c',
    borderColor: '#5a2c1c',
  },
  styleBtnIcon: { fontSize: 15 },
  styleBtnLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333' 
  },
  styleBtnLabelActive: { color: '#fff' },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: 50,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 5,
  },
  filterIcon: { 
    width: 40,
    height: 30, 
  },
});

export default TopBar;