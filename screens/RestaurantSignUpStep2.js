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

function RestaurantSignUpStep2({ navigation, route }) {
  const existingData = route?.params?.formData || {};
  
  const [formData, setFormData] = useState({
    restaurantName: existingData.restaurantName || '',
    restaurantAddress: existingData.restaurantAddress || '',
    cuisineType: existingData.cuisineType || '',
    restaurantDescription: existingData.restaurantDescription || '',
  });
  
  const [error, setError] = useState('');

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const validateAndContinue = () => {
    if (!formData.restaurantName || !formData.restaurantAddress || !formData.cuisineType) {
      setError('Please fill in all required fields');
      return;
    }

    // Navigate to step 3 with accumulated data
    navigation.navigate('RestaurantSignUpStep3', {
      formData: { ...existingData, ...formData }
    });
  };

  const goBack = () => {
    navigation.navigate('RestaurantSignUpStep1', {
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
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>
          <Text style={styles.progressText}>Step 2 of 4</Text>
        </View>

        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Restaurant Information</Text>
          <Text style={styles.formSubtitle}>
            Tell us about your restaurant
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>🏠 Basic Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Restaurant name *"
            placeholderTextColor="#999"
            value={formData.restaurantName}
            onChangeText={(text) => updateFormData('restaurantName', text)}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Restaurant address *"
            placeholderTextColor="#999"
            value={formData.restaurantAddress}
            onChangeText={(text) => updateFormData('restaurantAddress', text)}
            multiline
            numberOfLines={2}
          />

          <TextInput
            style={styles.input}
            placeholder="Cuisine type * "
            placeholderTextColor="#999"
            value={formData.cuisineType}
            onChangeText={(text) => updateFormData('cuisineType', text)}
          />

          <Text style={styles.sectionTitle}>📝 Description (Optional)</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell customers about your restaurant..."
            placeholderTextColor="#999"
            value={formData.restaurantDescription}
            onChangeText={(text) => updateFormData('restaurantDescription', text)}
            multiline
            numberOfLines={4}
          />

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
    marginTop:15
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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

export default RestaurantSignUpStep2;