import axios from 'axios';
import { API_CONFIG } from '../Api/apiConfig';
const API_URL = API_CONFIG.BASE_URL;

export const restaurantOwnerService = {
  async register(data) {
    try {
      // 1. On utilise FormData pour supporter l'envoi de fichiers
      const formData = new FormData();

      // 2. Ajout des informations du propriétaire
      formData.append('ownerFullName', data.ownerFullName);
      formData.append('ownerEmail', data.ownerEmail);
      formData.append('ownerPassword', data.ownerPassword);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('role', 'restaurant_owner'); // Valeur par défaut pour ton DTO

      // 3. Ajout des informations du restaurant
      formData.append('restaurantName', data.restaurantName);
      formData.append('restaurantDescription', data.restaurantDescription || '');
      formData.append('cuisineType', data.cuisineType);

      // 4. Localisation (Note : FormData ne supporte que les strings/blobs)
      formData.append('restaurantAddress', data.location?.address || '');
      formData.append('latitude', String(data.location?.latitude || ''));
      formData.append('longitude', String(data.location?.longitude || ''));
      formData.append('locationMethod', data.location?.method || 'gps');

      // 5. Horaires et Prix
      formData.append('openingHours', data.openingHours || '');
      formData.append('pickupTimeStart', data.pickupTimeStart || '');
      formData.append('pickupTimeEnd', data.pickupTimeEnd || '');
      formData.append('averagePriceRange', data.averagePriceRange || '');
      formData.append('paymentMethods', data.paymentMethods || '');

      // 6. GESTION DE L'IMAGE
      // On récupère 'restaurantImage' qui vient de ton Step 2
      if (data.restaurantImage && data.restaurantImage.uri) {
        formData.append('image', {
          uri: data.restaurantImage.uri,
          type: 'image/jpeg', // Ou data.restaurantImage.type
          name: 'restaurant_cover.jpg', // Ou data.restaurantImage.name
        });
      }

      console.log('📤 Envoi du FormData au serveur...');

      const response = await axios.post(
        `${API_URL}/restaurant-owners/register`,
        formData,
        {
          headers: {
            // Indispensable pour que le backend reconnaisse le fichier
            'Content-Type': 'multipart/form-data',
          },
          // Nécessaire sur certaines versions de React Native/Axios
          transformRequest: (data) => data, 
        }
      );

      console.log('✅ Réponse serveur:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      const message = error.response?.data?.message || error.message || 'Erreur inconnue';
      throw new Error(message);
    }
  },
};