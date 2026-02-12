import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Composant MapControls - Contrôles de navigation de la carte
 */
const MapControls = ({
  isSelectingLocation,
  showRoute,
  onToggleLocationSelection,
  onGetCurrentLocation,
  onCenterOnLocation,
  onClearRoute,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <View style={styles.controls}>
      {/* Bouton sélection manuelle */}
      <TouchableOpacity 
        style={[styles.ctrlBtn, isSelectingLocation && styles.ctrlBtnActive]} 
        onPress={onToggleLocationSelection}
      >
        <Text style={styles.ctrlIcon}>{isSelectingLocation ? '✖' : '📌'}</Text>
      </TouchableOpacity>

      {/* Bouton GPS */}
      <TouchableOpacity style={styles.ctrlBtn} onPress={onGetCurrentLocation}>
        <Text style={styles.ctrlIcon}>🎯</Text>
      </TouchableOpacity>

      {/* Bouton centrer */}
      <TouchableOpacity style={styles.ctrlBtn} onPress={onCenterOnLocation}>
        <Text style={styles.ctrlIcon}>📍</Text>
      </TouchableOpacity>

      {/* Bouton effacer itinéraire */}
      {showRoute && (
        <TouchableOpacity 
          style={[styles.ctrlBtn, styles.ctrlBtnClear]} 
          onPress={onClearRoute}
        >
          <Text style={styles.ctrlIcon}>🗑️</Text>
        </TouchableOpacity>
      )}

      {/* Contrôles de zoom */}
      <View style={styles.zoomWrap}>
        <TouchableOpacity style={styles.zoomBtn} onPress={onZoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <View style={styles.zoomDiv} />
        <TouchableOpacity style={styles.zoomBtn} onPress={onZoomOut}>
          <Text style={styles.zoomText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: { 
    position: 'absolute', 
    right: 16, 
    bottom: 180, 
    gap: 12, 
    zIndex: 15 
  },
  ctrlBtn: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ctrlBtnActive: {
    backgroundColor: '#f39c12',
  },
  ctrlBtnClear: {
    backgroundColor: '#e74c3c',
  },
  ctrlIcon: { fontSize: 22 },
  zoomWrap: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  zoomBtn: { 
    width: 48, 
    height: 44, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  zoomText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  zoomDiv: { 
    height: 1, 
    backgroundColor: '#e0e0e0' 
  },
});

export default MapControls;