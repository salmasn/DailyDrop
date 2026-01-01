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
  ActivityIndicator,
  Alert,
} from 'react-native';
// import { authService } from '../Api/auth'; // Commented for now

function RestaurantSignUpStep4({ navigation, route }) {
  const existingData = route?.params?.formData || {};
  
  const [formData, setFormData] = useState({
    averagePriceRange: existingData.averagePriceRange || '',
    paymentMethods: existingData.paymentMethods || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSignUp = async () => {
    if (!formData.averagePriceRange) {
      setError('Please enter the average price range');
      return;
    }

    setLoading(true);
    setError('');

    // TODO: Uncomment when backend is ready
    /*
    try {
      // Combine all data from previous steps
      const completeData = { ...existingData, ...formData };
      
      const userData = {
        userType: 'restaurant',
        ownerFullName: completeData.ownerFullName,
        email: completeData.ownerEmail,
        password: completeData.ownerPassword,
        phoneNumber: completeData.phoneNumber,
        restaurantName: completeData.restaurantName,
        restaurantAddress: completeData.restaurantAddress,
        latitude: parseFloat(completeData.latitude),
        longitude: parseFloat(completeData.longitude),
        openingHours: completeData.openingHours,
        pickupTimeWindow: `${completeData.pickupTimeStart} - ${completeData.pickupTimeEnd}`,
        cuisineType: completeData.cuisineType,
        averagePriceRange: completeData.averagePriceRange,
        paymentMethods: completeData.paymentMethods,
        restaurantDescription: completeData.restaurantDescription,
      };
      
      const response = await authService.register(userData);
      console.log('Registration successful:', response);

      Alert.alert(
        'Registration Successful! 🎉',
        'Your restaurant account has been created successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Recommendation') }]
      );
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
      Alert.alert('Registration Error', err.message);
    } finally {
      setLoading(false);
    }
    */

    // Temporary: Navigate directly to Recommendation screen
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Registration Successful! 🎉',
        'Your restaurant account has been created successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Recommendation') }]
      );
    }, 1000);
  };

  const goBack = () => {
    navigation.navigate('RestaurantSignUpStep3', {
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
          disabled={loading}
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
            <View style={[styles.progressStep, styles.progressStepActive]} />
          </View>
          <Text style={styles.progressText}>Step 4 of 4</Text>
        </View>

        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Almost Done!</Text>
          <Text style={styles.formSubtitle}>
            Final details about pricing and payments
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>💰 Pricing Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Average price range * (e.g., 50-100 MAD)"
            placeholderTextColor="#999"
            value={formData.averagePriceRange}
            onChangeText={(text) => updateFormData('averagePriceRange', text)}
            editable={!loading}
          />

          <Text style={styles.helperText}>
            💡 This helps customers know what to expect
          </Text>

          <Text style={styles.sectionTitle}>💳 Payment Methods (Optional)</Text>

          <TextInput
            style={styles.input}
            placeholder="Accepted payment methods (Cash, Card, Online...)"
            placeholderTextColor="#999"
            value={formData.paymentMethods}
            onChangeText={(text) => updateFormData('paymentMethods', text)}
            editable={!loading}
          />

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>📋 Registration Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Owner:</Text>
              <Text style={styles.summaryValue}>{existingData.ownerFullName}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Restaurant:</Text>
              <Text style={styles.summaryValue}>{existingData.restaurantName}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Cuisine:</Text>
              <Text style={styles.summaryValue}>{existingData.cuisineType}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pickup:</Text>
              <Text style={styles.summaryValue}>
                {existingData.pickupTimeStart} - {existingData.pickupTimeEnd}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSignUp}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Create Restaurant Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our terms of service and privacy policy
            </Text>
          </View>
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
  helperText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
    marginTop: -10,
    fontStyle: 'italic',
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a2c1c',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#5a2c1c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#441a0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#9e9e9e',
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default RestaurantSignUpStep4;