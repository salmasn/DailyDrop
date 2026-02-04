import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';

// Importation des services
import storageService from '../../services/storageService';
import restaurantService from '../../services/restaurantService';
import { categoryService } from '../../services/categoryService';

// Fonction pour décoder le JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error);
    return null;
  }
};

function MenuScreen({ navigation }) {
  const [selectedMeal, setSelectedMeal] = useState('All');
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // États pour les données du restaurant
  const [categories, setCategories] = useState([]);
  const [uniqueMeals, setUniqueMeals] = useState([]);

  // Récupération automatique du restaurant_id et des données au montage du composant
  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    console.log("🚀 === DÉBUT FETCHRESTAURANTDATA ===");
    try {
      setLoading(true);
      
      // 1. Récupérer le token JWT
      const token = await storageService.getToken();
      if (!token) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      // 2. Décoder le token pour obtenir le user_id
      const decodedToken = decodeJWT(token);
      const userId = decodedToken?.id || decodedToken?.userId || decodedToken?.sub || decodedToken?.user_id;
      
      if (!userId) {
        Alert.alert("Erreur", "Token invalide. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      // 3. Récupérer le restaurant de l'utilisateur
      const restaurants = await restaurantService.findByUserId(userId);
      
      if (restaurants && restaurants.length > 0) {
        const firstRestaurant = restaurants[0];
        setRestaurantId(firstRestaurant.id);
        console.log("✅ Restaurant ID:", firstRestaurant.id);

        // 4. Charger les catégories du restaurant
        await loadCategories(firstRestaurant.id);
      } else {
        Alert.alert("Information", "Aucun restaurant associé à votre compte.");
      }
    } catch (error) {
      console.error('❌ Erreur dans fetchRestaurantData:', error);
      Alert.alert("Erreur", "Impossible de charger les informations du restaurant.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (restId) => {
    try {
      console.log("📱 Chargement des catégories pour restaurant:", restId);
      const categoriesData = await categoryService.getCategoriesByRestaurant(restId);
      console.log("✅ Catégories chargées:", categoriesData);
      
      setCategories(categoriesData);

      // Extraire les meals uniques des catégories
      const mealsMap = new Map();
      categoriesData.forEach(category => {
        if (category.meal && !mealsMap.has(category.meal.id)) {
          mealsMap.set(category.meal.id, {
            id: category.meal.id,
            name: category.meal.name,
          });
        }
      });
      
      const uniqueMealsArray = Array.from(mealsMap.values());
      console.log("✅ Meals uniques extraits:", uniqueMealsArray);
      setUniqueMeals(uniqueMealsArray);
      
    } catch (error) {
      console.error('❌ Erreur chargement catégories:', error);
      Alert.alert('Erreur', 'Impossible de charger les catégories.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (restaurantId) {
      await loadCategories(restaurantId);
    }
    setRefreshing(false);
  };

  const handleAddDish = () => {
    if (!restaurantId) {
      Alert.alert(
        "Action impossible", 
        "L'ID du restaurant n'a pas été trouvé. Veuillez patienter ou redémarrer l'application."
      );
      return;
    }
    navigation.navigate('AddCategoryScreen', { restaurantId: restaurantId });
  };

  const handleDeleteCategory = async (categoryId) => {
    Alert.alert(
      'Supprimer la catégorie',
      'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await categoryService.deleteCategory(categoryId);
              Alert.alert('Succès', 'Catégorie supprimée avec succès');
              if (restaurantId) {
                await loadCategories(restaurantId);
              }
            } catch (error) {
              console.error('❌ Erreur suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la catégorie');
            }
          }
        }
      ]
    );
  };

  // Filtrer les catégories par meal sélectionné
  const filteredCategories = selectedMeal === 'All' 
    ? categories 
    : categories.filter(cat => cat.meal?.name === selectedMeal);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#5a2c1c" />
          <Text style={{ marginTop: 10, color: '#5a2c1c' }}>Chargement...</Text>
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
        {/* Meals Section */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MealsCategories')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {/* Bouton "All" */}
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedMeal === 'All' && styles.categoryCardActive
              ]}
              onPress={() => setSelectedMeal('All')}
            >
              <Text style={[
                styles.categoryName,
                selectedMeal === 'All' && styles.categoryNameActive
              ]}>
                Tous
              </Text>
            </TouchableOpacity>

            {/* Meals uniques du restaurant */}
            {uniqueMeals.map((meal) => (
              <TouchableOpacity
                key={meal.id}
                style={[
                  styles.categoryCard,
                  selectedMeal === meal.name && styles.categoryCardActive
                ]}
                onPress={() => setSelectedMeal(meal.name)}
              >
                <Text style={[
                  styles.categoryName,
                  selectedMeal === meal.name && styles.categoryNameActive
                ]}>
                  {meal.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Header avec bouton Ajouter */}
        <View style={styles.dishesHeader}>
          <View style={styles.dishesHeaderLeft}>
            <Text style={styles.dishesTitle}>Mes Catégories</Text>
            <Text style={styles.dishesCount}>{filteredCategories.length} catégorie(s)</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddDish}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/Icons/add.png')}
              style={styles.addIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Categories Grid - Design inspiré de l'image */}
        <View style={styles.recipesSection}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => {
              // Couleurs différentes pour chaque meal
              const mealColors = [
                '#FF6B6B', // Rouge corail
                '#4ECDC4', // Turquoise
                '#FFD93D', // Jaune
                '#95E1D3', // Vert menthe
                '#F38181', // Rose saumon
                '#AA96DA', // Violet
                '#FCBAD3', // Rose
                '#A8D8EA', // Bleu ciel
              ];
              const mealColor = mealColors[index % mealColors.length];

              return (
                <TouchableOpacity 
                  key={category.id}
                  style={styles.categoryCompactCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('CategoryDetails', { categoryId: category.id })}
                >
                  {/* Image de fond */}
                  {category.imageUrl ? (
                    <Image
                      source={{ uri: category.imageUrl }}
                      style={styles.categoryFullImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.categoryFullImagePlaceholder}>
                      <Text style={styles.categoryFullImagePlaceholderText}>
                        {category.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  {/* Overlay gradient léger */}
                  <View style={styles.categoryOverlayGradient} />

                  {/* Contenu */}
                  <View style={styles.categoryOverlayContent}>
                    {/* Header: Badge meal + Actions */}
                    <View style={styles.categoryCompactHeader}>
                      <View style={[styles.mealBadgeCompact, { backgroundColor: mealColor }]}>
                        <Text style={styles.mealBadgeCompactText}>
                          {category.meal?.name || 'N/A'}
                        </Text>
                      </View>

                      {/* Icônes d'actions avec images personnalisées */}
                      <View style={styles.categoryCompactActions}>
                        <TouchableOpacity 
                          style={styles.editIconButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            navigation.navigate('EditCategory', { categoryId: category.id });
                          }}
                        >
                          <Image
                            source={require('../../assets/Icons/pen.png')}
                            style={styles.editIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.deleteIconButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                        >
                          <Image
                            source={require('../../assets/Icons/delete.png')}
                            style={styles.deleteIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Footer: Badge nom collé en bas avec coins arrondis - Taille auto */}
                    <View style={styles.categoryCompactFooter}>
                      <Text style={styles.categoryCompactName} numberOfLines={1}>
                        {category.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {selectedMeal === 'All' 
                  ? 'Aucune catégorie trouvée' 
                  : `Aucune catégorie pour "${selectedMeal}"`}
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={handleAddDish}
              >
                <Text style={styles.emptyStateButtonText}>Ajouter une catégorie</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

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
  categoriesSection: {
    paddingTop: 20,
    paddingBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#5a2c1c',
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: '#d2d2d2',
    borderWidth: 0.3,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryCardActive: {
    backgroundColor: '#5a2c1c',
    borderColor: '#5a2c1c',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  categoryNameActive: {
    color: 'white',
  },
  dishesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  dishesHeaderLeft: {
    flex: 1,
  },
  dishesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dishesCount: {
    fontSize: 13,
    color: '#666',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5a2c1c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  
  // ===== NOUVEAUX STYLES COMPACT CARDS =====
  recipesSection: {
    paddingTop: 5,
    paddingBottom: 20,
  },
  categoryCompactCard: {
    height: 120,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryFullImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  categoryFullImagePlaceholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  categoryFullImagePlaceholderText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.25)',
  },
  categoryOverlayGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  categoryOverlayContent: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
  },
  categoryCompactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  mealBadgeCompact: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  mealBadgeCompactText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
  categoryCompactActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(40, 37, 37, 0.64)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Icônes personnalisées
  editIcon: {
    width: 16,
    height: 16,
    tintColor: '#5a2c1c',
  },
  deleteIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
  },
  // Footer avec taille auto pour le badge du nom
  categoryCompactFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignSelf: 'flex-start',
  },
  categoryCompactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 16,
  },
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#5a2c1c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 40,
  },
});

export default MenuScreen;