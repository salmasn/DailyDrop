import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux'; // Ajouté
import { useRestaurantImage } from '../../hooks/Userestaurantimage'; // Ajouté

function ScreenHeader({ 
  title, 
  subtitle, 
  rightAction, 
  rightIcon,
  // Modification ici : on utilise l'image dynamique du hook par défaut
  avatarSource,      
  showNotification = false,
  onNotificationPress,
  showSearch = false,
  searchPlaceholder = "Rechercher...",
  searchIconSource = require('../../assets/Icons/search.png'), 
  backgroundColor = '#5a2c1c',
}) {
  // --- Logique dynamique ajoutée ---
  const { restaurantImage } = useRestaurantImage();
  const fallbackImage = require('../../assets/images/avatar.png');
  // Si avatarSource n'est pas passé en prop, on utilise l'image de la DB, sinon le fallback
  const finalAvatar = avatarSource || (restaurantImage ? restaurantImage : fallbackImage);
  // ---------------------------------

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.headerContent}>
        {/* Avatar (image) + Titre */}
        <View style={styles.profileSection}>
          {finalAvatar && (
            <Image 
              source={finalAvatar}
              style={styles.avatar}
              resizeMode="cover"
            />
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        
        {/* Boutons à droite */}
        <View style={styles.rightButtons}>
          {rightAction && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={rightAction}
              activeOpacity={0.7}
            >
              {typeof rightIcon === 'string' ? (
                <Text style={styles.iconText}>{rightIcon}</Text>
              ) : rightIcon ? (
                <Image source={rightIcon} style={styles.rightIconImage} />
              ) : null}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Barre de recherche optionnelle */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Image 
              source={searchIconSource}
              style={styles.searchIconImage}
              resizeMode="contain"
            />
            <Text style={styles.searchPlaceholder}>{searchPlaceholder}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor:'#1e1001',
    borderWidth:2,
    marginRight: 12,
    backgroundColor: 'white',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconText: {
    fontSize: 22,
    color: 'white',
  },
  rightIconImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#f7f7f7de',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#777',
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
});

export default ScreenHeader;