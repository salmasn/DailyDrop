// api/client.js
import axios from 'axios';
import storageService from '../services/storageService'; 

import { API_CONFIG } from './apiConfig';
const API_URL = API_CONFIG.BASE_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await storageService.getToken(); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;