import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

function RestaurantSignUpStep3({ navigation, route }) {
  const existingData = route?.params?.formData || {};
  
  const [formData, setFormData] = useState({
    openingHours: existingData.openingHours || '',
    pickupTimeStart: existingData.pickupTimeStart || '',
    pickupTimeEnd: existingData.pickupTimeEnd || '',
  });
  
  const [error, setError] = useState('');

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const validateAndContinue = () => {
    if (!formData.openingHours || !formData.pickupTimeStart || !formData.pickupTimeEnd) {
      setError('Please fill in all required fields');
      return;
    }

    // Navigate to step 4 with accumulated data
    navigation.navigate('RestaurantSignUpStep4', {
      formData: { ...existingData, ...formData }
    });
  };

  const goBack = () => {
    navigation.navigate('RestaurantSignUpStep2', {
      formData: { ...existingData, ...formData }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={styles.progressStep} />
          </View>
          <Text style={styles.progressText}>Step 3 of 4</Text>
        </View>

        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Operating Hours</Text>
          <Text style={styles.formSubtitle}>
            When can customers find you?
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>⏰ Operating Hours</Text>

          <TextInput
            style={styles.input}
            placeholder="Opening hours * (e.g., 09:00 - 22:00)"
            placeholderTextColor="#999"
            value={formData.openingHours}
            onChangeText={(text) => updateFormData('openingHours', text)}
          />

          <Text style={styles.subSectionTitle}>Pickup Time Window</Text>

          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Start time *"
              placeholderTextColor="#999"
              value={formData.pickupTimeStart}
              onChangeText={(text) => updateFormData('pickupTimeStart', text)}
            />

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="End time *"
              placeholderTextColor="#999"
              value={formData.pickupTimeEnd}
              onChangeText={(text) => updateFormData('pickupTimeEnd', text)}
            />
          </View>

          <Text style={styles.helperText}>
            ⏱️ When can customers pick up their orders?
          </Text>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={validateAndContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5a2c1c',
    fontWeight: '600',
    marginTop: 15
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
  },
  progressContainer: {
    marginBottom: 25,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#5a2c1c',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a2c1c',
    marginBottom: 15,
    marginTop: 5,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    marginTop: 5,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
    marginTop: -10,
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#5a2c1c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#441a0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RestaurantSignUpStep3;