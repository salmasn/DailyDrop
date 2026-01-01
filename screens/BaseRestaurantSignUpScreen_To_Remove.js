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
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { authService } from '../Api/auth';

function RestaurantSignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    ownerFullName: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerConfirmPassword: '',
    phoneNumber: '',
    restaurantName: '',
    restaurantAddress: '',
    latitude: '',
    longitude: '',
    openingHours: '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    cuisineType: '',
    averagePriceRange: '',
    paymentMethods: '',
    restaurantDescription: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.ownerFullName || !formData.ownerEmail || !formData.ownerPassword || 
        !formData.phoneNumber || !formData.restaurantName || !formData.restaurantAddress || 
        !formData.latitude || !formData.longitude || !formData.openingHours || 
        !formData.pickupTimeStart || !formData.pickupTimeEnd || !formData.cuisineType || 
        !formData.averagePriceRange) {
      setError('Please fill in all required fields (*)');
      return false;
    }

    if (formData.ownerPassword !== formData.ownerConfirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.ownerPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.ownerEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validation latitude and longitude
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Invalid latitude (must be between -90 and 90)');
      return false;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Invalid longitude (must be between -180 and 180)');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const userData = {
        userType: 'restaurant',
        ownerFullName: formData.ownerFullName,
        email: formData.ownerEmail,
        password: formData.ownerPassword,
        phoneNumber: formData.phoneNumber,
        restaurantName: formData.restaurantName,
        restaurantAddress: formData.restaurantAddress,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        openingHours: formData.openingHours,
        pickupTimeWindow: `${formData.pickupTimeStart} - ${formData.pickupTimeEnd}`,
        cuisineType: formData.cuisineType,
        averagePriceRange: formData.averagePriceRange,
        paymentMethods: formData.paymentMethods,
        restaurantDescription: formData.restaurantDescription,
      };
      
      const response = await authService.register(userData);
      console.log('Registration successful:', response);

      Alert.alert(
        'Registration Successful! 🎉',
        'Your restaurant account has been created successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
      Alert.alert('Registration Error', err.message);
    } finally {
      setLoading(false);
    }
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
          onPress={() => navigation.goBack()}
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

        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Restaurant Registration</Text>
          <Text style={styles.formSubtitle}>
            Manage and publish daily offers
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>🔐 Account Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Owner full name *"
            placeholderTextColor="#999"
            value={formData.ownerFullName}
            onChangeText={(text) => updateFormData('ownerFullName', text)}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#999"
            value={formData.ownerEmail}
            onChangeText={(text) => updateFormData('ownerEmail', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor="#999"
            value={formData.ownerPassword}
            onChangeText={(text) => updateFormData('ownerPassword', text)}
            secureTextEntry
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            placeholderTextColor="#999"
            value={formData.ownerConfirmPassword}
            onChangeText={(text) => updateFormData('ownerConfirmPassword', text)}
            secureTextEntry
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone number *"
            placeholderTextColor="#999"
            value={formData.phoneNumber}
            onChangeText={(text) => updateFormData('phoneNumber', text)}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <Text style={styles.sectionTitle}>🏠 Restaurant Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Restaurant name *"
            placeholderTextColor="#999"
            value={formData.restaurantName}
            onChangeText={(text) => updateFormData('restaurantName', text)}
            editable={!loading}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Restaurant address *"
            placeholderTextColor="#999"
            value={formData.restaurantAddress}
            onChangeText={(text) => updateFormData('restaurantAddress', text)}
            multiline
            numberOfLines={2}
            editable={!loading}
          />

          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Latitude *"
              placeholderTextColor="#999"
              value={formData.latitude}
              onChangeText={(text) => updateFormData('latitude', text)}
              keyboardType="decimal-pad"
              editable={!loading}
            />

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Longitude *"
              placeholderTextColor="#999"
              value={formData.longitude}
              onChangeText={(text) => updateFormData('longitude', text)}
              keyboardType="decimal-pad"
              editable={!loading}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Opening hours * (e.g., 09:00 - 22:00)"
            placeholderTextColor="#999"
            value={formData.openingHours}
            onChangeText={(text) => updateFormData('openingHours', text)}
            editable={!loading}
          />

          <Text style={styles.sectionTitle}>⏰ Operational Information</Text>

          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Pickup start * (18:00)"
              placeholderTextColor="#999"
              value={formData.pickupTimeStart}
              onChangeText={(text) => updateFormData('pickupTimeStart', text)}
              editable={!loading}
            />

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Pickup end * (22:00)"
              placeholderTextColor="#999"
              value={formData.pickupTimeEnd}
              onChangeText={(text) => updateFormData('pickupTimeEnd', text)}
              editable={!loading}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Cuisine type * (italian, local, fast food...)"
            placeholderTextColor="#999"
            value={formData.cuisineType}
            onChangeText={(text) => updateFormData('cuisineType', text)}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Average price range * (e.g., 50-100 MAD)"
            placeholderTextColor="#999"
            value={formData.averagePriceRange}
            onChangeText={(text) => updateFormData('averagePriceRange', text)}
            editable={!loading}
          />

          <Text style={styles.sectionTitle}>💳 Practical Information (optional)</Text>

          <TextInput
            style={styles.input}
            placeholder="Payment methods (cash, online, card...)"
            placeholderTextColor="#999"
            value={formData.paymentMethods}
            onChangeText={(text) => updateFormData('paymentMethods', text)}
            editable={!loading}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Restaurant description"
            placeholderTextColor="#999"
            value={formData.restaurantDescription}
            onChangeText={(text) => updateFormData('restaurantDescription', text)}
            multiline
            numberOfLines={4}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signUpButtonText}>Create Restaurant Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our terms of service and privacy policy
            </Text>
          </View>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTypeEmoji: {
    fontSize: 45,
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
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
    marginTop: 10,
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
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  signUpButton: {
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
  signUpButtonDisabled: {
    backgroundColor: '#9e9e9e',
    opacity: 0.7,
  },
  signUpButtonText: {
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
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#5a2c1c',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RestaurantSignUpScreen;