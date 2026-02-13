// services/authService.js
import storageService from "./storageService";
import apiClient from "../Api/auth";

const authService = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    console.log(response.data.access_token);
    return response.data;
  },

  logout: async () => {
    try {
      console.log('Début déconnexion...');
      
      try {
        await apiClient.post("/auth/logout");
        console.log('Appel API logout réussi');
      } catch (error) {
        console.log('Erreur API logout (ignorée):', error.message);
      }

      await storageService.clearAll();
      
      console.log('Déconnexion locale terminée');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

};

export default authService;