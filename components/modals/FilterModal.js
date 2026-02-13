import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { FILTER_MODES } from '../../hooks/useRestaurantFiltering';

const { height } = Dimensions.get('window');

/**
 * Modal de filtrage des restaurants
 */
const FilterModal = ({
  visible,
  filterMode,
  onFilterModeChange,
  customTimeslots,
  onAddTimeslot,
  onRemoveTimeslot,
  onUpdateTimeslot,
  onApply,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <ScrollView style={styles.filterScroll}>
            <Text style={styles.filterModalTitle}>🔍 Options de Filtrage</Text>
            
            {/* Mode Tous */}
            <FilterOption
              icon="🗺️"
              title="Tous les restaurants"
              description="Afficher tous les restaurants dans le rayon"
              isActive={filterMode === FILTER_MODES.ALL}
              onPress={() => onFilterModeChange(FILTER_MODES.ALL)}
            />

            {/* Mode Temps Réel */}
            <FilterOption
              icon="⚡"
              title="Offres disponibles maintenant"
              description="Restaurants avec offres actives en ce moment"
              isActive={filterMode === FILTER_MODES.REALTIME}
              onPress={() => onFilterModeChange(FILTER_MODES.REALTIME)}
            />

            {/* Mode Créneaux Personnalisés */}
            <FilterOption
              icon="🕐"
              title="Créneaux horaires personnalisés"
              description="Définir vos propres créneaux de recherche"
              isActive={filterMode === FILTER_MODES.CUSTOM_TIMESLOTS}
              onPress={() => onFilterModeChange(FILTER_MODES.CUSTOM_TIMESLOTS)}
            />

            {/* Input Timeslots */}
            {filterMode === FILTER_MODES.CUSTOM_TIMESLOTS && (
              <View style={styles.timeslotsSection}>
                <Text style={styles.timeslotsSectionTitle}>⏰ Vos Créneaux</Text>
                
                {customTimeslots.map((slot, index) => (
                  <View key={index} style={styles.timeslotRow}>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="11:00"
                      placeholderTextColor="#999"
                      value={slot.start}
                      onChangeText={(text) => onUpdateTimeslot(index, 'start', text)}
                    />
                    <Text style={styles.timeSeparator}>→</Text>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="14:00"
                      placeholderTextColor="#999"
                      value={slot.end}
                      onChangeText={(text) => onUpdateTimeslot(index, 'end', text)}
                    />
                    {customTimeslots.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeTimeslotBtn}
                        onPress={() => onRemoveTimeslot(index)}
                      >
                        <Text style={styles.removeTimeslotText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addTimeslotBtn}
                  onPress={onAddTimeslot}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addTimeslotText}>+ Ajouter un créneau</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Boutons d'action */}
          <View style={styles.filterModalActions}>
            <TouchableOpacity
              style={styles.cancelFilterBtn}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelFilterText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyFilterBtn}
              onPress={onApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyFilterText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Composant pour une option de filtre
 */
const FilterOption = ({ icon, title, description, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.filterOptionCard, isActive && styles.filterOptionCardActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.filterOptionHeader}>
      <Text style={styles.filterOptionIcon}>{icon}</Text>
      <View style={styles.filterOptionTextContainer}>
        <Text style={[styles.filterOptionTitle, isActive && styles.filterOptionTitleActive]}>
          {title}
        </Text>
        <Text style={styles.filterOptionDescription}>{description}</Text>
      </View>
      {isActive && <Text style={styles.checkmark}>✓</Text>}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  filterScroll: {
    padding: 20,
    maxHeight: height * 0.65,
  },
  filterModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  filterOptionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  filterOptionCardActive: {
    borderColor: '#5a2c1c',
    backgroundColor: '#fff8f0',
  },
  filterOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOptionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  filterOptionTextContainer: {
    flex: 1,
  },
  filterOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  filterOptionTitleActive: {
    color: '#5a2c1c',
  },
  filterOptionDescription: {
    fontSize: 13,
    color: '#666',
  },
  checkmark: {
    fontSize: 24,
    color: '#5a2c1c',
  },
  timeslotsSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  timeslotsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  timeslotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timeSeparator: {
    marginHorizontal: 8,
    fontSize: 18,
    color: '#666',
  },
  removeTimeslotBtn: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeTimeslotText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addTimeslotBtn: {
    backgroundColor: '#5a2c1c',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addTimeslotText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterModalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  cancelFilterBtn: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelFilterText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyFilterBtn: {
    flex: 1,
    backgroundColor: '#5a2c1c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyFilterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilterModal;