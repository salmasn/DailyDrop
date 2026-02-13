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
  ActivityIndicator,
} from 'react-native';
import { useRestaurantRegistration } from '../../../hooks/RegistrationOwner/Userestaurantregistration';

function RestaurantSignUpStep4({ navigation, route }) {
  const existingData = route?.params?.formData || {};
  
  const { 
    formData, 
    loading, 
    error, 
    updateField, 
    handleRegistration,
    getCompleteData 
  } = useRestaurantRegistration(existingData);

  const onSignUp = async () => {
    await handleRegistration(() => navigation.replace('Login'));
  };

  const handleBack = () => {
    navigation.navigate('RestaurantSignUpStep3', {
      formData: getCompleteData()
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
        <BackButton onPress={handleBack} disabled={loading} />
        <Logo />
        <ProgressBar step={5} total={5} />
        <FormHeader 
          title="Almost Done!"
          subtitle="Final details about pricing and payments"
        />

        <View style={styles.formContainer}>
          {error && <ErrorMessage message={error} />}

          <PricingSection
            averagePriceRange={formData.averagePriceRange}
            paymentMethods={formData.paymentMethods}
            onUpdateField={updateField}
            disabled={loading}
          />

          <RegistrationSummary existingData={existingData} />

          <SubmitButton onPress={onSignUp} loading={loading} />

          <TermsNotice />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Composants de présentation réutilisables
const BackButton = ({ onPress, disabled }) => (
  <TouchableOpacity 
    style={styles.backButton} 
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.backButtonText}>← Back</Text>
  </TouchableOpacity>
);

const Logo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('../../../assets/images/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const ProgressBar = ({ step, total }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressStep,
            index < step && styles.progressStepActive
          ]}
        />
      ))}
    </View>
    <Text style={styles.progressText}>Step {step} of {total}</Text>
  </View>
);

const FormHeader = ({ title, subtitle }) => (
  <View style={styles.formHeader}>
    <Text style={styles.formTitle}>{title}</Text>
    <Text style={styles.formSubtitle}>{subtitle}</Text>
  </View>
);

const ErrorMessage = ({ message }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const PricingSection = ({ 
  averagePriceRange, 
  paymentMethods, 
  onUpdateField, 
  disabled 
}) => (
  <>
    <Text style={styles.sectionTitle}>Pricing Information</Text>
    <TextInput
      style={styles.input}
      placeholder="price range * (e.g., 50-100 MAD)"
      placeholderTextColor="#999"
      value={averagePriceRange}
      onChangeText={(text) => onUpdateField('averagePriceRange', text)}
      editable={!disabled}
    />
    <Text style={styles.helperText}>
      This helps customers know what to expect
    </Text>

    <Text style={styles.sectionTitle}>Payment Methods (Optional)</Text>
    <TextInput
      style={styles.input}
      placeholder="(Cash, Card, Online...)"
      placeholderTextColor="#999"
      value={paymentMethods}
      onChangeText={(text) => onUpdateField('paymentMethods', text)}
      editable={!disabled}
    />
  </>
);

const RegistrationSummary = ({ existingData }) => (
  <View style={styles.summaryContainer}>
    <Text style={styles.summaryTitle}>Registration Summary</Text>
    <SummaryItem label="Owner:" value={existingData.ownerFullName} />
    <SummaryItem label="Restaurant:" value={existingData.restaurantName} />
    <SummaryItem label="Cuisine:" value={existingData.cuisineType} />
    <SummaryItem 
      label="Pickup:" 
      value={`${existingData.pickupTimeStart} - ${existingData.pickupTimeEnd}`} 
    />
  </View>
);

const SummaryItem = ({ label, value }) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const SubmitButton = ({ onPress, loading }) => (
  <TouchableOpacity
    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <Text style={styles.submitButtonText}>Create Restaurant Account</Text>
    )}
  </TouchableOpacity>
);

const TermsNotice = () => (
  <View style={styles.termsContainer}>
    <Text style={styles.termsText}>
      By signing up, you agree to our terms of service and privacy policy
    </Text>
  </View>
);

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