import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

/**
 * Composant pour le bouton d'ajout de plat
 */
const AddDishButton = ({ onPress, showForm, hasExistingDishes }) => {
  return (
    <View style={styles.addDishSection}>
      <TouchableOpacity 
        style={styles.addDishButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../../assets/Icons/add.png')}
          style={styles.addDishIcon}
          resizeMode="contain"
        />
        <Text style={styles.addDishButtonText}>
          {showForm 
            ? 'Masquer le formulaire' 
            : (hasExistingDishes ? 'Ajouter un autre plat' : 'Ajouter le premier plat')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addDishSection: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  addDishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a2c1c',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addDishIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#fff',
  },
  addDishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddDishButton;