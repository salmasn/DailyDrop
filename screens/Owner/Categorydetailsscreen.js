import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';

// Hooks
import { useCategoryDetails } from '../../hooks/CategoryDetails/Usecategorydetails';
import { useDishForm } from '../../hooks/CategoryDetails/Usedishform';
import { useDishComponents } from '../../hooks/CategoryDetails/Usedishcomponents';
import { useDishTimeslots } from '../../hooks/CategoryDetails/Usedishtimeslots';
import { useSavedDishes } from '../../hooks/CategoryDetails/Usesaveddishes';
import { useExistingDishActions } from '../../hooks/CategoryDetails/Useexistingdishactions';

// Components
import CategoryHeader from '../../components/Categoryheader';
import AddDishButton from '../../components/Owner/CategoryDetailScreen/Adddishbutton';
import DishForm from '../../components/Owner/CategoryDetailScreen/DishForm';
import DishesList from '../../components/Owner/CategoryDetailScreen/DishesList';
import DishModal from '../../components/Owner/CategoryDetailScreen/DishModal';
import SubmitButton from '../../components/Owner/CategoryDetailScreen/SubmitButton';

/**
 * CategoryDetailsScreen Component
 * Écran pour afficher et gérer les plats d'une catégorie
 * Suit le principe SRP en déléguant la logique aux hooks et composants
 */
function CategoryDetailsScreen({ navigation, route }) {
  const { categoryId, category: passedCategory } = route.params;
  
  // Hook principal pour les données
  const {
    category,
    dishes,
    loading,
    refreshing,
    onRefresh,
    loadCategoryDetails,
    handleDeleteDish,
  } = useCategoryDetails(categoryId, passedCategory);

  // Hook pour le formulaire
  const formState = useDishForm();
  const {
    showAddForm,
    setShowAddForm,
    dishComponents,
    setDishComponents,
    timeslots,
    setTimeslots,
    resetForm,
    loadDishDataForEdit,
    getFormData,
    validateForm,
    editingDishId,
    editingExistingDishId,
  } = formState;

  // Hook pour les composants
  const componentsHandlers = useDishComponents(dishComponents, setDishComponents);

  // Hook pour les créneaux
  const timeslotsHandlers = useDishTimeslots(timeslots, setTimeslots);

  // Hook pour les plats en attente
  const {
    savedDishes,
    submitting: submittingSaved,
    addDishToList,
    editSavedDish,
    deleteSavedDish,
    submitAllDishes,
  } = useSavedDishes(categoryId, loadCategoryDetails);

  // Hook pour les plats existants
  const {
    submitting: submittingExisting,
    loadDishForEdit,
    updateExistingDish,
  } = useExistingDishActions(loadCategoryDetails);

  // État pour le modal
  const [selectedDish, setSelectedDish] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Gestionnaire d'ajout/modification de plat
  const handleAddOrUpdateDish = async () => {
    if (!validateForm()) return;

    const formData = getFormData();

    // Si on modifie un plat existant
    if (editingExistingDishId) {
      const success = await updateExistingDish(editingExistingDishId, formData);
      if (success) {
        resetForm();
        setShowAddForm(false);
      }
      return;
    }

    // Sinon, ajouter à la liste des plats en attente
    addDishToList(formData, editingDishId);
    resetForm();
    setShowAddForm(false);
  };

  // Gestionnaire d'édition d'un plat en attente
  const handleEditSavedDish = (dishId) => {
    const dish = editSavedDish(dishId);
    if (dish) {
      loadDishDataForEdit(dish, false);
    }
  };

  // Gestionnaire d'édition d'un plat existant
  const handleEditExistingDish = async (dishId) => {
    const dish = await loadDishForEdit(dishId);
    if (dish) {
      loadDishDataForEdit(dish, true);
    }
  };

  // Gestionnaire d'ouverture du modal
  const openDishModal = (dish) => {
    setSelectedDish(dish);
    setModalVisible(true);
  };

  // Gestionnaire de fermeture du modal
  const closeDishModal = () => {
    setModalVisible(false);
    setSelectedDish(null);
  };

  // Gestionnaire du bouton d'ajout
  const handleToggleForm = () => {
    if (showAddForm && !editingDishId && !editingExistingDishId) {
      resetForm();
      setShowAddForm(false);
    } else {
      setShowAddForm(true);
    }
  };

  // Affichage du loader pendant le chargement initial
  if (loading && !category.name) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Détails de la catégorie"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          backgroundColor="#5a2c1c"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5a2c1c" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const submitting = submittingSaved || submittingExisting;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5a2c1c"
          />
        }
      >
        {/* En-tête de la catégorie */}
        <CategoryHeader category={category} />

        {/* Bouton d'ajout de plat */}
        <AddDishButton
          onPress={handleToggleForm}
          showForm={showAddForm && !editingDishId && !editingExistingDishId}
          hasExistingDishes={dishes.length > 0 || savedDishes.length > 0}
        />

        {/* Formulaire d'ajout/modification */}
        {showAddForm && (
          <DishForm
            formState={formState}
            componentsHandlers={componentsHandlers}
            timeslotsHandlers={timeslotsHandlers}
            onSubmit={handleAddOrUpdateDish}
            onCancel={() => {
              resetForm();
              setShowAddForm(false);
            }}
            submitting={submitting}
          />
        )}

        {/* Plats en attente */}
        <DishesList
          title="Plats en attente"
          dishes={savedDishes}
          isPending={true}
          onDishPress={openDishModal}
          onEdit={handleEditSavedDish}
          onDelete={deleteSavedDish}
        />

        {/* Plats existants */}
        <DishesList
          title="Plats"
          dishes={dishes}
          isPending={false}
          onDishPress={openDishModal}
          onEdit={handleEditExistingDish}
          onDelete={handleDeleteDish}
        />

        {/* État vide */}
        {dishes.length === 0 && savedDishes.length === 0 && !showAddForm && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucun plat pour le moment</Text>
            <Text style={styles.emptyStateSubtext}>
              Commencez par ajouter votre premier plat à cette catégorie
            </Text>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bouton de soumission fixe */}
      <SubmitButton
        onPress={submitAllDishes}
        dishCount={savedDishes.length}
        submitting={submittingSaved}
      />

      {/* Modal de détails */}
      <DishModal
        visible={modalVisible}
        dish={selectedDish}
        onClose={closeDishModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#f8f9fa'},
  content: {flex: 1},
  loadingContainer: {flex: 1,justifyContent: 'center',alignItems: 'center'},
  loadingText: {marginTop: 10,color: '#5a2c1c',fontSize: 16},
  emptyState: {alignItems: 'center',padding: 40},
  emptyStateText: {fontSize: 16,fontWeight: '600',color: '#999',marginBottom: 8},
  emptyStateSubtext: {fontSize: 14,color: '#bbb',textAlign: 'center'},
  bottomSpace: {height: 100},
});

export default CategoryDetailsScreen;