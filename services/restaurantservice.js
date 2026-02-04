// services/restaurantService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



import { API_CONFIG } from '../Api/apiConfig';
const API_URL = API_CONFIG.BASE_URL;


// Instance Axios configurée
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré - déconnexion automatique
      await AsyncStorage.removeItem('userToken');
      // Navigation vers login (à implémenter selon votre navigation)
    }
    return Promise.reject(error);
  }
);

/**
 * Service de gestion des restaurants
 */
class RestaurantService {
  
  // ═══════════════════════════════════════════════════════════════
  // RÉCUPÉRATION DES RESTAURANTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Récupérer tous les restaurants
   * @returns {Promise<Array>}
   */
  async getAllRestaurants() {
    try {
      const response = await apiClient.get('/restaurants');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer un restaurant par ID
   * @param {string} restaurantId 
   * @returns {Promise<Object>}
   */
  async getRestaurantById(restaurantId) {
    try {
      const response = await apiClient.get(`/restaurants/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du restaurant:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les restaurants dans un rayon géographique
   * @param {number} latitude - Latitude de l'utilisateur
   * @param {number} longitude - Longitude de l'utilisateur
   * @param {number} radius - Rayon en mètres (défaut: 5000)
   * @returns {Promise<Array>}
   */
  async getRestaurantsNearby(latitude, longitude, radius = 5000) {
    try {
      const response = await apiClient.get('/restaurants/nearby', {
        params: {
          latitude,
          longitude,
          radius,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants à proximité:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les restaurants avec offres actives
   * @param {number} latitude 
   * @param {number} longitude 
   * @param {number} radius 
   * @returns {Promise<Array>}
   */
  async getRestaurantsWithActiveOffers(latitude, longitude, radius = 5000) {
    try {
      const response = await apiClient.get('/restaurants/nearby/with-offers', {
        params: {
          latitude,
          longitude,
          radius,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants avec offres:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Rechercher des restaurants par critères
   * @param {Object} filters - Filtres de recherche
   * @param {string} filters.cuisineType - Type de cuisine
   * @param {string} filters.search - Recherche textuelle
   * @param {number} filters.minPrice - Prix minimum
   * @param {number} filters.maxPrice - Prix maximum
   * @returns {Promise<Array>}
   */
  async searchRestaurants(filters = {}) {
    try {
      const response = await apiClient.get('/restaurants/search', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de restaurants:', error);
      throw this.handleError(error);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // GESTION DES OFFRES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Récupérer toutes les offres d'un restaurant
   * @param {string} restaurantId 
   * @returns {Promise<Array>}
   */
  async getRestaurantOffers(restaurantId) {
    try {
      const response = await apiClient.get(`/restaurants/${restaurantId}/offers`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les offres actives d'un restaurant
   * @param {string} restaurantId 
   * @returns {Promise<Array>}
   */
  async getActiveOffers(restaurantId) {
    try {
      const response = await apiClient.get(`/restaurants/${restaurantId}/offers/active`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres actives:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Vérifier la disponibilité d'une offre
   * @param {string} offerId 
   * @returns {Promise<Object>}
   */
  async checkOfferAvailability(offerId) {
    try {
      const response = await apiClient.get(`/offers/${offerId}/availability`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      throw this.handleError(error);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // GESTION DES FAVORIS (OPTIONNEL)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Ajouter un restaurant aux favoris
   * @param {string} restaurantId 
   * @returns {Promise<Object>}
   */
  async addToFavorites(restaurantId) {
    try {
      const response = await apiClient.post('/favorites', { restaurantId });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Retirer un restaurant des favoris
   * @param {string} restaurantId 
   * @returns {Promise<void>}
   */
  async removeFromFavorites(restaurantId) {
    try {
      await apiClient.delete(`/favorites/${restaurantId}`);
    } catch (error) {
      console.error('Erreur lors du retrait des favoris:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les restaurants favoris
   * @returns {Promise<Array>}
   */
  async getFavorites() {
    try {
      const response = await apiClient.get('/favorites');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw this.handleError(error);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTIQUES ET ANALYTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Incrémenter le compteur de vues d'un restaurant
   * @param {string} restaurantId 
   * @returns {Promise<void>}
   */
  async incrementViews(restaurantId) {
    try {
      await apiClient.post(`/restaurants/${restaurantId}/view`);
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      // Ne pas bloquer l'application si cette requête échoue
    }
  }

  /**
   * Signaler un clic sur une offre
   * @param {string} offerId 
   * @returns {Promise<void>}
   */
  async trackOfferClick(offerId) {
    try {
      await apiClient.post(`/offers/${offerId}/track-click`);
    } catch (error) {
      console.error('Erreur lors du tracking:', error);
      // Ne pas bloquer l'application
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Calculer la distance entre deux points
   * @param {number} lat1 
   * @param {number} lon1 
   * @param {number} lat2 
   * @param {number} lon2 
   * @returns {number} Distance en mètres
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * Vérifier si une offre est disponible maintenant
   * @param {Object} offer 
   * @returns {boolean}
   */
  isOfferAvailableNow(offer) {
    const now = new Date();
    const currentDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return offer.timeslots.some(slot => {
      // Gérer les plages de jours
      const days = slot.day.includes('-') 
        ? slot.day.split('-') 
        : [slot.day];
      
      const isDayMatch = days.length === 1 
        ? days[0] === currentDay
        : ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
            .slice(
              ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(days[0]),
              ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(days[1]) + 1
            ).includes(currentDay);

      if (!isDayMatch) return false;

      // Vérifier l'heure
      const [startHour, startMin] = slot.start_time.split(':').map(Number);
      const [endHour, endMin] = slot.end_time.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      return currentTime >= startTime && currentTime <= endTime;
    });
  }

  /**
   * Filtrer les restaurants par distance
   * @param {Array} restaurants 
   * @param {number} userLat 
   * @param {number} userLon 
   * @param {number} maxDistance 
   * @returns {Array}
   */
  filterByDistance(restaurants, userLat, userLon, maxDistance) {
    return restaurants
      .map(restaurant => ({
        ...restaurant,
        distance: this.calculateDistance(
          userLat,
          userLon,
          restaurant.location.latitude,
          restaurant.location.longitude
        ),
      }))
      .filter(restaurant => restaurant.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Gestion des erreurs
   * @param {Error} error 
   * @returns {Object}
   */
  handleError(error) {
    if (error.response) {
      // Erreur de réponse du serveur
      return {
        message: error.response.data?.message || 'Une erreur est survenue',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Pas de réponse du serveur
      return {
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        status: 0,
      };
    } else {
      // Autre erreur
      return {
        message: error.message || 'Une erreur inattendue est survenue',
        status: -1,
      };
    }
  }
}

// Export d'une instance unique
export default new RestaurantService();