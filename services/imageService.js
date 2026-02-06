import axios from 'axios';
import { API_CONFIG } from '../Api/apiConfig';
import * as ImageManipulator from 'expo-image-manipulator';

const API_URL = API_CONFIG.BASE_URL;

// Service pour uploader les images
export const imageService = {
  /**
   * Compresser une image avant upload
   */
  async compressImage(uri, quality = 0.6, maxWidth = 800) {
    try {
      console.log('🔧 Compressing image...');
      console.log('📏 Original URI:', uri);

      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth } }],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      console.log('✅ Image compressed');
      console.log('📏 Compressed URI:', manipResult.uri);
      
      return manipResult.uri;
    } catch (error) {
      console.error('❌ Error compressing image:', error);
      throw error;
    }
  },

  /**
   * Convertir une URI en base64
   */
  async uriToBase64(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting URI to base64:', error);
      throw error;
    }
  },

    /**
     * Upload une image de plat
     */
    async uploadDishImage(uri) {
    try {
        console.log('📤 Starting dish image upload for URI:', uri);
        
        // Compresser l'image
        const compressedUri = await imageService.compressImage(uri, 0.6, 800);
        
        // Convertir en base64
        const base64 = await imageService.uriToBase64(compressedUri);
        
        console.log('📤 Base64 length:', base64?.length);
        console.log('📤 Sending to backend...');
        
        // Envoyer au backend - NOUVEAU ENDPOINT
        const response = await axios.post(
        `${API_URL}/dishes/upload-image-base64`,
        { image: base64 },
        {
            headers: {
            'Content-Type': 'application/json',
            },
            timeout: 30000,
        }
        );

        console.log('✅ Dish image uploaded successfully:', response.data.imageUrl);
        return response.data.imageUrl;
    } catch (error) {
        console.error('❌ Error uploading dish image:', error.response?.data || error.message);
        throw error;
    }
    },

  /**
   * Upload une image (avec compression automatique)
   */
  async uploadImage(uri) {
    try {
      console.log('📤 Starting image upload for URI:', uri);
      
      // Compresser l'image
      const compressedUri = await imageService.compressImage(uri, 0.6, 800);
      
      // Convertir en base64
      const base64 = await imageService.uriToBase64(compressedUri);
      
      console.log('📤 Base64 length:', base64?.length);
      console.log('📤 Sending to backend...');
      
      // Envoyer au backend
      const response = await axios.post(
        `${API_URL}/categories/upload-image-base64`,
        { image: base64 },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      console.log('✅ Image uploaded successfully:', response.data.imageUrl);
      return response.data.imageUrl;
    } catch (error) {
      console.error('❌ Error uploading image:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Convertir une URI locale en Blob
   */
  async uriToBlob(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error converting URI to blob:', error);
      throw error;
    }
  },
};

export default imageService;