import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { AVAILABLE_CATEGORIES } from '../../../hooks/AddCategoryScreen/useCategoryForm';

/**
 * Composant pour sélectionner une catégorie
 */
const CategorySelector = ({
  finalCategoryName,
  showCategoryDropdown,
  setShowCategoryDropdown,
  showCategoryInput,
  customCategory,
  setCustomCategory,
  handleCategorySelect,
  handleAddCustomCategory,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>
        Select a Category <Text style={styles.required}>*</Text>
      </Text>
      
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
      >
        <Text style={[
          styles.dropdownButtonText,
          !finalCategoryName && styles.dropdownButtonPlaceholder
        ]}>
          {finalCategoryName || 'Choose a category...'}
        </Text>
        <Text style={styles.dropdownArrow}>
          {showCategoryDropdown ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {showCategoryDropdown && (
        <View style={styles.dropdown}>
          <ScrollView 
            style={styles.dropdownScroll}
            nestedScrollEnabled={true}
          >
            {AVAILABLE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.dropdownItem}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.dropdownItemText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {showCategoryInput && (
        <View style={styles.customInputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter a new category..."
            value={customCategory}
            onChangeText={setCustomCategory}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.customConfirmButton}
            onPress={handleAddCustomCategory}
          >
            <Text style={styles.customConfirmText}>✓</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
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
  dropdownButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
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
});

export default CategorySelector;