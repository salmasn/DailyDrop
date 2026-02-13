import { useState } from 'react';
import { Alert } from 'react-native';

/**
 * Hook pour gérer les composants d'un plat
 */
export const useDishComponents = (dishComponents, setDishComponents) => {
  const [currentComponent, setCurrentComponent] = useState('');

  const handleAddComponent = () => {
    if (!currentComponent.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un composant');
      return;
    }

    if (dishComponents.includes(currentComponent.trim())) {
      Alert.alert('Erreur', 'Ce composant existe déjà');
      return;
    }

    setDishComponents([...dishComponents, currentComponent.trim()]);
    setCurrentComponent('');
  };

  const handleRemoveComponent = (component) => {
    setDishComponents(dishComponents.filter(c => c !== component));
  };

  return {
    currentComponent,
    setCurrentComponent,
    handleAddComponent,
    handleRemoveComponent,
  };
};