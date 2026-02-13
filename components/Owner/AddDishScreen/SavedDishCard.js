import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

/**
 * Composant pour afficher une carte de plat sauvegardé
 */
const SavedDishCard = ({ dish, onEdit, onDelete }) => {
  return (
    <View style={styles.dishCard}>
      <View style={styles.dishContent}>
        <View style={styles.dishImageContainer}>
          {dish.dishImage ? (
            <Image 
              source={{ uri: dish.dishImage }} 
              style={styles.dishImage}
            />
          ) : (
            <View style={styles.dishImagePlaceholder}>
              <Text style={styles.dishImagePlaceholderText}>
                {dish.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.dishTextContainer}>
          <Text style={styles.dishName}>{dish.name}</Text>
          <View style={styles.priceRow}>
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
          {dish.availableQuantity !== null && dish.availableQuantity !== undefined && (
            <Text style={styles.quantity}>Qty: {dish.availableQuantity}</Text>
          )}
        </View>
        <View style={styles.dishActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(dish.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(dish.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dishCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dishContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishImageContainer: {
    marginRight: 12,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  dishImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishImagePlaceholderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dishTextContainer: {
    flex: 1,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  normalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },
  singlePrice: {
    fontSize: 15,
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
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  quantity: {
    fontSize: 12,
    color: '#666',
  },
  dishActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    color: '#5a2c1c',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});

export default SavedDishCard;