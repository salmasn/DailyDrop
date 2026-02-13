import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';

// Hooks
import { useDishForm } from '../../hooks/AddDishScreen/useDishForm';
import { useSavedDishes } from '../../hooks/AddDishScreen/useSavedDishes';

// Components
import DishFormFields from '../../components/Owner/AddDishScreen/DishFormFields';
import SavedDishCard from '../../components/Owner/AddDishScreen/SavedDishCard';

/**
 * AddDishScreen Component
 * Écran pour ajouter des plats à une catégorie
 * Suit le principe SRP en déléguant la logique aux hooks et composants
 */
function AddDishScreen({ navigation, route }) {
  const { categoryId, categoryName } = route.params;

  // Hook du formulaire
  const formState = useDishForm();
  const {
    validateForm,
    getFormData,
    resetForm,
    loadDishForEdit,
    editingDishId,
  } = formState;

  // Hook des plats sauvegardés
  const {
    savedDishes,
    submitting,
    addDish,
    editDish,
    deleteDish,
    submitAllDishes,
  } = useSavedDishes(categoryId, navigation);

  // Gestionnaire d'ajout/modification de plat
  const handleAddDish = () => {
    if (!validateForm()) return;

    const dishData = getFormData();
    addDish(dishData, editingDishId);
    resetForm();
  };

  // Gestionnaire d'édition
  const handleEditDish = (dishId) => {
    const dishToEdit = editDish(dishId);
    if (dishToEdit) {
      loadDishForEdit(dishToEdit);
    }
  };

  // Gestionnaire de suppression
  const handleDeleteDish = (dishId) => {
    deleteDish(dishId);
    if (editingDishId === dishId) {
      resetForm();
    }
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

          {/* Champs du formulaire */}
          <DishFormFields {...formState} />

          {/* Bouton Add/Update */}
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

        {/* Liste des plats sauvegardés */}
        {savedDishes.map((dish) => (
          <SavedDishCard
            key={dish.id}
            dish={dish}
            onEdit={handleEditDish}
            onDelete={handleDeleteDish}
          />
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bouton de soumission fixe */}
      {savedDishes.length > 0 && (
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={submitAllDishes}
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