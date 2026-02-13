import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

/**
 * Composant pour afficher une carte de plat
 */
const DishCard = ({ dish, isPending = false, onPress, onEdit, onDelete }) => {
  const imageUri = isPending ? dish.dishImage : dish.imageUrl;
  
  return (
    <TouchableOpacity 
      style={[styles.dishCard, isPending && styles.pendingDishCard]}
      onPress={() => onPress(dish)}
      activeOpacity={0.7}
    >
      {imageUri && (
        <View style={styles.dishImageContainerLeft}>
          <Image
            source={{ uri: imageUri }}
            style={styles.dishImageCircle}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={[styles.dishCardContent, imageUri && styles.dishCardContentWithImage]}>
        <Text style={styles.dishNameCompact} numberOfLines={1}>
          {dish.name}
        </Text>
        
        <View style={styles.dishPriceRow}>
          {dish.discountedPrice ? (
            <>
              <Text style={styles.normalPriceStrikedCompact}>{dish.normalPrice} DH</Text>
              <Text style={styles.discountedPriceCompact}>{dish.discountedPrice} DH</Text>
              {dish.discountPercentage && (
                <View style={styles.discountBadgeCompact}>
                  <Text style={styles.discountBadgeTextCompact}>-{dish.discountPercentage}%</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.singlePriceCompact}>{dish.normalPrice} DH</Text>
          )}
        </View>

        {dish.timeslots && dish.timeslots.length > 0 && (
          <View style={styles.dishInfoRow}>
            <Text style={styles.dishInfoLabelTimeslot}>
              🕒 {dish.timeslots.length} créneau{dish.timeslots.length > 1 ? 'x' : ''}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.dishActionsTopRight}>
        <TouchableOpacity 
          style={styles.editButtonTopRight}
          onPress={(e) => {
            e.stopPropagation();
            onEdit(dish.id);
          }}
        >
          <Image
            source={require('../../../assets/Icons/pen.png')}
            style={styles.actionIconSmall}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButtonTopRight}
          onPress={(e) => {
            e.stopPropagation();
            onDelete(dish.id);
          }}
        >
          <Image
            source={require('../../../assets/Icons/delete.png')}
            style={styles.actionIconSmallDelete}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dishCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pendingDishCard: {
    borderWidth: 2,
    borderColor: '#ff9800',
    backgroundColor: '#fffaf0',
  },
  dishImageContainerLeft: {
    marginRight: 12,
  },
  dishImageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  dishCardContent: {
    flex: 1,
    paddingRight: 80,
  },
  dishCardContentWithImage: {
    paddingLeft: 0,
  },
  dishActionsTopRight: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  editButtonTopRight: {
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 6,
  },
  deleteButtonTopRight: {
    backgroundColor: '#ffebee',
    padding: 6,
    borderRadius: 6,
  },
  actionIconSmall: {
    width: 16,
    height: 16,
    tintColor: '#5a2c1c',
  },
  actionIconSmallDelete: {
    width: 16,
    height: 16,
    tintColor: '#d32f2f',
  },
  dishNameCompact: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dishPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  normalPriceStrikedCompact: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPriceCompact: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  singlePriceCompact: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },
  discountBadgeCompact: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountBadgeTextCompact: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dishInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishInfoLabelTimeslot: {
    fontSize: 13,
    color: '#ff9800',
    fontWeight: '600',
  },
});

export default DishCard;