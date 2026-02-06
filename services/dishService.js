import axios from 'axios';
import { API_CONFIG } from '../Api/apiConfig';

const API_URL = API_CONFIG.BASE_URL;

// Service pour les Dishes
export const dishService = {
  /**
   * Récupérer les plats d'une catégorie
   */
  async getDishesByCategory(categoryId) {
    try {
      console.log('📱 Fetching dishes for category:', categoryId);
      const response = await axios.get(`${API_URL}/categories/${categoryId}/dishes`);
      console.log('✅ Dishes fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dishes:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupérer un plat par ID
   */
  async getDishById(dishId) {
    try {
      console.log('📱 Fetching dish:', dishId);
      const response = await axios.get(`${API_URL}/dishes/${dishId}`);
      console.log('✅ Dish fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dish:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Créer un nouveau plat
   */
  async createDish(categoryId, dishData) {
    try {
      console.log('📱 Creating dish for category:', categoryId);
      const response = await axios.post(`${API_URL}/categories/${categoryId}/dishes`, dishData);
      console.log('✅ Dish created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating dish:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Créer plusieurs plats en masse
   */
  async createManyDishes(categoryId, dishes) {
    try {
      console.log('📱 Creating multiple dishes for category:', categoryId);
      console.log('📦 Dishes to create:', dishes);
      const response = await axios.post(
        `${API_URL}/categories/${categoryId}/dishes/bulk`,
        { dishes }
      );
      console.log('✅ Dishes created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating dishes:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Mettre à jour un plat
   */
  async updateDish(dishId, updateData) {
    try {
      console.log('📱 Updating dish:', dishId);
      const response = await axios.patch(`${API_URL}/dishes/${dishId}`, updateData);
      console.log('✅ Dish updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating dish:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Supprimer un plat
   */
  async deleteDish(dishId) {
    try {
      console.log('📱 Deleting dish:', dishId);
      await axios.delete(`${API_URL}/dishes/${dishId}`);
      console.log('✅ Dish deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting dish:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Activer/Désactiver la disponibilité d'un plat
   */
  async toggleDishAvailability(dishId) {
    try {
      console.log('📱 Toggling dish availability:', dishId);
      const response = await axios.patch(`${API_URL}/dishes/${dishId}/toggle-availability`);
      console.log('✅ Dish availability toggled:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error toggling dish availability:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default dishService;