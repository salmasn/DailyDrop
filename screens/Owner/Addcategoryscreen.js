import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';
import * as ImagePicker from 'expo-image-picker';
import { mealService, categoryService, imageService } from '../../services/categoryService';

function AddCategoryScreen({ navigation, route }) {
  // Complete list of available categories
  const availableCategories = [
    'Pizza', 'Burger', 'Tacos', 'Pastry', 'Sandwich', 'Salad',
    'Pasta', 'Meat', 'Fish', 'Vegetarian', 'Fast Food', 'Traditional',
    'Oriental', 'Asian', 'Sweet', 'Savory', 'Beverages', 'Dessert',
    'Pastries', 'Grilled', 'Wraps', 'Sushi', 'Crepes', 'Ice Cream',
    'Smoothies', 'Other'
  ];

  // Main states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Form states
  const [availableMeals, setAvailableMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMealName, setSelectedMealName] = useState('');
  const [showMealDropdown, setShowMealDropdown] = useState(false);
  const [showMealInput, setShowMealInput] = useState(false);
  const [customMeal, setCustomMeal] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
 
  // State for multiple categories
  const [savedCategories, setSavedCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load meals and restaurant ID on mount
  useEffect(() => {
    loadMeals();
    
    if (route.params && route.params.restaurantId) {
      console.log("✅ Restaurant ID reçu:", route.params.restaurantId);
      setRestaurantId(route.params.restaurantId);
    } else {
      console.log("❌ Aucun restaurant ID");
      Alert.alert("Erreur", "ID du restaurant non trouvé");
    }
  }, [route.params]);

  const loadMeals = async () => {
    try {
      setLoading(true);
      console.log("📱 Chargement des meals...");
      const meals = await mealService.getAllMeals();
      console.log("✅ Meals chargés:", meals);
      setAvailableMeals(meals);
    } catch (error) {
      console.error('❌ Erreur chargement meals:', error);
      Alert.alert('Erreur', 'Impossible de charger les repas');
    } finally {
      setLoading(false);
    }
  };

  // Category selection handling
  const handleCategorySelect = (category) => {
    if (category === 'Other') {
      setShowCategoryInput(true);
      setShowCategoryDropdown(false);
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
      setShowCategoryDropdown(false);
      setShowCategoryInput(false);
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setSelectedCategory(customCategory.trim());
      setShowCategoryInput(false);
    }
  };

  // Meal selection handling
  const handleMealSelect = (meal) => {
    if (meal.name === 'Other') {
      setShowMealInput(true);
      setShowMealDropdown(false);
      setSelectedMeal(null);
      setSelectedMealName('');
    } else {
      setSelectedMeal(meal);
      setSelectedMealName(meal.name);
      setShowMealDropdown(false);
      setShowMealInput(false);
    }
  };

  const handleAddCustomMeal = () => {
    if (customMeal.trim()) {
      setSelectedMealName(customMeal.trim());
      setShowMealInput(false);
    }
  };


  // Function to select category image
  const handleSelectCategoryImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need your permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCategoryImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'An error occurred while selecting the image');
    }
  };

  // Handle add/update category
  const handleAddCategory = () => {
    const finalMeal = selectedMealName || customMeal;
    const finalCategory = selectedCategory || customCategory;
    
    if (!finalMeal || !finalCategory) {
      Alert.alert('Error', 'Please complete the required fields');
      return;
    }

    if (editingCategoryId) {
      // Update existing category
      setSavedCategories(savedCategories.map(cat => 
        cat.id === editingCategoryId 
          ? {
              ...cat,
              name: finalCategory,
              meal: finalMeal,
              mealId: selectedMeal?.id,
              description: categoryDescription,
              categoryImage: categoryImage,
            }
          : cat
      ));
      setEditingCategoryId(null);
    } else {
      // Add new category
      const newCategory = {
        id: Date.now().toString(),
        name: finalCategory,
        meal: finalMeal,
        mealId: selectedMeal?.id,
        description: categoryDescription,
        categoryImage: categoryImage,
      };
      setSavedCategories([...savedCategories, newCategory]);
    }

    // Reset form
    resetForm();
  };

  // Handle final submit
