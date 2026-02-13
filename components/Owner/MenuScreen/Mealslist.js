import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

/**
 * Composant pour afficher la liste horizontale des meals
 */
const MealsList = ({ uniqueMeals, selectedMeal, onSelectMeal, navigation }) => {
  return (
    <View style={styles.categoriesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Meals</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {/* Bouton "All" */}
        <TouchableOpacity
          style={[
            styles.categoryCard,
            selectedMeal === 'All' && styles.categoryCardActive
          ]}
          onPress={() => onSelectMeal('All')}
        >
          <Text style={[
            styles.categoryName,
            selectedMeal === 'All' && styles.categoryNameActive
          ]}>
            Tous
          </Text>
        </TouchableOpacity>

        {/* Meals uniques du restaurant */}
        {uniqueMeals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={[
              styles.categoryCard,
              selectedMeal === meal.name && styles.categoryCardActive
            ]}
            onPress={() => onSelectMeal(meal.name)}
          >
            <Text style={[
              styles.categoryName,
              selectedMeal === meal.name && styles.categoryNameActive
            ]}>
              {meal.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesSection: {
    paddingTop: 20,
    paddingBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#5a2c1c',
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: '#d2d2d2',
    borderWidth: 0.3,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryCardActive: {
    backgroundColor: '#5a2c1c',
    borderColor: '#5a2c1c',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  categoryNameActive: {
    color: 'white',
  },
});

export default MealsList;