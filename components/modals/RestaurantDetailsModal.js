import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { FILTER_MODES } from '../../hooks/useRestaurantFiltering';
import { 
  isOfferAvailableNow, 
  isOfferInCustomTimeslots,
  getDiscountCategory,
  getDiscountColor,
  getMaxDiscount
} from '../../utils/offerUtils';

const { height } = Dimensions.get('window');

/**
 * Modal des détails d'un restaurant
 */
const RestaurantDetailsModal = ({
  visible,
  restaurant,
  filterMode,
  customTimeslots,
  onClose,
  onNavigate,
}) => {
  if (!restaurant) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.detailsOverlay}>
        <View style={styles.detailsModal}>
          <ScrollView style={styles.detailsScroll}>
            <Text style={styles.detailsName}>{restaurant.name}</Text>
            <Text style={styles.detailsCuisine}>{restaurant.cuisine_type}</Text>
            <Text style={styles.detailsDescription}>{restaurant.description}</Text>
            
            {/* Informations du restaurant */}
            <View style={styles.detailsInfo}>
              <Text style={styles.detailsInfoLabel}>📍 Adresse</Text>
              <Text style={styles.detailsInfoText}>{restaurant.address}</Text>
              
              {/* Boutons de Navigation */}
              <View style={styles.navigationButtons}>
                <TouchableOpacity
                  style={[styles.navigationBtn, styles.navigationBtnDriving]}
                  onPress={() => onNavigate(restaurant, 'driving')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.navigationBtnIcon}>🚗</Text>
                  <View>
                    <Text style={styles.navigationBtnText}>En Voiture</Text>
                    <Text style={styles.navigationBtnSubtext}>Plus rapide</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navigationBtn, styles.navigationBtnWalking]}
                  onPress={() => onNavigate(restaurant, 'walking')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.navigationBtnIcon}>🚶</Text>
                  <View>
                    <Text style={styles.navigationBtnText}>À Pied</Text>
                    <Text style={styles.navigationBtnSubtext}>Écologique</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailsInfo}>
              <Text style={styles.detailsInfoLabel}>⏰ Horaires</Text>
              <Text style={styles.detailsInfoText}>{restaurant.opening_hours}</Text>
            </View>

            <View style={styles.detailsInfo}>
              <Text style={styles.detailsInfoLabel}>💰 Gamme de prix</Text>
              <Text style={styles.detailsInfoText}>{restaurant.average_price_range}</Text>
            </View>

            {/* Offres */}
            {restaurant.offers && restaurant.offers.length > 0 ? (
              <>
                <Text style={styles.offersTitle}>🔥 Offres disponibles</Text>
                {restaurant.offers.map(offer => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    filterMode={filterMode}
                    customTimeslots={customTimeslots}
                  />
                ))}
              </>
            ) : (
              <Text style={styles.noOffers}>Aucune offre disponible pour le moment</Text>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeDetailsBtn}
            onPress={onClose}
          >
            <Text style={styles.closeDetailsBtnText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Composant pour une carte d'offre
 */
const OfferCard = ({ offer, filterMode, customTimeslots }) => {
  const isAvailableNow = isOfferAvailableNow(offer);
  const isInCustomSlots = isOfferInCustomTimeslots(offer, customTimeslots);
  const isRelevant = filterMode === FILTER_MODES.ALL || 
                    (filterMode === FILTER_MODES.REALTIME && isAvailableNow) ||
                    (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && isInCustomSlots);
  
  const discountCategory = getDiscountCategory(offer.discount_percentage);
  const discountColor = getDiscountColor({ offers: [offer] });

  return (
    <View 
      style={[
        styles.offerCard, 
        !isRelevant && styles.offerCardInactive,
        { borderColor: discountColor }
      ]}
    >
      <View style={styles.offerHeader}>
        <Text style={styles.offerName}>{offer.dish_name}</Text>
        {((isAvailableNow && filterMode === FILTER_MODES.REALTIME) ||
          (isInCustomSlots && filterMode === FILTER_MODES.CUSTOM_TIMESLOTS)) && (
          <Text style={styles.availableBadge}>✨ Disponible</Text>
        )}
      </View>
      
      <View style={styles.discountCategoryBadge}>
        <Text style={[styles.discountCategoryText, { color: discountColor }]}>
          {discountCategory} réduction
        </Text>
      </View>
      
      <Text style={styles.offerDescription}>{offer.description}</Text>
      
      <View style={styles.offerPrices}>
        <Text style={styles.offerOldPrice}>{offer.normal_price} DH</Text>
        <Text style={styles.offerNewPrice}>{offer.discounted_price} DH</Text>
        <Text style={[styles.offerDiscount, { backgroundColor: discountColor }]}>
          -{offer.discount_percentage}%
        </Text>
      </View>
      
      <Text style={styles.offerTimeslots}>
        {offer.timeslots.map(slot => `${slot.day} ${slot.start_time}-${slot.end_time}`).join(', ')}
      </Text>
      
      <Text style={styles.offerQuantity}>Quantité: {offer.available_quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  detailsScroll: {
    padding: 20,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  detailsCuisine: {
    fontSize: 16,
    color: '#5a2c1c',
    fontWeight: '600',
    marginBottom: 12,
  },
  detailsDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  detailsInfo: {
    marginBottom: 15,
  },
  detailsInfoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detailsInfoText: {
    fontSize: 14,
    color: '#666',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  navigationBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  navigationBtnDriving: {
    backgroundColor: '#4285F4',
  },
  navigationBtnWalking: {
    backgroundColor: '#FF6B35',
  },
  navigationBtnIcon: {
    fontSize: 24,
  },
  navigationBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  navigationBtnSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 15,
  },
  offerCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  offerCardInactive: {
    opacity: 0.6,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  availableBadge: {
    backgroundColor: '#27ae60',
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountCategoryBadge: {
    marginBottom: 8,
  },
  discountCategoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  offerDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  offerPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerOldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  offerNewPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 8,
  },
  offerDiscount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  offerTimeslots: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  offerQuantity: {
    fontSize: 12,
    color: '#999',
  },
  noOffers: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  closeDetailsBtn: {
    backgroundColor: '#5a2c1c',
    margin: 20,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeDetailsBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestaurantDetailsModal;