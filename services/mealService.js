import axios from 'axios';
import { API_CONFIG } from '../Api/apiConfig';

const API_URL = API_CONFIG.BASE_URL;

// Service pour les Meals
export const mealService = {
  /**
   * Récupérer tous les meals
   */
  async getAllMeals() {
    try {
      console.log('📱 Fetching all meals...');
      const response = await axios.get(`${API_URL}/meals`);
      console.log('✅ Meals fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching meals:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Créer un nouveau meal
   */
  async createMeal(mealData) {
    try {
      console.log('📱 Creating meal:', mealData);
      const response = await axios.post(`${API_URL}/meals`, mealData);
      console.log('✅ Meal created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating meal:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Seed les meals par défaut
   */
  async seedDefaultMeals() {
    try {
      console.log('📱 Seeding default meals...');
      const response = await axios.post(`${API_URL}/meals/seed`);
      console.log('✅ Meals seeded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error seeding meals:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Mettre à jour un meal
   */
  async updateMeal(mealId, updateData) {
    try {
      console.log('📱 Updating meal:', mealId);
      const response = await axios.put(`${API_URL}/meals/${mealId}`, updateData);
      console.log('✅ Meal updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating meal:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Supprimer un meal
   */
  async deleteMeal(mealId) {
    try {
      console.log('📱 Deleting meal:', mealId);
      await axios.delete(`${API_URL}/meals/${mealId}`);
      console.log('✅ Meal deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting meal:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default mealService;