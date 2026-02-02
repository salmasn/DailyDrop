import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';

function MenuScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: '1', name: 'All' },
    { id: '2', name: 'Breakfast' },
    { id: '3', name: 'Lunch' },
    { id: '4', name: 'Dinner' },
    { id: '5', name: 'Dessert' },
  ];

  const dishes = [
    {
      id: '1',
      name: 'Burst Tomato Pasta',
      image: require('../../assets/images/pasta.png'),
      time: '35 min',
      difficulty: 'Easy',
      chef: 'Arlene McCoy',
      category: 'Lunch',
      price: '45 MAD',
    },
    {
      id: '2',
      name: 'Margherita Pizza',
      image: require('../../assets/images/pizza.png'),
      time: '25 min',
      difficulty: 'Medium',
      chef: 'Gordon Chef',
      category: 'Dinner',
      price: '50 MAD',
    },
    {
      id: '3',
      name: 'Pancake Stack',
      image: require('../../assets/images/pancake.png'),
      time: '15 min',
      difficulty: 'Easy',
      chef: 'Jamie Oliver',
      category: 'Breakfast',
      price: '30 MAD',
    },
    {
      id: '4',
      name: 'Caesar Salad',
      image: require('../../assets/images/cesar.png'),
      time: '10 min',
      difficulty: 'Easy',
      chef: 'Mary Kitchen',
      category: 'Lunch',
      price: '35 MAD',
    },
    {
      id: '5',
      name: 'Chocolate Cake',
      image: require('../../assets/images/chocoCake.png'),
      time: '45 min',
      difficulty: 'Hard',
      chef: 'Sweet Baker',
      category: 'Dessert',
      price: '40 MAD',
    },
  ];

  const handleAddDish = () => {
    console.log('Add new dish');
    navigation.navigate('AddDish');
  };

  const filteredDishes = selectedCategory === 'All' 
    ? dishes 
    : dishes.filter(dish => dish.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Bonjour, Chef!"
        subtitle="Gérez vos plats délicieux"
        // avatar="👨‍🍳"           ← commentaire : à remplacer par image si tu as suivi la modif précédente
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
        showSearch={true}
        searchPlaceholder="Rechercher un plat..."
        backgroundColor="#5a2c1c"
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Catégories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.name && styles.categoryCardActive
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.name && styles.categoryNameActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Header avec bouton Ajouter */}
        <View style={styles.dishesHeader}>
          <View style={styles.dishesHeaderLeft}>
            <Text style={styles.dishesTitle}>My Plats</Text>
            <Text style={styles.dishesCount}>{filteredDishes.length} plat(s)</Text>
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

        {/* Dishes List */}
        <View style={styles.recipesSection}>
          {filteredDishes.map((dish) => (
            <TouchableOpacity 
              key={dish.id}
              style={styles.dishCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('DishDetails', { dishId: dish.id })}
            >
              {/* Image du plat */}
              <View style={styles.dishImageContainer}>
                <Image
                  source={dish.image}
                  style={styles.dishImage}
                  resizeMode="cover"
                />
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Disponible</Text>
                </View>
              </View>

              {/* Infos + boutons → semi-transparent + bordure haute arrondie */}
              <View style={styles.dishDetails}>
                <View style={styles.dishHeader}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.dishPrice}>{dish.price}</Text>
                </View>

                <View style={styles.dishFooter}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditDish', { dishId: dish.id })}
                  >
                    <Text style={styles.editButtonText}>Modifier</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => console.log('Delete', dish.id)}
                  >
                    <Text style={styles.deleteButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  recipesSection: {
    paddingTop: 5,
    paddingBottom: 20,
  },
  dishCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dishImageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  dishDetails: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // semi-transparent white
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  dishPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5a2c1c',
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#5a2c1c',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d0d0d0',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  bottomSpace: {
    height: 40,
  },
});

export default MenuScreen;