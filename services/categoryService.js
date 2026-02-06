import axios from 'axios';
import { API_CONFIG } from '../Api/apiConfig';

const API_URL = API_CONFIG.BASE_URL;

// Service pour les Categories
export const categoryService = {
  /**
   * Récupérer toutes les catégories
   */
  async getAllCategories() {
    try {
      console.log('📱 Fetching all categories...');
      const response = await axios.get(`${API_URL}/categories`);
      console.log('✅ Categories fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching categories:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupérer les catégories d'un restaurant
   */
  async getCategoriesByRestaurant(restaurantId) {
    try {
      console.log('📱 Fetching categories for restaurant:', restaurantId);
      const response = await axios.get(`${API_URL}/categories/restaurant/${restaurantId}`);
      console.log('✅ Restaurant categories fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching restaurant categories:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupérer une catégorie par ID
   */
  async getCategoryById(categoryId) {
    try {
      console.log('📱 Fetching category:', categoryId);
      const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      console.log('✅ Category fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching category by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Créer une nouvelle catégorie
   */
  async createCategory(categoryData) {
    try {
      console.log('📱 Creating category:', categoryData);
      const response = await axios.post(`${API_URL}/categories`, categoryData);
      console.log('✅ Category created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating category:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Créer plusieurs catégories en masse
   */
  async createManyCategories(restaurantId, categories) {
    try {
      console.log('📱 Creating multiple categories for restaurant:', restaurantId);
      console.log('📦 Categories to create:', categories);
      const response = await axios.post(`${API_URL}/categories/bulk`, {
        restaurantId,
        categories,
      });
      console.log('✅ Categories created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating categories:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Mettre à jour une catégorie
   */
  async updateCategory(categoryId, updateData) {
    try {
      console.log('📱 Updating category:', categoryId);
      const response = await axios.put(`${API_URL}/categories/${categoryId}`, updateData);
      console.log('✅ Category updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating category:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Supprimer une catégorie
   */
  async deleteCategory(categoryId) {
    try {
      console.log('📱 Deleting category:', categoryId);
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      console.log('✅ Category deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting category:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Activer/Désactiver une catégorie
   */
  async toggleCategoryActive(categoryId) {
    try {
      console.log('📱 Toggling category active status:', categoryId);
      const response = await axios.put(`${API_URL}/categories/${categoryId}/toggle-active`);
      console.log('✅ Category toggled:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error toggling category:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default categoryService;