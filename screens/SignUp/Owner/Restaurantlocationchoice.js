import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,

} from 'react-native';

import { useRestaurantLocationChoice } from '../../../hooks/RegistrationOwner/Userestaurantlocationchoice';

/**
 * RestaurantLocationChoice Component
 * Displays location selection options for restaurant signup
 * Follows SRP by delegating all business logic to custom hook
 */
function RestaurantLocationChoice({ navigation, route }) {
  const {
    latitude,
    longitude,
    address,
    locationMethod,
    locationConfirmed,
    handleGPSLocation,
    handleMapSelection,
    handleContinue,
    handleChangeLocation,
    handleGoBack,
  } = useRestaurantLocationChoice(navigation, route);

  return (
    <View style={styles.container}>
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
            style={styles.logo2}
            resizeMode="contain"
          />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={[styles.progressStep, styles.progressStepActive]} />
            <View style={styles.progressStep} />
            <View style={styles.progressStep} />
          </View>
          <Text style={styles.progressText}>Step 3 of 5</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Restaurant Location</Text>
          <Text style={styles.subtitle}>
            Choose how you'd like to set your restaurant's location
          </Text>
        </View>
        

        {!locationConfirmed ? (
          <View style={styles.optionsContainer}>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleGPSLocation}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../../assets/Icons/map.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Use Current Location</Text>
                <Text style={styles.optionDescription}>
                  Automatically detect your restaurant's location using GPS
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

 
            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleMapSelection}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../../assets/Icons/world-map.png')}
                  style={styles.logo1}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Select on Map</Text>
                <Text style={styles.optionDescription}>
                  Choose your restaurant's location by placing a pin on the map
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>
        ) : (
         
         <View style={styles.confirmedContainer}>
            <Text style={styles.sectionTitle}>GPS Coordinates (WGS84)</Text>
            
            <View style={styles.rowInputs}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Latitude</Text>
                <TextInput
                  style={[styles.input, styles.halfInput, styles.readOnlyInput]}
                  value={latitude}
                  editable={false}
                  placeholder="0.000000"
                  placeholderTextColor="#ccc"
                />
              </View>

              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Longitude</Text>
                <TextInput
                  style={[styles.input, styles.halfInput, styles.readOnlyInput]}
                  value={longitude}
                  editable={false}
                  placeholder="0.000000"
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.changeLocationButton}
              onPress={handleChangeLocation}
            >
              <Text style={styles.changeLocationText}>Change Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
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
    marginTop: 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 45,
    height: 66,
  },
  logo1: {
    width: 50,
    height: 100,
  },
  logo2: {
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginBottom: 25,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 70,
    height: 80,
    borderRadius: 30,
    borderColor:'#c8c8c8',
    borderWidth:1,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  arrow: {
    fontSize: 24,
    color: '#5a2c1c',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  confirmedContainer: {
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
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    fontWeight: '600',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  halfInput: {
    marginBottom: 0,
  },
  changeLocationButton: {
    backgroundColor: '#e3fde4',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0aaf33',
  },
  changeLocationText: {
    color: '#098025',
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#5a2c1c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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

export default RestaurantLocationChoice;