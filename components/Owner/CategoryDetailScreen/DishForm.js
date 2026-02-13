import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import ComponentsInput from './ComponentsInput';
import TimeslotsInput from './TimeslotsInput';
import ImageUpload from './ImageUpload';

/**
 * Composant du formulaire principal pour ajouter/modifier un plat
 */
const DishForm = ({ 
  formState, 
  componentsHandlers,
  timeslotsHandlers,
  onSubmit, 
  onCancel,
  submitting 
}) => {
  const { 
    dishName, setDishName,
    dishDescription, setDishDescription,
    normalPrice, setNormalPrice,
    discountedPrice, setDiscountedPrice,
    availableQuantity, setAvailableQuantity,
    dishImage,
    dishComponents,
    timeslots,
    editingExistingDishId,
    editingDishId,
    handleSelectDishImage
  } = formState;

  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>
        {editingExistingDishId 
          ? 'Modifier le plat existant' 
          : (editingDishId ? 'Modifier le plat' : 'Nouveau plat')}
      </Text>

      {/* Nom du plat */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          Nom du plat <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Pizza Margherita"
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
          placeholder="Décrivez le plat..."
          value={dishDescription}
          onChangeText={setDishDescription}
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Prix */}
      <View style={styles.rowSection}>
        <View style={[styles.formSection, { flex: 1 }]}>
          <Text style={styles.formLabel}>
            Prix normal <Text style={styles.required}>*</Text>
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
          <Text style={styles.formLabel}>Prix réduit</Text>
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

      {/* Quantité disponible */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Quantité disponible</Text>
        <TextInput
          style={styles.input}
          placeholder="10"
          value={availableQuantity}
          onChangeText={setAvailableQuantity}
          placeholderTextColor="#999"
          keyboardType="number-pad"
        />
      </View>

      {/* Composants */}
      <ComponentsInput 
        dishComponents={dishComponents}
        {...componentsHandlers}
      />

      {/* Créneaux horaires */}
      <TimeslotsInput 
        timeslots={timeslots}
        {...timeslotsHandlers}
      />

      {/* Image */}
      <ImageUpload 
        dishImage={dishImage}
        onSelectImage={handleSelectDishImage}
      />

      {/* Boutons d'action */}
      <TouchableOpacity
        style={[styles.confirmButton, submitting && { opacity: 0.6 }]}
        onPress={onSubmit}
        activeOpacity={0.8}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.confirmButtonText}>
            {editingExistingDishId 
              ? 'Enregistrer les modifications' 
              : (editingDishId ? 'Confirmer la modification' : 'Confirmer l\'ajout')}
          </Text>
        )}
      </TouchableOpacity>

      {(editingDishId || editingExistingDishId) && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#ff6b35',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  rowSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#5a2c1c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DishForm;