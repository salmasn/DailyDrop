/**
 * Utilitaires pour les calculs liés à la carte
 */

/**
 * Calcule la distance entre deux points géographiques (en mètres)
 * Utilise la formule de Haversine
 * 
 * @param {number} lat1 - Latitude du premier point
 * @param {number} lon1 - Longitude du premier point
 * @param {number} lat2 - Latitude du second point
 * @param {number} lon2 - Longitude du second point
 * @returns {number} Distance en mètres
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
};

/**
 * Formate une distance en km ou mètres selon la valeur
 * 
 * @param {number} distanceInMeters - Distance en mètres
 * @returns {string} Distance formatée
 */
export const formatDistance = (distanceInMeters) => {
  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(distanceInMeters)} m`;
};

/**
 * Vérifie si un point est dans un rayon donné
 * 
 * @param {object} centerPoint - Point central {latitude, longitude}
 * @param {object} targetPoint - Point cible {latitude, longitude}
 * @param {number} radiusInMeters - Rayon en mètres
 * @returns {boolean} True si le point est dans le rayon
 */
export const isPointInRadius = (centerPoint, targetPoint, radiusInMeters) => {
  const distance = calculateDistance(
    centerPoint.latitude,
    centerPoint.longitude,
    targetPoint.latitude,
    targetPoint.longitude
  );
  return distance <= radiusInMeters;
};