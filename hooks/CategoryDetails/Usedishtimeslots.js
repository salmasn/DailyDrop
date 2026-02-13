import { useState } from 'react';
import { Alert } from 'react-native';

export const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];

/**
 * Hook pour gérer les créneaux horaires d'un plat
 */
export const useDishTimeslots = (timeslots, setTimeslots) => {
  const [currentDay, setCurrentDay] = useState('Lundi');
  const [currentStartTime, setCurrentStartTime] = useState('');
  const [currentEndTime, setCurrentEndTime] = useState('');

  const handleAddTimeslot = () => {
    if (!currentStartTime.trim() || !currentEndTime.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir les heures de début et de fin');
      return;
    }

    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(currentStartTime) || !timeRegex.test(currentEndTime)) {
      Alert.alert('Erreur', 'Format d\'heure invalide. Utilisez HH:MM (ex: 14:00)');
      return;
    }

    const newTimeslot = {
      id: Date.now().toString(),
      day: currentDay,
      start_time: currentStartTime,
      end_time: currentEndTime
    };

    setTimeslots([...timeslots, newTimeslot]);
    setCurrentStartTime('');
    setCurrentEndTime('');
  };

  const handleRemoveTimeslot = (timeslotId) => {
    setTimeslots(timeslots.filter(t => t.id !== timeslotId));
  };

  return {
    currentDay,
    setCurrentDay,
    currentStartTime,
    setCurrentStartTime,
    currentEndTime,
    setCurrentEndTime,
    handleAddTimeslot,
    handleRemoveTimeslot,
  };
};