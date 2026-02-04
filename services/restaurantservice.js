import axios from 'axios';

// Configuration de base
import { API_CONFIG } from '../Api/apiConfig';
const API_URL = API_CONFIG.BASE_URL; 

const restaurantService = {
  /**
   * GET /restaurants
   * Récupérer tous les restaurants
   */
  findAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/restaurants`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch restaurants');
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error('An error occurred while fetching restaurants');
      }
    }
  },

  /**
   * GET /restaurants/:id
   * Récupérer un restaurant par ID
   */
  findById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch restaurant');
    }
  },

  /**
   * GET /restaurants/owner/:ownerId
   * Récupérer les restaurants d'un propriétaire
   */

  // restaurantService.js
 findByUserId: async (userId) => {
   try {
     const response = await axios.get(`${API_URL}/restaurants/user/${userId}`);
    return response.data;
   } catch (error) {
     throw new Error(error.response?.data?.message || 'Failed to fetch restaurants');
   } 
 },

  /**
   * PUT /restaurants/:id
   * Mettre à jour un restaurant
   */
  update: async (id, updateData) => {
    try {
      const response = await axios.put(`${API_URL}/restaurants/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update restaurant');
    }
  },

  /**
   * PUT /restaurants/:id/status
   * Changer le statut d'un restaurant
   */
  updateStatus: async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/restaurants/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  },

  /**
   * DELETE /restaurants/:id
   * Supprimer un restaurant
   */
  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/restaurants/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete restaurant');
    }
  },
};

export default restaurantService;