const handleSubmit = async () => {
  console.log("🚀 === DÉBUT HANDLESUBMIT ===");
  
  if (savedCategories.length === 0) {
    Alert.alert('Error', 'Please add at least one category');
    return;
  }

  if (!restaurantId) {
    console.log("❌ Restaurant ID manquant");
    Alert.alert('Error', 'Restaurant ID not found. Please go back and try again.');
    return;
  }

  console.log("📊 Nombre de catégories à soumettre:", savedCategories.length);
  console.log("🆔 Restaurant ID:", restaurantId);

  try {
    setSubmitting(true);

    const categoriesToSubmit = await Promise.all(
      savedCategories.map(async (category) => {
        let categoryImageUrl = category.categoryImage;

        // Si l'image est locale (commence par file://), l'uploader
        if (categoryImageUrl && categoryImageUrl.startsWith('file://')) {
          try {
            console.log("📤 Upload de l'image pour:", category.name);
            console.log("📂 Image URI:", categoryImageUrl);
            
            // Upload directement l'URI (la conversion en base64 se fait dans imageService)
            categoryImageUrl = await imageService.uploadImage(categoryImageUrl);
            
            console.log("✅ Image uploadée:", categoryImageUrl);
          } catch (uploadError) {
            console.error('❌ Erreur upload image pour:', category.name, uploadError);
            console.error('❌ Error details:', uploadError.response?.data || uploadError.message);
            categoryImageUrl = undefined;
          }
        }

        const categoryPayload = {
          name: category.name,
          mealName: category.meal,
        };

        if (category.description && category.description.trim()) {
          categoryPayload.description = category.description;
        }

        if (categoryImageUrl) {
          categoryPayload.imageUrl = categoryImageUrl;
        }

        console.log("📦 Payload pour", category.name, ":", categoryPayload);
        return categoryPayload;
      })
    );

    console.log("📤 Envoi de", categoriesToSubmit.length, "catégories au serveur");
    const result = await categoryService.createManyCategories(restaurantId, categoriesToSubmit);
    console.log("✅ Réponse du serveur:", result);
    
    Alert.alert(
      'Success',
      `${savedCategories.length} categor${savedCategories.length > 1 ? 'ies' : 'y'} added successfully!`,
      [
        {
          text: 'Finish',
          onPress: () => navigation.navigate('OwnerHome')
        }
      ]
    );
  } catch (error) {
    console.error('❌ Erreur soumission:', error);
    console.error('❌ Error response:', error.response?.data);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to submit categories';
    Alert.alert('Error', errorMessage);
  } finally {
    setSubmitting(false);
    console.log("🏁 === FIN HANDLESUBMIT ===");
  }
};

  // Function to reset form
  const resetForm = () => {
    setSelectedCategory('');
    setCustomCategory('');
    setSelectedMeal(null);
    setSelectedMealName('');
    setCustomMeal('');
    setCategoryDescription('');
    setCategoryImage(null);
    setShowCategoryDropdown(false);
    setShowCategoryInput(false);
    setShowMealDropdown(false);
    setShowMealInput(false);
    setEditingCategoryId(null);
  };

  // Function to edit a saved category
  const handleEditCategory = (categoryId) => {
    const categoryToEdit = savedCategories.find(cat => cat.id === categoryId);
    if (categoryToEdit) {
      setSelectedCategory(categoryToEdit.name);
      setSelectedMealName(categoryToEdit.meal);
      setSelectedMeal(availableMeals.find(m => m.id === categoryToEdit.mealId));
      setCategoryDescription(categoryToEdit.description);
      setCategoryImage(categoryToEdit.categoryImage);
      setEditingCategoryId(categoryId);
    }
  };

  // Function to delete a saved category
  const handleDeleteCategory = (categoryId) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedCategories(savedCategories.filter(cat => cat.id !== categoryId));
            if (editingCategoryId === categoryId) {
              resetForm();
            }
          }
        }
      ]
    );
  };

  const finalCategoryName = selectedCategory || customCategory;
  const finalMealName = selectedMealName || customMeal;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Add Category"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          backgroundColor="#5a2c1c"
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5a2c1c" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Add Category"
        subtitle="Organize your menu"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backgroundColor="#5a2c1c"
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Selection */}
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
                {availableCategories.map((category) => (
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

        {/* Full form - Displayed after category selection */}
        {finalCategoryName && (
          <View style={styles.formCard}>
            {/* Meal Selection */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>
                Associate with a Meal <Text style={styles.required}>*</Text>
              </Text>
              
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowMealDropdown(!showMealDropdown)}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  !finalMealName && styles.dropdownButtonPlaceholder
                ]}>
                  {finalMealName || 'Choose a meal...'}
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
            </View>

             {/* Picture of Category */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Picture of Category</Text>
              <TouchableOpacity 
                style={styles.imageUploadButton}
                onPress={handleSelectCategoryImage}
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
                      source={require('../../assets/Icons/add.png')}
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
              onPress={handleAddCategory}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>
                {editingCategoryId ? 'Update Category' : 'Add Category'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Saved Categories List */}
        {savedCategories.map((category) => (
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
                <Text style={styles.categoryMeal}>{category.meal}</Text>
              </View>
              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Fixed Submit Button */}
      {savedCategories.length > 0 && (
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                Submit All Categories ({savedCategories.length})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
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
  bottomSpace: {
    height: 100,
  },
  submitContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#5a2c1c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#5a2c1c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCategoryScreen;