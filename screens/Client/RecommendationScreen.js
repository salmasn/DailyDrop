import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../../components/Owner/ScreenHeader';

const { width, height } = Dimensions.get('window');

function RecommendationScreen({ navigation }) {
  const [showMotivationModal, setShowMotivationModal] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  const handleTrackRestaurants = () => {
    setShowMotivationModal(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleContinueToMap = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowMotivationModal(false);
      navigation.navigate('TrackRestaurants');
    });
  };

  const handleCloseModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowMotivationModal(false);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5a2c1c" />
      
      {/* Header avec ScreenHeader */}
      <ScreenHeader
        title="DailyDrop"
        subtitle="Discover amazing deals"
        rightAction={handleTrackRestaurants}
        rightIcon="🗺️"
        avatarSource={require('../../assets/images/avatar.png')}
        backgroundColor="#5a2c1c"
      />

      {/* Contenu principal - Maintenant scrollable */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >


        {/* ✅ NOUVEAU : GROS BOUTON CARTE */}
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={handleTrackRestaurants}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#d16004', '#5f3604']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mapButtonGradient}
            >
              <Text style={styles.mapButtonText}>Explore Restaurants Map</Text>
            </LinearGradient>
          </TouchableOpacity>


        <View style={styles.content}>
          <Text style={styles.welcomeEmoji}>🍽️</Text>
          <Text style={styles.welcomeTitle}>Welcome to DailyDrop!</Text>
          <Text style={styles.welcomeSubtitle}>
            Your daily destination for amazing food deals
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>💰</Text>
              <Text style={styles.featureText}>Save up to 50%</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>⏰</Text>
              <Text style={styles.featureText}>Real-time offers</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🗺️</Text>
              <Text style={styles.featureText}>Find nearby</Text>
            </View>
          </View>

          <Text style={styles.comingSoon}>More features coming soon...</Text>
        </View>
      </ScrollView>

      {/* Modal de Motivation */}
      <Modal
        visible={showMotivationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={['#3c1d04', '#824104']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalGradient}
            >
              {/* Icône animée */}
              <View style={styles.modalIconContainer}>
                <Text style={styles.modalIcon}>🎯</Text>
              </View>

              {/* Titre */}
              <Text style={styles.modalTitle}>Discover Hidden Gems!</Text>

              {/* Description motivante */}
              <Text style={styles.modalDescription}>
                Explore restaurants around you offering exclusive deals in real-time. 
                Never miss a chance to save on delicious meals nearby! 🍕🍔🥗
              </Text>

              {/* Points clés */}
              <View style={styles.benefitsContainer}>
                <View style={styles.benefitRow}>
                  <Text style={styles.benefitIcon}>📍</Text>
                  <Text style={styles.benefitText}>See restaurants on interactive map</Text>
                </View>
                <View style={styles.benefitRow}>
                  <Text style={styles.benefitIcon}>⚡</Text>
                  <Text style={styles.benefitText}>Get instant price reductions</Text>
                </View>
                <View style={styles.benefitRow}>
                  <Text style={styles.benefitIcon}>🎁</Text>
                  <Text style={styles.benefitText}>Choose your search radius</Text>
                </View>
              </View>

              {/* Boutons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinueToMap}
                  activeOpacity={0.9}
                >
                  <Text style={styles.continueButtonText}>Let's Explore! 🚀</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Maybe Later</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Content
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
    marginTop:40,
  },
  welcomeEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 100,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },

  mapButton: {
    width: '65%',
    position :'absolute',
    right:0,
    marginTop: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#e9e9e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mapButtonGradient: {
    borderRadius: 20,
    paddingVertical: 7,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  mapButtonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mapButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  comingSoon: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalGradient: {
    padding: 30,
  },
  modalIconContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  benefitsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    flex: 1,
  },
  modalButtons: {
    gap: 12,
  },
  continueButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: '#5f3604',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default RecommendationScreen;