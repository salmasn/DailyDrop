import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

/**
 * Composant pour uploader l'image du plat
 */
const ImageUpload = ({ dishImage, onSelectImage }) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.formLabel}>Image du plat</Text>
      <TouchableOpacity 
        style={styles.imageUploadButton}
        onPress={onSelectImage}
      >
        {dishImage ? (
          <View style={styles.imagePreview}>
            <Image 
              source={{ uri: dishImage }} 
              style={styles.uploadedImage}
            />
          </View>
        ) : (
          <>
            <Image
              source={require('../../../assets/Icons/add.png')}
              style={styles.uploadIcon}
              resizeMode="contain"
            />
            <Text style={styles.uploadText}>Ajouter une image</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  uploadIcon: {
    width: 40,
    height: 40,
    tintColor: '#999',
    marginBottom: 8,
  },
  uploadText: {
    color: '#999',
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});

export default ImageUpload;