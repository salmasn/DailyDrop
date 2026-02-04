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
import { dishService, imageService } from '../../services/categoryService';

function AddDishScreen({ navigation, route }) {
  const { categoryId, categoryName } = route.params;

  // Form states
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [normalPrice, setNormalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [dishImage, setDishImage] = useState(null);

  // Timeslots (optional - can be added from another interface)
  const [hasTimeslots, setHasTimeslots] = useState(false);
  const [timeslots, setTimeslots] = useState([]);

  // State for multiple dishes
  const [savedDishes, setSavedDishes] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null);

  // Loading states
  const [submitting, setSubmitting] = useState(false);

  // Auto-calculate discount percentage
  useEffect(() => {
    if (normalPrice && discountedPrice) {
      const normal = parseFloat(normalPrice);
      const discounted = parseFloat(discountedPrice);
      if (normal > 0 && discounted < normal) {
        const percentage = Math.round(((normal - discounted) / normal) * 100);
        setDiscountPercentage(percentage.toString());
      }
    }
  }, [normalPrice, discountedPrice]);

  // Function to select dish image
  const handleSelectDishImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need your permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDishImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'An error occurred while selecting the image');
    }
  };

  // Handle add/update dish
  const handleAddDish = () => {
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return;
    }

    if (!normalPrice || parseFloat(normalPrice) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (editingDishId) {
      // Update existing dish
      setSavedDishes(savedDishes.map(dish => 
        dish.id === editingDishId 
          ? {
              ...dish,
              name: dishName.trim(),
              description: dishDescription.trim(),
              normalPrice: parseFloat(normalPrice),
              discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
              discountPercentage: discountPercentage ? parseInt(discountPercentage) : null,
              availableQuantity: availableQuantity ? parseInt(availableQuantity) : null,
              dishImage: dishImage,
              timeslots: hasTimeslots ? timeslots : [],
            }
          : dish
      ));
      setEditingDishId(null);
    } else {
      // Add new dish
      const newDish = {
        id: Date.now().toString(),
        name: dishName.trim(),
        description: dishDescription.trim(),
        normalPrice: parseFloat(normalPrice),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        discountPercentage: discountPercentage ? parseInt(discountPercentage) : null,
        availableQuantity: availableQuantity ? parseInt(availableQuantity) : null,
        dishImage: dishImage,
        timeslots: hasTimeslots ? timeslots : [],
      };
      setSavedDishes([...savedDishes, newDish]);
    }

    // Reset form
    resetForm();
  };

  // Handle final submit
  const handleSubmit = async () => {
    console.log("🚀 === DÉBUT HANDLESUBMIT DISHES ===");
    
    if (savedDishes.length === 0) {
      Alert.alert('Error', 'Please add at least one dish');
      return;
    }

    console.log("📊 Nombre de plats à soumettre:", savedDishes.length);
    console.log("🆔 Category ID:", categoryId);

    try {
      setSubmitting(true);

      const dishesToSubmit = await Promise.all(
        savedDishes.map(async (dish) => {
          let dishImageUrl = dish.dishImage;

          // Upload image if local
          if (dishImageUrl && dishImageUrl.startsWith('file://')) {
            try {
              console.log("📤 Upload de l'image pour:", dish.name);
              dishImageUrl = await imageService.uploadImage(dishImageUrl);
              console.log("✅ Image uploadée:", dishImageUrl);
            } catch (uploadError) {
              console.error('❌ Erreur upload image pour:', dish.name, uploadError);
              dishImageUrl = undefined;
            }
          }

          const dishPayload = {
            name: dish.name,
            normalPrice: dish.normalPrice,
          };

          if (dish.description) {
            dishPayload.description = dish.description;
          }

          if (dish.discountedPrice) {
            dishPayload.discountedPrice = dish.discountedPrice;
          }

          if (dish.discountPercentage) {
            dishPayload.discountPercentage = dish.discountPercentage;
          }

          if (dish.availableQuantity !== null && dish.availableQuantity !== undefined) {
            dishPayload.availableQuantity = dish.availableQuantity;
          }

          if (dishImageUrl) {
            dishPayload.imageUrl = dishImageUrl;
          }

          if (dish.timeslots && dish.timeslots.length > 0) {
            dishPayload.timeslots = dish.timeslots;
          }

          console.log("📦 Payload pour", dish.name, ":", dishPayload);
          return dishPayload;
        })
      );

      console.log("📤 Envoi de", dishesToSubmit.length, "plats au serveur");
      const result = await dishService.createManyDishes(categoryId, dishesToSubmit);
      console.log("✅ Réponse du serveur:", result);
      
      Alert.alert(
        'Success',
        `${savedDishes.length} dish${savedDishes.length > 1 ? 'es' : ''} added successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit dishes';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
      console.log("🏁 === FIN HANDLESUBMIT DISHES ===");
    }
  };

  // Function to reset form
  const resetForm = () => {
    setDishName('');
    setDishDescription('');
    setNormalPrice('');
    setDiscountedPrice('');
    setDiscountPercentage('');
    setAvailableQuantity('');
    setDishImage(null);
    setHasTimeslots(false);
    setTimeslots([]);
    setEditingDishId(null);
  };

  // Function to edit a saved dish
  const handleEditDish = (dishId) => {
    const dishToEdit = savedDishes.find(d => d.id === dishId);
    if (dishToEdit) {
      setDishName(dishToEdit.name);
      setDishDescription(dishToEdit.description);
      setNormalPrice(dishToEdit.normalPrice.toString());
      setDiscountedPrice(dishToEdit.discountedPrice?.toString() || '');
      setDiscountPercentage(dishToEdit.discountPercentage?.toString() || '');
      setAvailableQuantity(dishToEdit.availableQuantity?.toString() || '');
      setDishImage(dishToEdit.dishImage);
      setHasTimeslots(dishToEdit.timeslots && dishToEdit.timeslots.length > 0);
      setTimeslots(dishToEdit.timeslots || []);
      setEditingDishId(dishId);
    }
  };

  // Function to delete a saved dish
  const handleDeleteDish = (dishId) => {
    Alert.alert(
      'Delete Dish',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedDishes(savedDishes.filter(d => d.id !== dishId));
            if (editingDishId === dishId) {
              resetForm();
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Add Dishes"
        subtitle={categoryName}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backgroundColor="#5a2c1c"
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingDishId ? 'Edit Dish' : 'New Dish'}
          </Text>

          {/* Dish Name */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>
              Dish Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Margherita Pizza"
              value={dishName}
              onChangeText={setDishName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Description */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the dish..."
              value={dishDescription}
              onChangeText={setDishDescription}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Prices Row */}
          <View style={styles.rowSection}>
            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.formLabel}>
                Price <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={normalPrice}
                onChangeText={setNormalPrice}
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.formLabel}>Discounted Price</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={discountedPrice}
                onChangeText={setDiscountedPrice}
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Discount & Quantity Row */}
          <View style={styles.rowSection}>
            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.formLabel}>Discount %</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                placeholder="Auto"
                value={discountPercentage}
                editable={false}
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.formLabel}>Available Qty</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={availableQuantity}
                onChangeText={setAvailableQuantity}
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Dish Image */}
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Dish Image</Text>
            <TouchableOpacity 
              style={styles.imageUploadButton}
              onPress={handleSelectDishImage}
            >
              {dishImage ? (
                <View style={styles.imagePreview}>
                  <Image 
                    source={{ uri: dishImage }} 
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

          {/* Timeslots Toggle (Optional - for future implementation) */}
          <View style={styles.formSection}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setHasTimeslots(!hasTimeslots)}
            >
              <Text style={styles.toggleLabel}>Add Timeslots (Optional)</Text>
              <View style={[styles.toggleSwitch, hasTimeslots && styles.toggleSwitchActive]}>
                <View style={[styles.toggleThumb, hasTimeslots && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
            {hasTimeslots && (
              <Text style={styles.infoText}>
                Note: Timeslot configuration can be added from the dish management interface
              </Text>
            )}
          </View>

          {/* Add/Update Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleAddDish}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>
              {editingDishId ? 'Update Dish' : 'Add Dish'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Saved Dishes List */}
        {savedDishes.map((dish) => (
          <View key={dish.id} style={styles.dishCard}>
            <View style={styles.dishContent}>
              <View style={styles.dishImageContainer}>
                {dish.dishImage ? (
                  <Image 
                    source={{ uri: dish.dishImage }} 
                    style={styles.dishImage}
                  />
                ) : (
                  <View style={styles.dishImagePlaceholder}>
                    <Text style={styles.dishImagePlaceholderText}>
                      {dish.name.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.dishTextContainer}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <View style={styles.priceRow}>
                  {dish.discountedPrice ? (
                    <>
                      <Text style={styles.normalPrice}>{dish.normalPrice} DH</Text>
                      <Text style={styles.discountedPrice}>{dish.discountedPrice} DH</Text>
                      {dish.discountPercentage && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountBadgeText}>-{dish.discountPercentage}%</Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <Text style={styles.singlePrice}>{dish.normalPrice} DH</Text>
                  )}
                </View>
                {dish.availableQuantity !== null && (
                  <Text style={styles.quantity}>Qty: {dish.availableQuantity}</Text>
                )}
              </View>
              <View style={styles.dishActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditDish(dish.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteDish(dish.id)}
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
      {savedDishes.length > 0 && (
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
                Submit All Dishes ({savedDishes.length})
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
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 16,
  },
  rowSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
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
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  textArea: {
    height: 80,
    paddingTop: 14,
  },
  imageUploadButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    width: 30,
    height: 30,
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
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#5a2c1c',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
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
  dishCard: {
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
  dishContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishImageContainer: {
    marginRight: 12,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  dishImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishImagePlaceholderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dishTextContainer: {
    flex: 1,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  normalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },
  singlePrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },
  discountBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  quantity: {
    fontSize: 12,
    color: '#666',
  },
  dishActions: {
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

export default AddDishScreen;