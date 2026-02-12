import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

/**
 * Modal de configuration du rayon de recherche
 */
const ConfigModal = ({
  visible,
  selectedRadius,
  onRadiusChange,
  onConfirm,
  onClose,
}) => {
  const quickRadiusOptions = [500, 1000, 2000, 5000];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.configModal}>
          <LinearGradient
            colors={['#3c1d04', '#824104']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.configGradient}
          >
            <Text style={styles.configTitle}>Rayon de Recherche</Text>
            <Text style={styles.configSubtitle}>
              Définissez la distance de recherche autour de votre position
            </Text>

            <View style={styles.radiusInputContainer}>
              <TextInput
                style={styles.radiusInput}
                placeholder="Ex: 1000"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={selectedRadius}
                onChangeText={onRadiusChange}
                keyboardType="numeric"
              />
              <Text style={styles.radiusUnit}>mètres</Text>
            </View>
            <Text style={styles.radiusHint}>Entre 100m et 10km (10000m)</Text>

            <View style={styles.quickOptions}>
              {quickRadiusOptions.map(val => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.quickOption,
                    selectedRadius === val.toString() && styles.quickOptionActive
                  ]}
                  onPress={() => onRadiusChange(val.toString())}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.quickOptionText,
                    selectedRadius === val.toString() && styles.quickOptionTextActive
                  ]}>
                    {val >= 1000 ? `${val/1000} km` : `${val}m`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={onConfirm}
              activeOpacity={0.9}
            >
              <Text style={styles.confirmBtnText}>Confirmer</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  configModal: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  configGradient: {
    padding: 30,
  },
  configTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  configSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 25,
  },
  radiusInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  },
  radiusInput: {
    flex: 1,
    paddingVertical: 16,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  radiusUnit: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '600',
  },
  radiusHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  quickOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  quickOption: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickOptionActive: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  quickOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  quickOptionTextActive: {
    color: '#5a2c1c',
  },
  confirmBtn: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: {
    color: '#5a2c1c',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default ConfigModal;