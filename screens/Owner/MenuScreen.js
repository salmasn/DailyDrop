import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';

function MenuScreen({ navigation }) {
  const handleAddDish = () => {
    console.log('Add new dish');
    // TODO: Navigate to add dish screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="My Menu"
        subtitle="Manage your dishes"
        rightAction={handleAddDish}
        rightIcon="+"
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Specials</Text>
          
          <View style={styles.card}>
            <View style={styles.dishEmoji}>
              <Text style={styles.emoji}>🍕</Text>
            </View>
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>Margherita Pizza</Text>
              <Text style={styles.dishDescription}>
                Fresh tomato, mozzarella, basil
              </Text>
              <Text style={styles.dishPrice}>50 MAD</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.dishEmoji}>
              <Text style={styles.emoji}>🍝</Text>
            </View>
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>Pasta Carbonara</Text>
              <Text style={styles.dishDescription}>
                Creamy sauce, bacon, parmesan
              </Text>
              <Text style={styles.dishPrice}>45 MAD</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddDish}>
          <Text style={styles.addButtonText}>+ Add New Dish</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dishEmoji: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emoji: {
    fontSize: 30,
  },
  dishInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#5a2c1c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuScreen;