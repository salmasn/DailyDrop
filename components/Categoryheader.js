import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

/**
 * Composant pour afficher l'en-tête de la catégorie avec image et badges
 */
const CategoryHeader = ({ category }) => {
  return (
    <>
      <View style={styles.categoryHeaderCard}>
        {category.imageUrl ? (
          <Image
            source={{ uri: category.imageUrl }}
            style={styles.categoryHeaderImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.categoryHeaderImagePlaceholder}>
            <Text style={styles.categoryHeaderImagePlaceholderText}>
              {category.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        
        <View style={styles.categoryHeaderOverlay}>
          <View style={styles.categoryHeaderContent}>
            {category.meals && category.meals.length > 0 ? (
              <View style={styles.mealBadgesRow}>
                {category.meals.slice(0, 2).map((meal, idx) => (
                  <View key={meal.id || idx} style={styles.mealBadge}>
                    <Text style={styles.mealBadgeText}>{meal.name}</Text>
                  </View>
                ))}
                {category.meals.length > 2 && (
                  <View style={styles.mealBadge}>
                    <Text style={styles.mealBadgeText}>+{category.meals.length - 2}</Text>
                  </View>
                )}
              </View>
            ) : category.meal ? (
              <View style={styles.mealBadge}>
                <Text style={styles.mealBadgeText}>{category.meal.name}</Text>
              </View>
            ) : (
              <View style={styles.mealBadge}>
                <Text style={styles.mealBadgeText}>N/A</Text>
              </View>
            )}
            <Text style={styles.categoryHeaderTitle}>{category.name || 'Sans nom'}</Text>
          </View>
        </View>
      </View>
      
      <View>
        <Text style={styles.categoryDescription}>Description</Text>
        {category.description ? (
          <Text style={styles.categoryHeaderDescription}>
            {category.description}
          </Text>
        ) : (
          <Text style={styles.categoryHeaderDescription}>
            Aucune description disponible
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  categoryHeaderCard: {
    height: 250,
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
  mealBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  mealBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5a2c1c',
  },
  categoryHeaderContent: {
    gap: 8,
  },
  categoryHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryDescription: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.9)',
    lineHeight: 18,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingLeft: 15,
  },
  categoryHeaderDescription: {
    fontSize: 14,
    color: 'rgba(36, 36, 36, 0.93)',
    lineHeight: 18,
    paddingLeft: 15,
    fontWeight: '500',
    paddingTop: 10,
  },
});

export default CategoryHeader;