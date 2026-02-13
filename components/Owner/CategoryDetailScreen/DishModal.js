import React from 'react';
import { StyleSheet, View, Text, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';

/**
 * Modal pour afficher les détails d'un plat
 */
const DishModal = ({ visible, dish, onClose }) => {
  if (!dish) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {(dish.dishImage || dish.imageUrl) && (
              <Image
                source={{ uri: dish.dishImage || dish.imageUrl }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{dish.name}</Text>

              {dish.description && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Description</Text>
                  <Text style={styles.modalSectionText}>{dish.description}</Text>
                </View>
              )}

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Prix</Text>
                <View style={styles.modalPriceContainer}>
                  <Text style={styles.modalNormalPrice}>Prix normal: {dish.normalPrice} DH</Text>
                  {dish.discountedPrice && (
                    <Text style={styles.modalDiscountedPrice}>Prix réduit: {dish.discountedPrice} DH</Text>
                  )}
                </View>
              </View>

              {dish.availableQuantity !== undefined && dish.availableQuantity !== null && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Disponibilité</Text>
                  <Text style={styles.modalSectionText}>
                    {dish.availableQuantity} unité{dish.availableQuantity > 1 ? 's' : ''} disponible{dish.availableQuantity > 1 ? 's' : ''}
                  </Text>
                </View>
              )}

              {dish.components && dish.components.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Composants</Text>
                  <View style={styles.modalComponentsList}>
                    {dish.components.map((component, index) => (
                      <View key={index} style={styles.modalComponentChip}>
                        <Text style={styles.modalComponentText}>{component}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {dish.timeslots && dish.timeslots.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Créneaux horaires</Text>
                  {dish.timeslots.map((timeslot, index) => (
                    <View key={index} style={styles.modalTimeslotItem}>
                      <Text style={styles.modalTimeslotDay}>{timeslot.day}</Text>
                      <Text style={styles.modalTimeslotTime}>
                        {timeslot.start_time} - {timeslot.end_time}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Text style={styles.modalCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5a2c1c',
    marginBottom: 8,
  },
  modalSectionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  modalPriceContainer: {
    gap: 4,
  },
  modalNormalPrice: {
    fontSize: 15,
    color: '#666',
  },
  modalDiscountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  modalComponentsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalComponentChip: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  modalComponentText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
  },
  modalTimeslotItem: {
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  modalTimeslotDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 4,
  },
  modalTimeslotTime: {
    fontSize: 13,
    color: '#f57c00',
  },
  modalCloseButton: {
    backgroundColor: '#5a2c1c',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DishModal;