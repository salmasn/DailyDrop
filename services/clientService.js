import axios from 'axios';

// Configuration de base
const API_URL = 'http://192.168.1.14:3000'; // Remplacez par votre IP

const clientService = {
  /**
   * Inscription d'un nouveau client
   */
  register: async (clientData) => {
    try {
      const response = await axios.post(`${API_URL}/clients/register`, {
        fullName: clientData.fullName,
        email: clientData.email,
        password: clientData.password,
      });

      return response.data;
    } catch (error) {
      // Gestion des erreurs
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        // La requête a été envoyée mais pas de réponse
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Erreur lors de la configuration de la requête
        throw new Error('An error occurred during registration');
      }
    }
  },

  /**
   * Récupérer un client par son user_id
   */
  getByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/clients/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch client data');
    }
  },

  /**
   * Récupérer un client par son ID
   */
  getById: async (clientId) => {
    try {
      const response = await axios.get(`${API_URL}/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch client data');
    }
  },

  /**
   * Mettre à jour un client
   */
  update: async (clientId, updateData) => {
    try {
      const response = await axios.patch(`${API_URL}/clients/${clientId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update client');
    }
  },
};

export default clientService; 