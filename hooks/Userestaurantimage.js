import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import restaurantService from '../services/restaurantService';

/**
 * Hook pour récupérer l'image du restaurant
 */
export const useRestaurantImage = () => {
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Récupérer l'ID de l'utilisateur depuis Redux
   const user = useSelector((state) => state.auth.user);
   const userId = user?.id; 
   useEffect(() => {
  const fetchImage = async () => {
    console.log('🔍 userId :', userId, '| type :', typeof userId);

    if (!userId) {
      console.log('⚠️ userId est null/undefined, arrêt du fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📤 Appel API : GET /restaurants/user/' + userId);

      const restaurants = await restaurantService.findByUserId(userId);

      console.log('📥 Statut réponse : OK');
      console.log('🍽️ Restaurants reçus :', JSON.stringify(restaurants, null, 2));
      console.log('📊 Nombre de restaurants :', restaurants?.length);

      if (restaurants && restaurants.length > 0) {
        

        if (restaurants[0].imageUrl) {
         
          setRestaurantImage({ uri: restaurants[0].imageUrl });
        } else {
    
          setRestaurantImage(null);
        }
      } else {
   
        setRestaurantImage(null);
      }
    } catch (error) {
    
      setRestaurantImage(null);
    } finally {
      setLoading(false);
    
    }
  };

  fetchImage();
}, [userId]);
  return { restaurantImage, loading };
};

export default useRestaurantImage;