import React from 'react';
import {
  StyleSheet,
  View,
  
  ScrollView,
  
  SafeAreaView,
  
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';
import MealsList from '../../components/Owner/MenuScreen/Mealslist';
import CategoriesHeader from '../../components/Owner/MenuScreen/CategoriesHeader';
import CategoriesGrid from '../../components/Owner/MenuScreen/CategoriesGrid';
import { useMenuScreen } from '../../hooks/MenuScreen/useMenuScreen';
import { useCategoryActions } from '../../hooks/MenuScreen/useCategory';


function MenuScreen({ navigation }) {
  // Hook principal pour la logique métier
  const {
    selectedMeal,
    setSelectedMeal,
    restaurantId,
    loading,
    refreshing,
    uniqueMeals,
    onRefresh,
    loadCategories,
    getFilteredCategories,
  } = useMenuScreen();

  // Hook pour les actions sur les catégories
  const {
    handleAddCategory,
    handleDeleteCategory,
    handleViewCategory,
    handleEditCategory,
  } = useCategoryActions(navigation, restaurantId, loadCategories);

  const filteredCategories = getFilteredCategories();

  // Affichage du loader pendant le chargement initial
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5a2c1c" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Bonjour, Chef!"
        subtitle="Gérez vos plats délicieux"
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
        showSearch={true}
        searchPlaceholder="Rechercher un plat..."
        backgroundColor="#5a2c1c"
      />

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
        {/* Liste des meals */}
        <MealsList
          uniqueMeals={uniqueMeals}
          selectedMeal={selectedMeal}
          onSelectMeal={setSelectedMeal}
          navigation={navigation}
        />

        {/* En-tête des catégories avec bouton d'ajout */}
        <CategoriesHeader
          count={filteredCategories.length}
          onAddPress={handleAddCategory}
        />

        {/* Grille des catégories */}
        <CategoriesGrid
          categories={filteredCategories}
          selectedMeal={selectedMeal}
          onCategoryPress={handleViewCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddCategory={handleAddCategory}
        />

        <View style={styles.bottomSpace} />
      </ScrollView>
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
  loadingText: {
    marginTop: 10,
    color: '#5a2c1c',
    fontSize: 16,
  
  },
  bottomSpace: {
    height: 40,
  },
});

export default MenuScreen;