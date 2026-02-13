import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

/**
 * Composant pour le bouton de soumission fixe en bas
 */
const SubmitButton = ({ onPress, dishCount, submitting }) => {
  if (dishCount === 0) return null;

  return (
    <View style={styles.submitContainer}>
      <TouchableOpacity
        style={[styles.submitButton, submitting && { opacity: 0.6 }]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            Soumettre tous les plats ({dishCount})
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubmitButton;