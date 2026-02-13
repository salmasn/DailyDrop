import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

/**
 * Composant pour afficher l'en-tête des catégories avec le bouton d'ajout
 */
const CategoriesHeader = ({ count, onAddPress }) => {
  return (
    <View style={styles.dishesHeader}>
      <View style={styles.dishesHeaderLeft}>
        <Text style={styles.dishesTitle}>Mes Catégories</Text>
        <Text style={styles.dishesCount}>{count} catégorie(s)</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={onAddPress}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../../assets/Icons/add.png')}
          style={styles.addIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dishesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  dishesHeaderLeft: {
    flex: 1,
  },
  dishesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dishesCount: {
    fontSize: 13,
    color: '#666',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5a2c1c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default CategoriesHeader;