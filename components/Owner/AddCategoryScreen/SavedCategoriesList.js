import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

/**
 * Composant pour afficher la liste des catégories sauvegardées
 */
const SavedCategoriesList = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) return null;

  return (
    <>
      {categories.map((category) => (
        <View key={category.id} style={styles.categoryCard}>
          <View style={styles.categoryContent}>
            <View style={styles.categoryImageContainer}>
              {category.categoryImage ? (
                <Image 
                  source={{ uri: category.categoryImage }} 
                  style={styles.categoryImage}
                />
              ) : (
                <View style={styles.categoryImagePlaceholder}>
                  <Text style={styles.categoryImagePlaceholderText}>
                    {category.name.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={styles.categoryMealsContainer}>
                {category.meals.map((meal, index) => (
                  <Text key={meal.id} style={styles.categoryMeal}>
                    {meal.name}{index < category.meals.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.categoryActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => onEdit(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryImageContainer: {
    marginRight: 12,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  categoryImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImagePlaceholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryMealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryMeal: {
    fontSize: 13,
    color: '#666',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    color: '#5a2c1c',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});

export default SavedCategoriesList;