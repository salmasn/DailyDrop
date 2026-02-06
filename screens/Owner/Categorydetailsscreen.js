import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ScreenHeader from '../../components/Owner/ScreenHeader';
import categoryService from '../../services/categoryService';
import dishService from '../../services/dishService';
import imageService from '../../services/imageService';
import * as ImagePicker from 'expo-image-picker';

const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];

function CategoryDetailsScreen({ navigation, route }) {
  const { categoryId, category: passedCategory } = route.params;
  
  const [category, setCategory] = useState(passedCategory || {
    id: categoryId,
    name: '',
    description: '',
    imageUrl: null,
    meal: { name: '' }
  });
  
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(!passedCategory);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // États pour le formulaire d'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [normalPrice, setNormalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [dishImage, setDishImage] = useState(null);
  
  // États pour les composants du plat
  const [currentComponent, setCurrentComponent] = useState('');
  const [dishComponents, setDishComponents] = useState([]);
  
  // États pour les créneaux horaires
  const [timeslots, setTimeslots] = useState([]);
  const [currentDay, setCurrentDay] = useState('Lundi');
  const [currentStartTime, setCurrentStartTime] = useState('');
  const [currentEndTime, setCurrentEndTime] = useState('');
  
  // États pour la gestion des plats sauvegardés
  const [savedDishes, setSavedDishes] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null);
  const [editingExistingDishId, setEditingExistingDishId] = useState(null);

  // États pour le modal de détails
  const [selectedDish, setSelectedDish] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadCategoryDetails();
  }, [categoryId]);

  const loadCategoryDetails = async () => {
    try {
      setLoading(true);
      console.log("📱 Chargement des détails pour catégorie:", categoryId);
      
      if (!passedCategory || !passedCategory.name) {
        console.log("📱 Chargement de la catégorie depuis API...");
        const categoryData = await categoryService.getCategoryById(categoryId);
        console.log("✅ Catégorie chargée:", categoryData);
        setCategory(categoryData);
      } else {
        console.log("✅ Catégorie déjà disponible:", category.name);
      }

      const dishesData = await dishService.getDishesByCategory(categoryId);
      console.log("✅ Plats chargés:", dishesData.length, "plats");
      setDishes(dishesData);
      
    } catch (error) {
      console.error('❌ Erreur chargement détails:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategoryDetails();
    setRefreshing(false);
  };

  const handleSelectDishImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder aux photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDishImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur sélection image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image');
    }
  };

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

  const resetForm = () => {
    setDishName('');
    setDishDescription('');
    setNormalPrice('');
    setDiscountedPrice('');
    setAvailableQuantity('');
    setDishImage(null);
    setDishComponents([]);
    setTimeslots([]);
    setCurrentComponent('');
    setCurrentDay('Lundi');
    setCurrentStartTime('');
    setCurrentEndTime('');
    setEditingDishId(null);
    setEditingExistingDishId(null);
  };

  // ✅ Éditer un plat EXISTANT
  const handleEditExistingDish = async (dishId) => {
    try {
      console.log('📝 Chargement du plat pour édition:', dishId);
      
      const dishData = await dishService.getDishById(dishId);
      console.log('✅ Plat chargé pour édition:', dishData);
      
      setDishName(dishData.name);
      setDishDescription(dishData.description || '');
      setNormalPrice(dishData.normalPrice?.toString() || '');
      setDiscountedPrice(dishData.discountedPrice?.toString() || '');
      setAvailableQuantity(dishData.availableQuantity?.toString() || '');
      setDishImage(dishData.imageUrl || null);
      setDishComponents(dishData.components || []);
      setTimeslots(dishData.timeslots || []);
      
      setEditingExistingDishId(dishId);
      setEditingDishId(null);
      setShowAddForm(true);
      
    } catch (error) {
      console.error('❌ Erreur chargement plat:', error);
      Alert.alert('Erreur', 'Impossible de charger le plat pour modification');
    }
  };

  // ✅ Sauvegarder les modifications d'un plat EXISTANT
  const handleUpdateExistingDish = async () => {
    if (!dishName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de plat');
      return;
    }

    if (!normalPrice || parseFloat(normalPrice) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un prix valide');
      return;
    }

    try {
      setSubmitting(true);
      
      const updateData = {
        name: dishName.trim(),
        description: dishDescription.trim(),
        normalPrice: parseFloat(normalPrice),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        availableQuantity: availableQuantity ? parseInt(availableQuantity) : null,
        components: dishComponents.length > 0 ? dishComponents : null,
        timeslots: timeslots.length > 0 ? timeslots.map(t => ({
          day: t.day,
          start_time: t.start_time,
          end_time: t.end_time
        })) : null,
      };

      // Gérer l'image si elle a changé
      if (dishImage && dishImage.startsWith('file://')) {
        try {
          console.log("📤 Upload de la nouvelle image...");
          const imageUrl = await imageService.uploadDishImage(dishImage);
          updateData.imageUrl = imageUrl;
          console.log("✅ Nouvelle image uploadée:", imageUrl);
        } catch (error) {
          console.error('❌ Erreur upload image:', error);
          Alert.alert('Attention', 'Erreur lors de l\'upload de l\'image, le plat sera mis à jour sans nouvelle image');
        }
      }

      console.log('📤 Mise à jour du plat:', editingExistingDishId);
      console.log('📦 Données de mise à jour:', updateData);
      
      await dishService.updateDish(editingExistingDishId, updateData);
      
      Alert.alert('Succès', 'Plat mis à jour avec succès !', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            setShowAddForm(false);
            loadCategoryDetails();
          }
        }
      ]);
      
    } catch (error) {
      console.error('❌ Erreur mise à jour plat:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Échec de la mise à jour';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Gérer ajout ET modification
  const handleAddDishToList = () => {
    // Si on édite un plat EXISTANT
    if (editingExistingDishId) {
      handleUpdateExistingDish();
      return;
    }

    // Validation
    if (!dishName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de plat');
      return;
    }

    if (!normalPrice || parseFloat(normalPrice) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un prix valide');
      return;
    }

    if (editingDishId) {
      // Éditer un plat en attente
      setSavedDishes(savedDishes.map(dish => 
        dish.id === editingDishId 
          ? {
              ...dish,
              name: dishName.trim(),
              description: dishDescription.trim(),
              normalPrice: parseFloat(normalPrice),
              discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
              availableQuantity: availableQuantity ? parseInt(availableQuantity) : null,
              dishImage: dishImage,
              components: [...dishComponents],
              timeslots: [...timeslots],
            }
          : dish
      ));
      setEditingDishId(null);
    } else {
      // Ajouter un nouveau plat en attente
      const newDish = {
        id: Date.now().toString(),
        name: dishName.trim(),
        description: dishDescription.trim(),
        normalPrice: parseFloat(normalPrice),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        availableQuantity: availableQuantity ? parseInt(availableQuantity) : null,
        dishImage: dishImage,
        components: [...dishComponents],
        timeslots: [...timeslots],
      };
      setSavedDishes([...savedDishes, newDish]);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEditSavedDish = (dishId) => {
    const dishToEdit = savedDishes.find(d => d.id === dishId);
    if (dishToEdit) {
      setDishName(dishToEdit.name);
      setDishDescription(dishToEdit.description);
      setNormalPrice(dishToEdit.normalPrice.toString());
      setDiscountedPrice(dishToEdit.discountedPrice?.toString() || '');
      setAvailableQuantity(dishToEdit.availableQuantity?.toString() || '');
      setDishImage(dishToEdit.dishImage);
      setDishComponents(dishToEdit.components || []);
      setTimeslots(dishToEdit.timeslots || []);
      setEditingDishId(dishId);
      setShowAddForm(true);
    }
  };

  const handleDeleteSavedDish = (dishId) => {
    Alert.alert(
      'Supprimer le plat',
      'Êtes-vous sûr de vouloir supprimer ce plat ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setSavedDishes(savedDishes.filter(d => d.id !== dishId));
            if (editingDishId === dishId) {
              resetForm();
              setShowAddForm(false);
            }
          }
        }
      ]
    );
  };

  const handleSubmitAllDishes = async () => {
    if (savedDishes.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins un plat');
      return;
    }

    try {
      setSubmitting(true);

      const dishesToSubmit = await Promise.all(
        savedDishes.map(async (dish) => {
          let imageUrl = dish.dishImage;

          if (imageUrl && imageUrl.startsWith('file://')) {
            try {
              console.log("📤 Upload de l'image pour:", dish.name);
              imageUrl = await imageService.uploadDishImage(imageUrl);
              console.log("✅ Image uploadée:", imageUrl);
            } catch (error) {
              console.error('❌ Erreur upload image:', error);
              imageUrl = null;
            }
          }

          const dishPayload = {
            name: dish.name,
            normalPrice: dish.normalPrice,
          };

          if (dish.description) dishPayload.description = dish.description;
          if (dish.discountedPrice) dishPayload.discountedPrice = dish.discountedPrice;
          if (dish.availableQuantity !== null && dish.availableQuantity !== undefined) {
            dishPayload.availableQuantity = dish.availableQuantity;
          }
          
          if (imageUrl && imageUrl.startsWith('http')) {
            dishPayload.imageUrl = imageUrl;
          }
          
          if (dish.components && dish.components.length > 0) {
            dishPayload.components = dish.components;
          }
          if (dish.timeslots && dish.timeslots.length > 0) {
            dishPayload.timeslots = dish.timeslots.map(t => ({
              day: t.day,
              start_time: t.start_time,
              end_time: t.end_time
            }));
          }

          return dishPayload;
        })
      );

      await dishService.createManyDishes(categoryId, dishesToSubmit);
      
      Alert.alert(
        'Succès',
        `${savedDishes.length} plat${savedDishes.length > 1 ? 's' : ''} ajouté${savedDishes.length > 1 ? 's' : ''} avec succès !`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSavedDishes([]);
              setShowAddForm(false);
              loadCategoryDetails();
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Échec de la soumission des plats';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDish = async (dishId) => {
    Alert.alert(
      'Supprimer le plat',
      'Êtes-vous sûr de vouloir supprimer ce plat ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await dishService.deleteDish(dishId);
              Alert.alert('Succès', 'Plat supprimé avec succès');
              await loadCategoryDetails();
            } catch (error) {
              console.error('❌ Erreur suppression plat:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le plat');
            }
          }
        }
      ]
    );
  };

  const openDishModal = (dish) => {
    setSelectedDish(dish);
    setModalVisible(true);
  };

  const closeDishModal = () => {
    setModalVisible(false);
    setSelectedDish(null);
  };

  if (loading && !category.name) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Détails de la catégorie"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          backgroundColor="#5a2c1c"
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5a2c1c" />
          <Text style={{ marginTop: 10, color: '#5a2c1c' }}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5a2c1c"
          />
        }
      >
        {/* Category Header Card */}
        {category && (
          <>
            <View style={styles.categoryHeaderCard}>
              {category.imageUrl ? (
                <Image
                  source={{ uri: category.imageUrl }}
                  style={styles.categoryHeaderImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.categoryHeaderImagePlaceholder}>
                  <Text style={styles.categoryHeaderImagePlaceholderText}>
                    {category.name?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              
              <View style={styles.categoryHeaderOverlay}>
                <View style={styles.categoryHeaderContent}>
                  <View style={styles.mealBadge}>
                    <Text style={styles.mealBadgeText}>
                      {category.meal?.name || 'N/A'}
                    </Text>
                  </View>
                  <Text style={styles.categoryHeaderTitle}>{category.name || 'Sans nom'}</Text>
                </View>
              </View>
            </View>
            
            <View>
              <Text style={styles.categoryDescription}>Description</Text>
              {category.description ? (
                <Text style={styles.categoryHeaderDescription}>
                  {category.description}
                </Text>
              ) : (
                <Text style={styles.categoryHeaderDescription}>
                  Aucune description disponible
                </Text>
              )}
            </View>
          </>
        )}

        {/* Add Dish Button */}
        <View style={styles.addDishSection}>
          <TouchableOpacity 
            style={styles.addDishButton}
            onPress={() => {
              if (showAddForm && !editingDishId && !editingExistingDishId) {
                resetForm();
                setShowAddForm(false);
              } else {
                setShowAddForm(true);
              }
            }}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/Icons/add.png')}
              style={styles.addDishIcon}
              resizeMode="contain"
            />
            <Text style={styles.addDishButtonText}>
              {showAddForm && !editingDishId && !editingExistingDishId ? 'Masquer le formulaire' : (dishes.length > 0 || savedDishes.length > 0 ? 'Ajouter un autre plat' : 'Ajouter le premier plat')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Dish Form */}
        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {editingExistingDishId ? 'Modifier le plat existant' : (editingDishId ? 'Modifier le plat' : 'Nouveau plat')}
            </Text>

            {/* Dish Name */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>
                Nom du plat <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="ex: Pizza Margherita"
                value={dishName}
                onChangeText={setDishName}
                placeholderTextColor="#999"
              />
            </View>

            {/* Description */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez le plat..."
                value={dishDescription}
                onChangeText={setDishDescription}
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Prices Row */}
            <View style={styles.rowSection}>
              <View style={[styles.formSection, { flex: 1 }]}>
                <Text style={styles.formLabel}>
                  Prix normal <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={normalPrice}
                  onChangeText={setNormalPrice}
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.formSection, { flex: 1 }]}>
                <Text style={styles.formLabel}>Prix réduit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={discountedPrice}
                  onChangeText={setDiscountedPrice}
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Quantity */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Quantité disponible</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={availableQuantity}
                onChangeText={setAvailableQuantity}
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>

            {/* Components Section */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Composants du plat</Text>
              <View style={styles.componentInputContainer}>
                <TextInput
                  style={styles.componentInput}
                  placeholder="ex: Fromage, Tomate..."
                  value={currentComponent}
                  onChangeText={setCurrentComponent}
                  placeholderTextColor="#999"
                  onSubmitEditing={handleAddComponent}
                />
                <TouchableOpacity 
                  style={styles.addComponentButton}
                  onPress={handleAddComponent}
                >
                  <Image
                    source={require('../../assets/Icons/add.png')}
                    style={styles.addComponentIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              
              {/* Components List */}
              {dishComponents.length > 0 && (
                <View style={styles.componentsListContainer}>
                  {dishComponents.map((component, index) => (
                    <View key={index} style={styles.componentChip}>
                      <Text style={styles.componentChipText}>{component}</Text>
                      <TouchableOpacity 
                        onPress={() => handleRemoveComponent(component)}
                        style={styles.removeComponentButton}
                      >
                        <Text style={styles.removeComponentText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Timeslots Section */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Créneaux horaires</Text>
              
              {/* Day Picker */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={currentDay}
                  onValueChange={setCurrentDay}
                  style={styles.picker}
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <Picker.Item key={day} label={day} value={day} />
                  ))}
                </Picker>
              </View>

              {/* Time Inputs */}
              <View style={styles.timeInputsContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.timeLabel}>Début</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="14:00"
                    value={currentStartTime}
                    onChangeText={setCurrentStartTime}
                    placeholderTextColor="#999"
                  />
                </View>
                <Text style={styles.timeSeparator}>-</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.timeLabel}>Fin</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="17:00"
                    value={currentEndTime}
                    onChangeText={setCurrentEndTime}
                    placeholderTextColor="#999"
                  />
                </View>
                <TouchableOpacity 
                  style={styles.addTimeslotButton}
                  onPress={handleAddTimeslot}
                >
                  <Image
                    source={require('../../assets/Icons/add.png')}
                    style={styles.addComponentIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Timeslots List */}
              {timeslots.length > 0 && (
                <View style={styles.timeslotsListContainer}>
                  {timeslots.map((timeslot) => (
                    <View key={timeslot.id} style={styles.timeslotChip}>
                      <View style={styles.timeslotContent}>
                        <Text style={styles.timeslotDay}>{timeslot.day}</Text>
                        <Text style={styles.timeslotTime}>
                          {timeslot.start_time} - {timeslot.end_time}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleRemoveTimeslot(timeslot.id)}
                        style={styles.removeTimeslotButton}
                      >
                        <Text style={styles.removeComponentText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Dish Image */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Image du plat</Text>
              <TouchableOpacity 
                style={styles.imageUploadButton}
                onPress={handleSelectDishImage}
              >
                {dishImage ? (
                  <View style={styles.imagePreview}>
                    <Image 
                      source={{ uri: dishImage }} 
                      style={styles.uploadedImage}
                    />
                  </View>
                ) : (
                  <>
                    <Image
                      source={require('../../assets/Icons/add.png')}
                      style={styles.uploadIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.uploadText}>Ajouter une image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Add/Update Button */}
            <TouchableOpacity
              style={[styles.confirmButton, submitting && { opacity: 0.6 }]}
              onPress={handleAddDishToList}
              activeOpacity={0.8}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  {editingExistingDishId 
                    ? 'Enregistrer les modifications' 
                    : (editingDishId ? 'Confirmer la modification' : 'Confirmer l\'ajout')}
                </Text>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            {(editingDishId || editingExistingDishId) && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetForm();
                  setShowAddForm(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Saved Dishes (Pending Submission) */}
        {savedDishes.length > 0 && (
          <>
            <View style={styles.dishesHeader}>
              <Text style={styles.dishesTitle}>Plats en attente</Text>
              <Text style={styles.dishesCount}>{savedDishes.length} plat{savedDishes.length !== 1 ? 's' : ''}</Text>
            </View>

            {savedDishes.map((dish) => (
              <TouchableOpacity 
                key={dish.id} 
                style={[styles.dishCard, styles.pendingDishCard]}
                onPress={() => openDishModal(dish)}
                activeOpacity={0.7}
              >
                {dish.dishImage && (
                  <View style={styles.dishImageContainerLeft}>
                    <Image
                      source={{ uri: dish.dishImage }}
                      style={styles.dishImageCircle}
                      resizeMode="cover"
                    />
                  </View>
                )}

                <View style={[styles.dishCardContent, dish.dishImage && styles.dishCardContentWithImage]}>
                  <Text style={styles.dishNameCompact} numberOfLines={1}>
                    {dish.name}
                  </Text>
                  
                  <View style={styles.dishPriceRow}>
                    {dish.discountedPrice ? (
                      <>
                        <Text style={styles.normalPriceStrikedCompact}>{dish.normalPrice} DH</Text>
                        <Text style={styles.discountedPriceCompact}>{dish.discountedPrice} DH</Text>
                      </>
                    ) : (
                      <Text style={styles.singlePriceCompact}>{dish.normalPrice} DH</Text>
                    )}
                  </View>

                  {dish.timeslots && dish.timeslots.length > 0 && (
                    <View style={styles.dishInfoRow}>
                      <Text style={styles.dishInfoLabelTimeslot}>
                        🕒 {dish.timeslots.length} créneau{dish.timeslots.length > 1 ? 'x' : ''}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.dishActionsTopRight}>
                  <TouchableOpacity 
                    style={styles.editButtonTopRight}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditSavedDish(dish.id);
                    }}
                  >
                    <Image
                      source={require('../../assets/Icons/pen.png')}
                      style={styles.actionIconSmall}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButtonTopRight}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteSavedDish(dish.id);
                    }}
                  >
                    <Image
                      source={require('../../assets/Icons/delete.png')}
                      style={styles.actionIconSmallDelete}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Existing Dishes List */}
        {dishes.length > 0 && (
          <>
            <View style={styles.dishesHeader}>
              <Text style={styles.dishesTitle}>Plats</Text>
              <Text style={styles.dishesCount}>{dishes.length} plat{dishes.length !== 1 ? 's' : ''}</Text>
            </View>

            {dishes.map((dish) => (
              <TouchableOpacity 
                key={dish.id} 
                style={styles.dishCard}
                onPress={() => openDishModal(dish)}
                activeOpacity={0.7}
              >
                {dish.imageUrl && (
                  <View style={styles.dishImageContainerLeft}>
                    <Image
                      source={{ uri: dish.imageUrl }}
                      style={styles.dishImageCircle}
                      resizeMode="cover"
                    />
                  </View>
                )}

                <View style={[styles.dishCardContent, dish.imageUrl && styles.dishCardContentWithImage]}>
                  <Text style={styles.dishNameCompact} numberOfLines={1}>
                    {dish.name}
                  </Text>
                  
                  <View style={styles.dishPriceRow}>
                    {dish.discountedPrice ? (
                      <>
                        <Text style={styles.normalPriceStrikedCompact}>{dish.normalPrice} DH</Text>
                        <Text style={styles.discountedPriceCompact}>{dish.discountedPrice} DH</Text>
                        {dish.discountPercentage && (
                          <View style={styles.discountBadgeCompact}>
                            <Text style={styles.discountBadgeTextCompact}>-{dish.discountPercentage}%</Text>
                          </View>
                        )}
                      </>
                    ) : (
                      <Text style={styles.singlePriceCompact}>{dish.normalPrice} DH</Text>
                    )}
                  </View>

                  {dish.timeslots && dish.timeslots.length > 0 && (
                    <View style={styles.dishInfoRow}>
                      <Text style={styles.dishInfoLabelTimeslot}>
                        🕒 {dish.timeslots.length} créneau{dish.timeslots.length > 1 ? 'x' : ''}
                      </Text>
                    </View>
                  )}
                </View>

                {/* ✅ CORRECTION ICI - Appeler handleEditExistingDish */}
                <View style={styles.dishActionsTopRight}>
                  <TouchableOpacity 
                    style={styles.editButtonTopRight}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditExistingDish(dish.id); // ✅ APPELER LA BONNE FONCTION
                    }}
                  >
                    <Image
                      source={require('../../assets/Icons/pen.png')}
                      style={styles.actionIconSmall}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButtonTopRight}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteDish(dish.id);
                    }}
                  >
                    <Image
                      source={require('../../assets/Icons/delete.png')}
                      style={styles.actionIconSmallDelete}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Empty State */}
        {dishes.length === 0 && savedDishes.length === 0 && !showAddForm && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucun plat pour le moment</Text>
            <Text style={styles.emptyStateSubtext}>
              Commencez par ajouter votre premier plat à cette catégorie
            </Text>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Fixed Submit Button */}
      {savedDishes.length > 0 && (
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={handleSubmitAllDishes}
            activeOpacity={0.8}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                Soumettre tous les plats ({savedDishes.length})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de détails */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDishModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedDish && (
                <>
                  {(selectedDish.dishImage || selectedDish.imageUrl) && (
                    <Image
                      source={{ uri: selectedDish.dishImage || selectedDish.imageUrl }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  )}

                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{selectedDish.name}</Text>

                    {selectedDish.description && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Description</Text>
                        <Text style={styles.modalSectionText}>{selectedDish.description}</Text>
                      </View>
                    )}

                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Prix</Text>
                      <View style={styles.modalPriceContainer}>
                        <Text style={styles.modalNormalPrice}>Prix normal: {selectedDish.normalPrice} DH</Text>
                        {selectedDish.discountedPrice && (
                          <Text style={styles.modalDiscountedPrice}>Prix réduit: {selectedDish.discountedPrice} DH</Text>
                        )}
                      </View>
                    </View>

                    {selectedDish.availableQuantity !== undefined && selectedDish.availableQuantity !== null && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Disponibilité</Text>
                        <Text style={styles.modalSectionText}>
                          {selectedDish.availableQuantity} unité{selectedDish.availableQuantity > 1 ? 's' : ''} disponible{selectedDish.availableQuantity > 1 ? 's' : ''}
                        </Text>
                      </View>
                    )}

                    {selectedDish.components && selectedDish.components.length > 0 && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Composants</Text>
                        <View style={styles.modalComponentsList}>
                          {selectedDish.components.map((component, index) => (
                            <View key={index} style={styles.modalComponentChip}>
                              <Text style={styles.modalComponentText}>{component}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {selectedDish.timeslots && selectedDish.timeslots.length > 0 && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>Créneaux horaires</Text>
                        {selectedDish.timeslots.map((timeslot, index) => (
                          <View key={index} style={styles.modalTimeslotItem}>
                            <Text style={styles.modalTimeslotDay}>{timeslot.day}</Text>
                            <Text style={styles.modalTimeslotTime}>
                              {timeslot.start_time} - {timeslot.end_time}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeDishModal}
            >
              <Text style={styles.modalCloseButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  // Category Header - Style conservé
  categoryHeaderCard: {
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryHeaderImage: {
    width: '100%',
    height: '100%',
  },
  categoryHeaderImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryHeaderImagePlaceholderText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  categoryHeaderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  categoryHeaderContent: {
    gap: 8,
  },
  mealBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  mealBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5a2c1c',
  },
  categoryHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryHeaderDescription: {
    fontSize: 14,
    color: 'rgba(36, 36, 36, 0.93)',
    lineHeight: 18,
    paddingLeft: 15,
    fontWeight: '500',
    paddingTop: 10,
  },
  categoryDescription: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.9)',
    lineHeight: 18,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingLeft: 15,
  },
  addDishSection: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  addDishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a2c1c',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addDishIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#fff',
  },
  addDishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#ff6b35',
  },

  // NOUVEAUX STYLES pour l'image en cercle
  dishImageContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -35, // La moitié de la hauteur (70/2)
    zIndex: 5,
  },
  dishImageCircle: {
    width: 70,
    height: 70,
    borderRadius: 35, // La moitié de width/height pour un cercle parfait
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  
  // Modifiez ce style existant pour faire de la place à l'image
  dishCardContent: {
    paddingRight: 100, // Augmenté de 80 à 100 pour faire de la place à l'image circulaire
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  rowSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  componentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  componentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  addComponentButton: {
    backgroundColor: '#5a2c1c',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addComponentIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  componentsListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  componentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  componentChipText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  removeComponentButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeComponentText: {
    color: '#2e7d32',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  timeSeparator: {
    fontSize: 20,
    color: '#666',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  addTimeslotButton: {
    backgroundColor: '#5a2c1c',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeslotsListContainer: {
    marginTop: 12,
    gap: 8,
  },
  timeslotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  timeslotContent: {
    flex: 1,
  },
  timeslotDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 2,
  },
  timeslotTime: {
    fontSize: 12,
    color: '#f57c00',
  },
  removeTimeslotButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  uploadIcon: {
    width: 40,
    height: 40,
    tintColor: '#999',
    marginBottom: 8,
  },
  uploadText: {
    color: '#999',
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: '#5a2c1c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  dishesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  dishesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dishesCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  // STYLES MODIFIÉS pour l'image à GAUCHE
  dishCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    position: 'relative',
    flexDirection: 'row', // Ajouté pour layout horizontal
    alignItems: 'center',  // Centrer verticalement
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  pendingDishCard: {
    borderWidth: 2,
    borderColor: '#ff9800',
    backgroundColor: '#fffaf0',
  },

  // Image à GAUCHE
  dishImageContainerLeft: {
    marginRight: 12, // Espace entre l'image et le contenu
  },
  
  dishImageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },

  // Contenu du plat
  dishCardContent: {
    flex: 1, // Prend l'espace restant
    paddingRight: 80, // Espace pour les boutons à droite
  },

  dishCardContentWithImage: {
    paddingLeft: 0, // Pas de padding left quand il y a une image
  },

  dishActionsTopRight: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },

  editButtonTopRight: {
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 6,
  },

  deleteButtonTopRight: {
    backgroundColor: '#ffebee',
    padding: 6,
    borderRadius: 6,
  },

  actionIconSmall: {
    width: 16,
    height: 16,
    tintColor: '#5a2c1c',
  },

  actionIconSmallDelete: {
    width: 16,
    height: 16,
    tintColor: '#d32f2f',
  },

  dishNameCompact: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  dishPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  normalPriceStrikedCompact: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  discountedPriceCompact: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },

  singlePriceCompact: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a2c1c',
  },

  discountBadgeCompact: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },

  discountBadgeTextCompact: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  dishInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  dishInfoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4caf50',
  },

  dishInfoText: {
    fontSize: 13,
    color: '#2e7d32',
    flex: 1,
  },

  dishInfoLabelTimeslot: {
    fontSize: 13,
    color: '#ff9800',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 100,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5a2c1c',
    marginBottom: 8,
  },
  modalSectionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  modalPriceContainer: {
    gap: 4,
  },
  modalNormalPrice: {
    fontSize: 15,
    color: '#666',
  },
  modalDiscountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  modalComponentsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalComponentChip: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  modalComponentText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
  },
  modalTimeslotItem: {
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  modalTimeslotDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 4,
  },
  modalTimeslotTime: {
    fontSize: 13,
    color: '#f57c00',
  },
  modalCloseButton: {
    backgroundColor: '#5a2c1c',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CategoryDetailsScreen;