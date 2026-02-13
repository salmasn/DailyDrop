/*import axios from 'axios';

// Configuration de l'URL de base de votre API
import { API_CONFIG } from '../Api/apiConfig';
const API_BASE_URL = API_CONFIG.BASE_URL; 

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Service pour gérer les requêtes relatives aux restaurants

class RestaurantsApiService {
  /**
   * Récupérer tous les restaurants depuis le JSON
   
  async getAllRestaurantsFromJson() {
    try {
      const response = await api.get('/restaurants/json');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur getAllRestaurantsFromJson:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Récupérer un restaurant par ID depuis le JSON

  async getRestaurantByIdFromJson(id) {
    try {
      const response = await api.get(`/restaurants/json/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur getRestaurantByIdFromJson:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Récupérer uniquement les restaurants avec des offres actives
  
  async getRestaurantsWithOffers() {
    try {
      const response = await api.get('/restaurants/json/offers/active');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur getRestaurantsWithOffers:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Récupérer les restaurants par type de cuisine
  
  async getRestaurantsByCuisine(cuisineType) {
    try {
      const response = await api.get(`/restaurants/json/cuisine/${cuisineType}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur getRestaurantsByCuisine:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  
  async getNearbyRestaurants(latitude, longitude, radius = 5000) {
    try {
      const response = await api.get('/restaurants/json/nearby', {
        params: {
          latitude,
          longitude,
          radius,
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur getNearbyRestaurants:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

 
  async reloadJsonData() {
    try {
      const response = await api.post('/restaurants/json/reload');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur reloadJsonData:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ═══════════════════════════════════════════════════════════
  // ENDPOINTS BASE DE DONNÉES (si vous en avez besoin)
  // ═══════════════════════════════════════════════════════════

  async getAllRestaurantsFromDB() {
    try {
      const response = await api.get('/restaurants');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur getAllRestaurantsFromDB:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  async getRestaurantByIdFromDB(id) {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erreur getRestaurantByIdFromDB:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }
}

export default new RestaurantsApiService();*/
// services/LocalRestaurantsService.js
// services/LocalRestaurantsService.js
import restaurantsData from '../restaurants.json';

class LocalRestaurantsService {
  restaurants = [];

  constructor() {
    this.loadRestaurants();
  }

  loadRestaurants() {
    try {
      this.restaurants = restaurantsData.restaurants || [];
      console.log('🍽 Restaurants chargés:', this.restaurants.length);
      console.log('📊 Metadata:', restaurantsData.metadata);
    } catch (error) {
      console.error('❌ Erreur JSON:', error);
      this.restaurants = [];
    }
  }

  // Tous les restaurants
  getAllRestaurants() {
    return this.restaurants;
  }

  // Restaurant par ID
  getRestaurantById(id) {
    return this.restaurants.find(r => r.id === id) || null;
  }

  // Restaurants avec offres
  getRestaurantsWithOffers() {
    return this.restaurants.filter(r => r.offers?.length > 0);
  }

  // Par type de cuisine
  getRestaurantsByCuisine(cuisineType) {
    const lower = cuisineType.toLowerCase();
    return this.restaurants.filter(r => 
      r.cuisine_type?.toLowerCase().includes(lower)
    );
  }

  // Restaurants proches (rayon mètres)
  getNearbyRestaurants(latitude, longitude, radius = 5000) {
    console.log('🔍 Recherche près de:', { latitude: latitude.toFixed(4), longitude: longitude.toFixed(4), radius });
    
    const nearby = this.restaurants
      .map(restaurant => {
        const distance = this.calculateDistance(
          latitude, longitude,
          restaurant.location.latitude,
          restaurant.location.longitude
        );
        return { 
          ...restaurant, 
          distance: Math.round(distance * 100) / 100 // 2 décimales
        };
      })
      .filter(r => r.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    console.log('🍽 Restaurants trouvés:', nearby.length, nearby.map(r => ({ id: r.id, name: r.name, distance: r.distance })));
    return nearby;
  }

  // Distance Haversine (mètres)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Rayon Terre
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // mètres
  }

  // Recharger (si tu modifies le JSON)
  reload() {
    this.loadRestaurants();
  }
}

export default new LocalRestaurantsService();
