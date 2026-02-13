/**
 * Utilitaires pour la gestion et le filtrage des offres
 */

/**
 * Vérifie si une offre est disponible maintenant
 * 
 * @param {object} offer - L'offre à vérifier
 * @returns {boolean} True si l'offre est disponible maintenant
 */
export const isOfferAvailableNow = (offer) => {
  const now = new Date();
  const currentDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][now.getDay()];
  const currentTime = now.getHours() * 60 + now.getMinutes();

  return offer.timeslots.some(slot => {
    // Gérer les plages de jours (ex: "Lundi-Vendredi")
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
};

/**
 * Vérifie si une offre correspond aux timeslots personnalisés
 * 
 * @param {object} offer - L'offre à vérifier
 * @param {array} customTimeslots - Les créneaux horaires personnalisés
 * @returns {boolean} True si l'offre correspond aux timeslots
 */
export const isOfferInCustomTimeslots = (offer, customTimeslots) => {
  if (!customTimeslots || customTimeslots.length === 0) return false;

  return offer.timeslots.some(offerSlot => {
    return customTimeslots.some(customSlot => {
      if (!customSlot.start || !customSlot.end) return false;

      const [offerStartH, offerStartM] = offerSlot.start_time.split(':').map(Number);
      const [offerEndH, offerEndM] = offerSlot.end_time.split(':').map(Number);
      const [customStartH, customStartM] = customSlot.start.split(':').map(Number);
      const [customEndH, customEndM] = customSlot.end.split(':').map(Number);

      const offerStart = offerStartH * 60 + offerStartM;
      const offerEnd = offerEndH * 60 + offerEndM;
      const customStart = customStartH * 60 + customStartM;
      const customEnd = customEndH * 60 + customEndM;

      // Vérifier s'il y a un chevauchement entre les créneaux
      return (offerStart <= customEnd && offerEnd >= customStart);
    });
  });
};

/**
 * Obtient la couleur selon le pourcentage de réduction
 * 
 * @param {object} restaurant - Le restaurant
 * @returns {string} Code couleur hexadécimal
 */
export const getDiscountColor = (restaurant) => {
  // Si pas d'offres, retourner gris
  if (!restaurant.offers || restaurant.offers.length === 0) {
    return '#95a5a6';
  }

  // Calculer le meilleur pourcentage de réduction
  const maxDiscount = Math.max(...restaurant.offers.map(offer => offer.discount_percentage || 0));

  // Système de couleurs basé sur le pourcentage
  if (maxDiscount >= 35) {
    return '#e74c3c'; // Rouge - Excellente réduction (35%+)
  } else if (maxDiscount >= 30) {
    return '#e67e22'; // Orange foncé - Très bonne réduction (30-34%)
  } else if (maxDiscount >= 25) {
    return '#f39c12'; // Orange - Bonne réduction (25-29%)
  } else if (maxDiscount >= 20) {
    return '#f1c40f'; // Jaune - Réduction correcte (20-24%)
  } else if (maxDiscount > 0) {
    return '#3498db'; // Bleu - Petite réduction (1-19%)
  } else {
    return '#95a5a6'; // Gris - Pas de réduction
  }
};

/**
 * Obtient le label de la catégorie de réduction
 * 
 * @param {number} discountPercentage - Pourcentage de réduction
 * @returns {string} Label de la catégorie
 */
export const getDiscountCategory = (discountPercentage) => {
  if (discountPercentage >= 35) return 'Excellente';
  if (discountPercentage >= 30) return 'Très bonne';
  if (discountPercentage >= 25) return 'Bonne';
  if (discountPercentage >= 20) return 'Correcte';
  if (discountPercentage > 0) return 'Petite';
  return 'Aucune';
};

/**
 * Obtient la meilleure réduction d'un restaurant
 * 
 * @param {object} restaurant - Le restaurant
 * @returns {number} Pourcentage de réduction maximum
 */
export const getMaxDiscount = (restaurant) => {
  if (!restaurant.offers || restaurant.offers.length === 0) return 0;
  return Math.max(...restaurant.offers.map(offer => offer.discount_percentage || 0));
};