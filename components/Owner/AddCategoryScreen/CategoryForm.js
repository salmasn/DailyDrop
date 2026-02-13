import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import MealSelector from './MealSelector';

/**
 * Composant du formulaire complet de catégorie
 */
const CategoryForm = ({
  availableMeals,
  mealSelectionState,
  categoryDescription,
  setCategoryDescription,
  categoryImage,
  onSelectImage,
  onConfirm,
  editingCategoryId,
}) => {
  return (
    <View style={styles.formCard}>
      {/* Meal Selection */}
      <MealSelector
        availableMeals={availableMeals}
        {...mealSelectionState}
      />

      {/* Picture of Category */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Picture of Category</Text>
        <TouchableOpacity 
          style={styles.imageUploadButton}
          onPress={onSelectImage}
        >
          {categoryImage ? (
            <View style={styles.imagePreview}>
              <Image 
                source={{ uri: categoryImage }} 
                style={styles.uploadedImage}
              />
            </View>
          ) : (
            <>
              <Image
                source={require('../../../assets/Icons/add.png')}
                style={styles.uploadIcon}
                resizeMode="contain"
              />
              <Text style={styles.uploadText}>Add an image</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the type of dishes offered..."
          value={categoryDescription}
          onChangeText={setCategoryDescription}
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Add/Update Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={onConfirm}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>
          {editingCategoryId ? 'Update Category' : 'Add Category'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
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
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  imageUploadButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    width: 35,
    height: 35,
    tintColor: '#999',
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  confirmButton: {
    backgroundColor: '#5a2c1c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#5a2c1c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CategoryForm;