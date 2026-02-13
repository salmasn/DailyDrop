import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

/**
 * Composant pour afficher les champs du formulaire de plat
 */
const DishFormFields = ({
  dishName,
  setDishName,
  dishDescription,
  setDishDescription,
  normalPrice,
  setNormalPrice,
  discountedPrice,
  setDiscountedPrice,
  discountPercentage,
  availableQuantity,
  setAvailableQuantity,
  dishImage,
  onSelectImage,
  hasTimeslots,
  setHasTimeslots,
}) => {
  return (
    <>
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
          onPress={onSelectImage}
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
                source={require('../../../assets/Icons/add.png')}
                style={styles.uploadIcon}
                resizeMode="contain"
              />
              <Text style={styles.uploadText}>Add an image</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Timeslots Toggle */}
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
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default DishFormFields;