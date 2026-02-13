import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';

/**
 * Composant pour sélectionner les meals
 */
const MealSelector = ({
  availableMeals,
  selectedMeals,
  showMealDropdown,
  setShowMealDropdown,
  showMealInput,
  customMeal,
  setCustomMeal,
  handleMealSelect,
  handleAddCustomMeal,
  handleRemoveMeal,
}) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.formLabel}>
        Associate with Meals <Text style={styles.required}>*</Text>
      </Text>
      
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowMealDropdown(!showMealDropdown)}
      >
        <Text style={styles.dropdownButtonPlaceholder}>
          Add a meal...
        </Text>
        <Text style={styles.dropdownArrow}>
          {showMealDropdown ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {showMealDropdown && (
        <View style={styles.dropdown}>
          <ScrollView 
            style={styles.dropdownScroll}
            nestedScrollEnabled={true}
          >
            {availableMeals.map((meal) => (
              <TouchableOpacity
                key={meal.id}
                style={styles.dropdownItem}
                onPress={() => handleMealSelect(meal)}
              >
                <Text style={styles.dropdownItemText}>{meal.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleMealSelect({ name: 'Other' })}
            >
              <Text style={styles.dropdownItemText}>Other</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {showMealInput && (
        <View style={styles.customInputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter a new meal..."
            value={customMeal}
            onChangeText={setCustomMeal}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.customConfirmButton}
            onPress={handleAddCustomMeal}
          >
            <Text style={styles.customConfirmText}>✓</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedMeals.length > 0 && (
        <View style={styles.selectedMealsContainer}>
          {selectedMeals.map((meal) => (
            <View key={meal.id} style={styles.mealChip}>
              <Text style={styles.mealChipText}>{meal.name}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveMeal(meal.id)}
                style={styles.mealChipRemove}
              >
                <Text style={styles.mealChipRemoveText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  required: {
    color: '#e74c3c',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownButtonPlaceholder: {
    color: '#999',
    fontSize: 15,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  customInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  customConfirmButton: {
    backgroundColor: '#5a2c1c',
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customConfirmText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectedMealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  mealChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5a2c1c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  mealChipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mealChipRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealChipRemoveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MealSelector;