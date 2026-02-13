import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import CategoryCard from './CategoryCard';

/**
 * Composant pour afficher la grille de catégories
 */
const CategoriesGrid = ({ 
  categories, 
  selectedMeal,
  onCategoryPress,
  onEditCategory,
  onDeleteCategory,
  onAddCategory,
}) => {
  if (categories.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          {selectedMeal === 'All' 
            ? 'Aucune catégorie trouvée' 
            : `Aucune catégorie pour "${selectedMeal}"`}
        </Text>
        <TouchableOpacity 
          style={styles.emptyStateButton}
          onPress={onAddCategory}
        >
          <Text style={styles.emptyStateButtonText}>Ajouter une catégorie</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.recipesSection}>
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          index={index}
          onPress={onCategoryPress}
          onEdit={onEditCategory}
          onDelete={onDeleteCategory}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  recipesSection: {
    paddingTop: 5,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#5a2c1c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CategoriesGrid;