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
  Alert, // Ajouté pour les erreurs
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // 1. Import de l'outil

function RestaurantSignUpStep2({ navigation, route }) {
  const existingData = route?.params?.formData || {};
  
  const [formData, setFormData] = useState({
    restaurantName: existingData.restaurantName || '',
    restaurantAddress: existingData.restaurantAddress || '',
    cuisineType: existingData.cuisineType || '',
    restaurantDescription: existingData.restaurantDescription || '',
    restaurantImage: existingData.restaurantImage || null, // 2. Ajout dans le state
  });
  
  const [error, setError] = useState('');

  // 3. Fonction pour choisir l'image
  const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission refusée', 'Accès à la galerie nécessaire.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.7,
  });

  if (!result.canceled) {
    const asset = result.assets[0];
    // On stocke l'objet complet pour le futur FormData
    updateFormData('restaurantImage', {
      uri: asset.uri,
      type: 'image/jpeg', // Ou déduire dynamiquement
      name: asset.fileName || `restaurant_${Date.now()}.jpg`,
    });
  }
};

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const validateAndContinue = () => {
    if (!formData.restaurantName || !formData.cuisineType) {
        setError('Veuillez remplir les champs obligatoires');
        return;
    }
    navigation.navigate('RestaurantLocationChoice', {
      formData: { ...existingData, ...formData }
    });
  }

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ... Bouton Back et Logo inchangés ... */}
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {/* ... Barre de progression ... */}
        <View style={styles.progressContainer}>
           <View style={styles.progressBar}>
             <View style={[styles.progressStep, styles.progressStepActive]} />
             <View style={[styles.progressStep, styles.progressStepActive]} />
             <View style={styles.progressStep} />
             <View style={styles.progressStep} />
             <View style={styles.progressStep} />
           </View>
           <Text style={styles.progressText}>Step 2 of 5</Text>
        </View>

        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Restaurant Information</Text>
          <Text style={styles.formSubtitle}>Tell us about your restaurant</Text>
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>
          ) : null}

          <Text style={styles.sectionTitle}>Cover Photo</Text>
          
          {/* 4. Zone d'upload d'image stylisée */}
          <TouchableOpacity 
            style={styles.imageUploadContainer} 
            onPress={pickImage}
            activeOpacity={0.7}
          >
            {formData.restaurantImage ? (
              <View style={styles.imagePreviewContainer}>
               <Image source={{ uri: formData.restaurantImage.uri }} style={styles.imagePreview} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.changeImageText}>Change Photo</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>📸</Text>
                <Text style={styles.imagePlaceholderText}>Upload Restaurant Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Restaurant name *"
            placeholderTextColor="#999"
            value={formData.restaurantName}
            onChangeText={(text) => updateFormData('restaurantName', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Cuisine type * "
            placeholderTextColor="#999"
            value={formData.cuisineType}
            onChangeText={(text) => updateFormData('cuisineType', text)}
          />

          <Text style={styles.sectionTitle}>Description (Optional)</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell customers about your restaurant..."
            placeholderTextColor="#999"
            value={formData.restaurantDescription}
            onChangeText={(text) => updateFormData('restaurantDescription', text)}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.continueButton} onPress={validateAndContinue}>
            <Text style={styles.continueButtonText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ... vos styles existants ...
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  backButton: { marginBottom: 20 },
  backButtonText: { fontSize: 16, color: '#5a2c1c', fontWeight: '600', marginTop:15 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 70, height: 70 },
  progressContainer: { marginBottom: 25 },
  progressBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressStep: { flex: 1, height: 4, backgroundColor: '#e0e0e0', marginHorizontal: 3, borderRadius: 2 },
  progressStepActive: { backgroundColor: '#5a2c1c' },
  progressText: { fontSize: 12, color: '#666', textAlign: 'center' },
  formHeader: { alignItems: 'center', marginBottom: 25 },
  formTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  formSubtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
  formContainer: { backgroundColor: 'white', borderRadius: 20, padding: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#5a2c1c', marginBottom: 15, marginTop: 5 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#e0e0e0' },
  textArea: { height: 80, textAlignVertical: 'top' },
  continueButton: { backgroundColor: '#5a2c1c', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  continueButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  errorContainer: { backgroundColor: '#ffebee', borderRadius: 8, padding: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#f44336' },
  errorText: { color: '#c62828', fontSize: 14, fontWeight: '500' },

  // --- NOUVEAUX STYLES POUR L'IMAGE ---
  imageUploadContainer: {
    width: '100%',
    height: 160,
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed', // Donne un aspect "upload"
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 40,
    marginBottom: 5,
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});

export default RestaurantSignUpStep2;