import axios from 'axios';

const API_URL = 'http://192.168.1.14:3000';

export const restaurantOwnerService = {
  /**
   * Inscription d'un propriétaire de restaurant
   * @param {Object} data - Données du formulaire
   * @returns {Promise<Object>} - Réponse du serveur
   */
  async register(data) {
    try {
      const payload = {
        // Owner information
        ownerFullName: data.ownerFullName,
        ownerEmail: data.ownerEmail,
        ownerPassword: data.ownerPassword,
        phoneNumber: data.phoneNumber,

        // Restaurant information
        restaurantName: data.restaurantName,
        restaurantDescription: data.restaurantDescription || null,
        cuisineType: data.cuisineType,

        // Location
        restaurantAddress: data.location?.address || null,
        latitude: data.location?.latitude || null,
        longitude: data.location?.longitude || null,
        locationMethod: data.location?.method || null,

        // Hours & Pricing
        openingHours: data.openingHours || null,
        pickupTimeStart: data.pickupTimeStart || null,
        pickupTimeEnd: data.pickupTimeEnd || null,
        averagePriceRange: data.averagePriceRange || null,
        paymentMethods: data.paymentMethods || null,
      };

      console.log('📤 Envoi des données:', payload);

      const response = await axios.post(
        `${API_URL}/restaurant-owners/register`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 secondes
        }
      );

      console.log('✅ Réponse serveur:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);

      if (error.response) {
        // Erreur retournée par le serveur
        const message = error.response.data?.message || 'Erreur lors de l\'inscription';
        throw new Error(message);
      } else if (error.request) {
        // Pas de réponse du serveur
        throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        // Autre erreur
        throw new Error(error.message || 'Une erreur est survenue');
      }
    }
  },
};