import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  
  Alert,
  ActivityIndicator,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';

// Hooks
import { useAddCategory } from '../../hooks/AddCategoryScreen/useAddCategory';
import { useCategoryForm } from '../../hooks/AddCategoryScreen/useCategoryForm';
import { useMealSelection } from '../../hooks/AddCategoryScreen/useMealSelection';
import { useSavedCategories } from '../../hooks/AddCategoryScreen/useSavedCategories';

// Components
import CategorySelector from '../../components/Owner/AddCategoryScreen/CategorySelector';
import CategoryForm from '../../components/Owner/AddCategoryScreen/CategoryForm';
import SavedCategoriesList from '../../components/Owner/AddCategoryScreen/SavedCategoriesList';

/**
 * AddCategoryScreen Component
 * Écran pour ajouter des catégories de menu
 * Suit le principe SRP en déléguant la logique aux hooks et composants
 */
function AddCategoryScreen({ navigation, route }) {
  const [restaurantId, setRestaurantId] = React.useState(null);

  // Vérifier le restaurant ID
  useEffect(() => {
    if (route.params?.restaurantId) {
      console.log("Restaurant ID reçu:", route.params.restaurantId);
      setRestaurantId(route.params.restaurantId);
    } else {
      console.log("Aucun restaurant ID");
      Alert.alert("Erreur", "ID du restaurant non trouvé");
    }
  }, [route.params]);

  // Hook principal
  const { availableMeals, loading } = useAddCategory(restaurantId);

  // Hook du formulaire de catégorie
  const categoryFormState = useCategoryForm();
  const {
    getFinalCategoryName,
    getFormData,
    resetForm: resetCategoryForm,
    loadCategoryForEdit,
    editingCategoryId,
  } = categoryFormState;

  // Hook de sélection des meals
  const mealSelectionState = useMealSelection();
  const {
    selectedMeals,
    resetMealSelection,
    loadMealsForEdit,
  } = mealSelectionState;

  // Hook des catégories sauvegardées
  const {
    savedCategories,
    submitting,
    addCategory,
    editCategory,
    deleteCategory,
    submitAllCategories,
  } = useSavedCategories(restaurantId, navigation);

  // Gestionnaire d'ajout/modification de catégorie
  const handleAddCategory = () => {
    const categoryData = getFormData();
    const success = addCategory(categoryData, selectedMeals, editingCategoryId);
    
    if (success) {
      resetCategoryForm();
      resetMealSelection();
    }
  };

  // Gestionnaire d'édition de catégorie
  const handleEditCategory = (categoryId) => {
    const categoryToEdit = editCategory(categoryId);
    if (categoryToEdit) {
      loadCategoryForEdit(categoryToEdit);
      loadMealsForEdit(categoryToEdit.meals);
    }
  };

  // Gestionnaire de suppression
  const handleDeleteCategory = (categoryId) => {
    deleteCategory(categoryId);
    if (editingCategoryId === categoryId) {
      resetCategoryForm();
      resetMealSelection();
    }
  };

  const finalCategoryName = getFinalCategoryName();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Add Category"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          backgroundColor="#5a2c1c"
        />
        <View style={styles.loadingContainer}>
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
        {/* Sélecteur de catégorie */}
        <CategorySelector
          finalCategoryName={finalCategoryName}
          {...categoryFormState}
        />

        {/* Formulaire complet */}
        {finalCategoryName && (
          <CategoryForm
            availableMeals={availableMeals}
            mealSelectionState={mealSelectionState}
            categoryDescription={categoryFormState.categoryDescription}
            setCategoryDescription={categoryFormState.setCategoryDescription}
            categoryImage={categoryFormState.categoryImage}
            onSelectImage={categoryFormState.handleSelectCategoryImage}
            onConfirm={handleAddCategory}
            editingCategoryId={editingCategoryId}
          />
        )}

        {/* Liste des catégories sauvegardées */}
        <SavedCategoriesList
          categories={savedCategories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bouton de soumission fixe */}
      {savedCategories.length > 0 && (
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={submitAllCategories}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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