import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useGPSLocation } from '../../../hooks/RegistrationOwner/Usegpslocation';

function RestaurantGPSLocation({ navigation, route }) {
  const { loading, location, address, error, retry, handleContinue } = useGPSLocation(navigation, route);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>GPS Detection</Text>
        <Text style={styles.subtitle}>
          We are detecting your current position
        </Text>

        <View style={styles.locationCard}>
          {loading ? (
            <LoadingView />
          ) : error ? (
            <ErrorView error={error} onRetry={retry} />
          ) : location ? (
            <SuccessView location={location} address={address} />
          ) : null}
        </View>

        {location && !loading && !error && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Confirm →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Composants de présentation (inchangés)
const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#5a2c1c" />
    <Text style={styles.loadingText}>Detecting...</Text>
  </View>
);

const ErrorView = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

const SuccessView = ({ location, address }) => (
  <View style={styles.successContainer}>
    <Text style={styles.successIcon}>✓</Text>
    <Text style={styles.successTitle}>Location found!</Text>
    
    <View style={styles.locationDetails}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Address:</Text>
        <Text style={styles.detailValue}>{address}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Coordinates:</Text>
        <Text style={styles.detailValue}>
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
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
 
  content: {
    flex: 1,
    marginVertical: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 300,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#5a2c1c',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 60,
    color: '#4caf50',
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  locationDetails: {
    width: '100%',
    marginBottom: 20,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
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

export default RestaurantGPSLocation;