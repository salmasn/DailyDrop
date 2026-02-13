import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

// Couleurs pour les badges meals
const MEAL_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3',
  '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA',
];

/**
 * Composant pour afficher une carte de catégorie
 */
const CategoryCard = ({ 
  category, 
  index, 
  onPress, 
  onEdit, 
  onDelete 
}) => {
  return (
    <TouchableOpacity 
      style={styles.categoryCompactCard}
      activeOpacity={0.9}
      onPress={() => onPress(category)}
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

      {/* Overlay gradient */}
      <View style={styles.categoryOverlayGradient} />

      {/* Contenu */}
      <View style={styles.categoryOverlayContent}>
        {/* Header: Badges meals + Actions */}
        <View style={styles.categoryCompactHeader}>
          {/* Badges meals */}
          <MealBadges meals={category.meals} index={index} />

          {/* Actions */}
          <CategoryActions 
            onEdit={(e) => {
              e.stopPropagation();
              onEdit(category.id);
            }}
            onDelete={(e) => {
              e.stopPropagation();
              onDelete(category.id);
            }}
          />
        </View>

        {/* Footer: Nom de la catégorie */}
        <View style={styles.categoryCompactFooter}>
          <Text style={styles.categoryCompactName} numberOfLines={1}>
            {category.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Composant pour afficher les badges des meals
 */
const MealBadges = ({ meals, index }) => {
  return (
    <View style={styles.mealBadgesContainer}>
      {meals && meals.length > 0 ? (
        <>
          {meals.slice(0, 2).map((meal, idx) => (
            <View 
              key={meal.id} 
              style={[
                styles.mealBadgeCompact, 
                { backgroundColor: MEAL_COLORS[(index + idx) % MEAL_COLORS.length] }
              ]}
            >
              <Text style={styles.mealBadgeCompactText}>
                {meal.name}
              </Text>
            </View>
          ))}
          {/* Indicateur s'il y a plus de 2 meals */}
          {meals.length > 2 && (
            <View style={[styles.mealBadgeCompact, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <Text style={styles.mealBadgeCompactText}>
                +{meals.length - 2}
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={[styles.mealBadgeCompact, { backgroundColor: '#999' }]}>
          <Text style={styles.mealBadgeCompactText}>N/A</Text>
        </View>
      )}
    </View>
  );
};

/**
 * Composant pour afficher les boutons d'action
 */
const CategoryActions = ({ onEdit, onDelete }) => {
  return (
    <View style={styles.categoryCompactActions}>
      <TouchableOpacity 
        style={styles.editIconButton}
        onPress={onEdit}
      >
        <Image
          source={require('../../../assets/Icons/pen.png')}
          style={styles.editIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteIconButton}
        onPress={onDelete}
      >
        <Image
          source={require('../../../assets/Icons/delete.png')}
          style={styles.deleteIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'flex-start',
    padding: 10,
  },
  mealBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
    marginRight: 8,
  },
  mealBadgeCompact: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealBadgeCompactText: {
    fontSize: 10,
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
});

export default CategoryCard;