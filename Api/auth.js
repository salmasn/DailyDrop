// api/client.js
import axios from 'axios';
import storageService from '../services/storageService'; // 👈 Importe ton service

const API_URL = 'http://192.168.0.5:3000'; // Remplace par l'URL de ton APIs

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
      const token = await storageService.getToken(); // 👈 Utilise ton service
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