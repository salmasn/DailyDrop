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
import { categoryService, dishService } from '../../services/categoryService';

function CategoryDetailsScreen({ navigation, route }) {
  const { categoryId } = route.params;
  
  const [category, setCategory] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategoryDetails();
  }, [categoryId]);

  const loadCategoryDetails = async () => {
    try {
      setLoading(true);
      console.log("📱 Chargement des détails de la catégorie:", categoryId);
      
      // Charger les informations de la catégorie
      const categoryData = await categoryService.getCategoryById(categoryId);
      console.log("✅ Catégorie chargée:", categoryData);
      setCategory(categoryData);

      // Charger les plats de cette catégorie
      const dishesData = await dishService.getDishesByCategory(categoryId);
      console.log("✅ Plats chargés:", dishesData);
      setDishes(dishesData);
      
    } catch (error) {
      console.error('❌ Erreur chargement détails:', error);
      Alert.alert('Error', 'Unable to load category details');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategoryDetails();
    setRefreshing(false);
  };

  const handleAddDish = () => {
    navigation.navigate('AddDishScreen', { 
      categoryId: categoryId,
      categoryName: category?.name 
    });
  };

  const handleEditDish = (dishId) => {
    navigation.navigate('EditDishScreen', { 
      dishId: dishId,
      categoryId: categoryId 
    });
  };

  const handleDeleteDish = async (dishId) => {
    Alert.alert(
      'Delete Dish',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dishService.deleteDish(dishId);
              Alert.alert('Success', 'Dish deleted successfully');
              await loadCategoryDetails();
            } catch (error) {
              console.error('❌ Error deleting dish:', error);
              Alert.alert('Error', 'Unable to delete dish');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Category Details"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          backgroundColor="#5a2c1c"
        />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#5a2c1c" />
          <Text style={{ marginTop: 10, color: '#5a2c1c' }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={category?.name || "Category Details"}
        subtitle={`${dishes.length} dish${dishes.length !== 1 ? 'es' : ''}`}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
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
        {/* Category Header Card */}
        <View style={styles.categoryHeaderCard}>
          {category?.imageUrl ? (
            <Image
              source={{ uri: category.imageUrl }}
              style={styles.categoryHeaderImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.categoryHeaderImagePlaceholder}>
              <Text style={styles.categoryHeaderImagePlaceholderText}>
                {category?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          <View style={styles.categoryHeaderOverlay}>
            <View style={styles.categoryHeaderContent}>
              <View style={styles.mealBadge}>
                <Text style={styles.mealBadgeText}>
                  {category?.meal?.name || 'N/A'}
                </Text>
              </View>
              <Text style={styles.categoryHeaderTitle}>{category?.name}</Text>
              {category?.description && (
                <Text style={styles.categoryHeaderDescription}>
                  {category.description}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Add Dish Button */}
        <View style={styles.addDishSection}>
          <TouchableOpacity 
            style={styles.addDishButton}
            onPress={handleAddDish}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/Icons/add.png')}
              style={styles.addDishIcon}
              resizeMode="contain"
            />
            <Text style={styles.addDishButtonText}>
              {dishes.length > 0 ? 'Add Another Dish' : 'Add First Dish'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dishes List */}
        <View style={styles.dishesSection}>
          {dishes.length > 0 ? (
            <View style={styles.dishesHeader}>
              <Text style={styles.dishesTitle}>Dishes</Text>
              <Text style={styles.dishesCount}>{dishes.length} item{dishes.length !== 1 ? 's' : ''}</Text>
            </View>
          ) : null}

          {dishes.map((dish) => (
            <View key={dish.id} style={styles.dishCard}>
              {/* Dish Image */}
              <View style={styles.dishImageContainer}>
                {dish.imageUrl ? (
                  <Image
                    source={{ uri: dish.imageUrl }}
                    style={styles.dishImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.dishImagePlaceholder}>
                    <Text style={styles.dishImagePlaceholderText}>
                      {dish.name?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Dish Info */}
              <View style={styles.dishInfo}>
                <Text style={styles.dishName} numberOfLines={1}>
                  {dish.name}
                </Text>
                
                {dish.description && (
                  <Text style={styles.dishDescription} numberOfLines={2}>
                    {dish.description}
                  </Text>
                )}

                {/* Prices */}
                <View style={styles.priceContainer}>
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

                {/* Quantity */}
                {dish.availableQuantity !== undefined && (
                  <Text style={styles.quantity}>
                    Stock: {dish.availableQuantity} available
                  </Text>
                )}
              </View>

              {/* Actions */}
              <View style={styles.dishActions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEditDish(dish.id)}
                >
                  <Image
                    source={require('../../assets/Icons/pen.png')}
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteDish(dish.id)}
                >
                  <Image
                    source={require('../../assets/Icons/delete.png')}
                    style={styles.actionIconDelete}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {dishes.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No dishes yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start by adding your first dish to this category
              </Text>
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
  
  // Category Header Card
  categoryHeaderCard: {
    height: 200,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryHeaderImage: {
    width: '100%',
    height: '100%',
  },
  categoryHeaderImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryHeaderImagePlaceholderText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  categoryHeaderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  categoryHeaderContent: {
    gap: 8,
  },
  mealBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  mealBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5a2c1c',
  },
  categoryHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryHeaderDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },

  // Add Dish Button
  addDishSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  addDishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a2c1c',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#5a2c1c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addDishIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  addDishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  // Dishes Section
  dishesSection: {
    marginTop: 20,
  },
  dishesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  dishesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dishesCount: {
    fontSize: 14,
    color: '#666',
  },

  // Dish Card
  dishCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dishImageContainer: {
    marginRight: 12,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  dishImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishImagePlaceholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  dishInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dishDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  normalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },
  singlePrice: {
    fontSize: 16,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
  quantity: {
    fontSize: 12,
    color: '#666',
  },
  dishActions: {
    justifyContent: 'center',
    gap: 8,
    marginLeft: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 16,
    height: 16,
    tintColor: '#5a2c1c',
  },
  actionIconDelete: {
    width: 16,
    height: 16,
    tintColor: '#e74c3c',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },

  bottomSpace: {
    height: 40,
  },
});

export default CategoryDetailsScreen;