import React from 'react';
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
import { useRestaurantSignUpStep1 } from '../../../hooks/RegistrationOwner/useRestaurantSignUpStep1';


function RestaurantSignUpStep1({ navigation, route }) {
  const {
    formData,
    error,
    updateFormData,
    validateAndContinue,
    handleGoBack,
    handleNavigateToLogin,
  } = useRestaurantSignUpStep1(navigation, route);

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
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>
          <Text style={styles.progressText}>Step 1 of 5</Text>
        </View>

        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Account Information</Text>
          <Text style={styles.formSubtitle}>
            Let's start with your basic details
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Owner Details</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full name *"
            placeholderTextColor="#999"
            value={formData.ownerFullName}
            onChangeText={(text) => updateFormData('ownerFullName', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email address *"
            placeholderTextColor="#999"
            value={formData.ownerEmail}
            onChangeText={(text) => updateFormData('ownerEmail', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone number *"
            placeholderTextColor="#999"
            value={formData.phoneNumber}
            onChangeText={(text) => updateFormData('phoneNumber', text)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor="#999"
            value={formData.ownerPassword}
            onChangeText={(text) => updateFormData('ownerPassword', text)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm password *"
            placeholderTextColor="#999"
            value={formData.ownerConfirmPassword}
            onChangeText={(text) => updateFormData('ownerConfirmPassword', text)}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={validateAndContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue →</Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleNavigateToLogin}>
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

export default RestaurantSignUpStep1;