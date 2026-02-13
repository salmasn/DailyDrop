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
import { useRestaurantStep3Form } from '../../../hooks/RegistrationOwner/Userestaurantstep3form';

function RestaurantSignUpStep3({ navigation, route }) {
  const existingData = route?.params?.formData || {};
  const { formData, error, updateField, getCompleteData } = useRestaurantStep3Form(existingData);

  const handleContinue = () => {
    navigation.navigate('RestaurantSignUpStep4', {
      formData: getCompleteData()
    });
  };

  const handleBack = () => {
  navigation.navigate('RestaurantLocationChoice', {
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
        <BackButton onPress={handleBack} />
        <Logo />
        <ProgressBar step={4} total={5} />
        <FormHeader 
          title="Opening Hours"
          subtitle="Set your working hours"
        />

        <View style={styles.formContainer}>
          {error && <ErrorMessage message={error} />}

          <HoursSection
            openingHours={formData.openingHours}
            pickupTimeStart={formData.pickupTimeStart}
            pickupTimeEnd={formData.pickupTimeEnd}
            onUpdateField={updateField}
          />

          <ContinueButton onPress={handleContinue} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Composants de présentation réutilisables
const BackButton = ({ onPress }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
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

const HoursSection = ({ 
  openingHours, 
  pickupTimeStart, 
  pickupTimeEnd, 
  onUpdateField 
}) => (
  <>
    <Text style={styles.sectionTitle}>Opening Hours</Text>
    <TextInput
      style={styles.input}
      placeholder="Ex: 09:00 - 22:00"
      placeholderTextColor="#999"
      value={openingHours}
      onChangeText={(text) => onUpdateField('openingHours', text)}
    />

    <Text style={styles.sectionTitle}>Pickup Window</Text>
    <View style={styles.rowInputs}>
      <View style={styles.halfInputContainer}>
        <Text style={styles.inputLabel}>Start Time *</Text>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="09:00"
          placeholderTextColor="#999"
          value={pickupTimeStart}
          onChangeText={(text) => onUpdateField('pickupTimeStart', text)}
        />
      </View>

      <View style={styles.halfInputContainer}>
        <Text style={styles.inputLabel}>End Time *</Text>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="18:00"
          placeholderTextColor="#999"
          value={pickupTimeEnd}
          onChangeText={(text) => onUpdateField('pickupTimeEnd', text)}
        />
      </View>
    </View>

    <Text style={styles.helperText}>
      When can customers pick up their orders?
    </Text>
  </>
);

const ContinueButton = ({ onPress }) => (
  <TouchableOpacity
    style={styles.continueButton}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.continueButtonText}>Continue →</Text>
  </TouchableOpacity>
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
    marginTop: 15,
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
    padding: 20,
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
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
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
  halfInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  halfInput: {
    marginBottom: 0,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
    marginTop: 5,
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