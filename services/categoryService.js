import axios from 'axios';
import { API_CONFIG } from '../Api/apiConfig';

const API_URL = API_CONFIG.BASE_URL; 

// Service pour les Meals
export const mealService = {
  async getAllMeals() {
    try {
      const response = await axios.get(`${API_URL}/meals`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }
  },

  async createMeal(mealData) {
    try {
      const response = await axios.post(`${API_URL}/meals`, mealData);
      return response.data;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  },

  async seedDefaultMeals() {
    try {
      const response = await axios.post(`${API_URL}/meals/seed`);
      return response.data;
    } catch (error) {
      console.error('Error seeding meals:', error);
      throw error;
    }
  },
};

// Service pour les Categories
export const categoryService = {
  async getAllCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getCategoriesByRestaurant(restaurantId) {
    try {
      const response = await axios.get(`${API_URL}/categories/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant categories:', error);
      throw error;
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await axios.post(`${API_URL}/categories`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async createManyCategories(restaurantId, categories) {
    try {
      console.log('📤 Sending to backend:', { restaurantId, categories });
      const response = await axios.post(`${API_URL}/categories/bulk`, {
        restaurantId,
        categories,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating categories:', error);
      throw error;
    }
  },

  async updateCategory(categoryId, updateData) {
    try {
      const response = await axios.put(`${API_URL}/categories/${categoryId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(categoryId) {
    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  async toggleCategoryActive(categoryId) {
    try {
      const response = await axios.put(`${API_URL}/categories/${categoryId}/toggle-active`);
      return response.data;
    } catch (error) {
      console.error('Error toggling category:', error);
      throw error;
    }
  },
};

// Service pour uploader les images
export const imageService = {
  /**
   * Upload une image vers le backend (qui l'upload ensuite vers Supabase)
   */
  async uploadImage(uri) {
    try {
      console.log('📤 Starting image upload for URI:', uri);
      
      // Convertir l'URI en base64 directement
      const base64 = await imageService.uriToBase64(uri);
      
      console.log('📤 Base64 conversion complete, length:', base64?.length);
      console.log('📤 Sending to backend...');
      
      // Envoyer au backend
      const response = await axios.post(
        `${API_URL}/categories/upload-image-base64`, 
        { image: base64 },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 secondes
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
   * Convertir une URI locale directement en base64
   */
  async uriToBase64(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // Retourne data:image/jpeg;base64,/9j/4AAQ...
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
   * Convertir une URI locale en Blob (ancienne méthode, gardée pour compatibilité)
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

export default {
  mealService,
  categoryService,
  imageService,
};