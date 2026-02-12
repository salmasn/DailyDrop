// hooks/useRestaurantFiltering.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import LocalRestaurantsService from '../services/restaurantsApiService';

// ✅ NOUVEL ENUM LOCAL (ignore l'ancien import)
export const FILTER_MODES = Object.freeze({
  ALL: 'all',
  WITH_OFFERS: 'with_offers',
  CUSTOM_TIMESLOTS: 'custom_timeslots'
});

export const useRestaurantFiltering = (location, selectedRadius, configComplete) => {
  const [allRestaurantsInRadius, setAllRestaurantsInRadius] = useState([]);
  const [filterMode, setFilterMode] = useState(FILTER_MODES.ALL);
  const [customTimeslots, setCustomTimeslots] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 SERVICE LOCAL UNIQUEMENT
  const fetchRestaurantsInRadius = useCallback((lat, lng, radius) => {
    console.log('🔍 [LOCAL] Recherche:', { lat, lng, radius });
    
    if (!lat || !lng) {
      console.log('❌ Position manquante');
      return [];
    }

    const restaurants = LocalRestaurantsService.getNearbyRestaurants(lat, lng, radius);
    console.log('✅ [LOCAL] Trouvés:', restaurants.length);
    return restaurants;
  }, []);

  // 🔥 CHARGEMENT RESTAURANTS
  useEffect(() => {
    console.log('🔄 Hook appelé:', { 
      configComplete, 
      hasLocation: !!location?.latitude,
      location: location ? `${location.latitude}, ${location.longitude}` : 'NULL'
    });

    if (!configComplete || !location?.latitude || !location?.longitude) {
      console.log('⏳ Attente config/position');
      setAllRestaurantsInRadius([]);
      return;
    }

    const radius = parseInt(selectedRadius) || 5000;
    setLoading(true);
    
    const restaurants = fetchRestaurantsInRadius(
      location.latitude,
      location.longitude,
      radius
    );
    
    setAllRestaurantsInRadius(restaurants);
    setLoading(false);
  }, [location?.latitude, location?.longitude, selectedRadius, configComplete, fetchRestaurantsInRadius]);

  // 🔥 FILTRES
  const filteredRestaurants = useMemo(() => {
    console.log('🔍 Filtrage:', { total: allRestaurantsInRadius.length, mode: filterMode });
    
    let result = allRestaurantsInRadius;

    if (filterMode === FILTER_MODES.WITH_OFFERS) {
      result = allRestaurantsInRadius.filter(r => r.offers && r.offers.length > 0);
    } else if (filterMode === FILTER_MODES.CUSTOM_TIMESLOTS) {
      result = allRestaurantsInRadius.filter(r => r.offers && r.offers.length > 0);
    }

    console.log('✅ Filtrés:', result.length);
    return result;
  }, [allRestaurantsInRadius, filterMode]);

  // Timeslots (inchangé)
  const addTimeslot = useCallback((day, start, end) => {
    setCustomTimeslots(prev => [...prev, { day, start_time: start, end_time: end }]);
  }, []);

  const removeTimeslot = useCallback((index) => {
    setCustomTimeslots(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateTimeslot = useCallback((index, day, start, end) => {
    setCustomTimeslots(prev => prev.map((slot, i) => 
      i === index ? { day, start_time: start, end_time: end } : slot
    ));
  }, []);

  const validateTimeslots = useCallback(() => {
    return customTimeslots.every(slot => slot.day && slot.start_time && slot.end_time);
  }, [customTimeslots]);

  return {
    allRestaurantsInRadius,
    filteredRestaurants,
    filterMode,
    setFilterMode,
    customTimeslots,
    addTimeslot,
    removeTimeslot,
    updateTimeslot,
    validateTimeslots,
    loading,
    // ✅ Export pour TrackRestaurantsScreen
    FILTER_MODES
  };
};
