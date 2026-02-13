import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DishCard from './DishCard';

/**
 * Composant pour afficher une liste de plats avec en-tête
 */
const DishesList = ({ 
  title, 
  dishes, 
  isPending = false, 
  onDishPress, 
  onEdit, 
  onDelete 
}) => {
  if (dishes.length === 0) return null;

  return (
    <>
      <View style={styles.dishesHeader}>
        <Text style={styles.dishesTitle}>{title}</Text>
        <Text style={styles.dishesCount}>
          {dishes.length} plat{dishes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {dishes.map((dish) => (
        <DishCard
          key={dish.id}
          dish={dish}
          isPending={isPending}
          onPress={onDishPress}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  dishesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  dishesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dishesCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});

export default DishesList;