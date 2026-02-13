import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { CommonActions } from '@react-navigation/native'; // Import important
import ScreenHeader from '../../components/Owner/ScreenHeader';

// Importation des services
import storageService from '../../services/storageService';
import restaurantService from '../../services/restaurantService';
import authService from '../../services/authService';

// Fonction pour décoder le JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};

function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // 1. Récupérer le token JWT depuis SecureStore
      const token = await storageService.getToken();
      if (!token) {
        Alert.alert("Session expirée", "Veuillez vous reconnecter.", [
          { text: "OK", onPress: () => navigateToLogin() }
        ]);
        return;
      }

      // 2. Récupérer les données utilisateur depuis SecureStore
      const storedUserData = await storageService.getUserData();
      const userRole = await storageService.getUserRole();

      console.log("Stored user data:", storedUserData);
      console.log("User role:", userRole);

      // 3. Décoder le token pour obtenir l'ID utilisateur
      const decodedToken = decodeJWT(token);
      const userId = decodedToken?.id || decodedToken?.userId || decodedToken?.sub || decodedToken?.user_id;
      
      if (!userId) {
        Alert.alert("Erreur", "Token invalide. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      // 4. Mettre à jour les données utilisateur dans l'état
      setUserData({
        email: storedUserData?.email || decodedToken.email,
        role: userRole || decodedToken.role,
        id: userId,
      });

      // 5. Récupérer le restaurant de l'utilisateur
      const restaurants = await restaurantService.findByUserId(userId);
      
      if (restaurants && restaurants.length > 0) {
        const restaurant = restaurants[0];
        setRestaurantData(restaurant);
        console.log("Restaurant trouvé:", restaurant);
      } else {
        console.log("Aucun restaurant trouvé");
      }
    } catch (error) {
      console.error('Erreur dans fetchProfileData:', error);
      Alert.alert("Erreur", "Impossible de charger les informations du profil.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };

  const handleEdit = () => {
    Alert.alert(
      "Édition du profil",
      "Cette fonctionnalité sera bientôt disponible.",
      [{ text: "OK" }]
    );
  };

  // Navigation vers Login (depuis Tab vers Stack)
  const navigateToLogin = () => {
    try {
      console.log('Navigation vers Login...');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Nom exact de votre écran de login
        })
      );
      
      console.log('Navigation effectuée');
    } catch (error) {
      console.error('Erreur navigation:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
            
              // 1. Supprimer tous les tokens
              await authService.logout();
              console.log('Tokens supprimés');
              
              // 2. Rediriger vers login
              navigateToLogin();
              console.log('Redirection effectuée');
              
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#5a2c1c" />
          <Text style={{ marginTop: 10, color: '#5a2c1c' }}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Mon Profil"
        subtitle="Informations du restaurant"
        rightAction={handleEdit}
        backgroundColor="#5a2c1c"
      />

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
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
          </View>
          <Text style={styles.restaurantName}>
            {restaurantData?.name || 'Mon Restaurant'}
          </Text>
          <Text style={styles.restaurantType}>
            {restaurantData?.cuisineType || 'Cuisine Méditerranéenne'}
          </Text>
          <Text style={styles.userEmail}>
            {userData?.email || 'email@example.com'}
          </Text>
          {userData?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{userData.role}</Text>
            </View>
          )}
        </View>
        
        {/* Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Adresse</Text>
            <Text style={styles.infoValue}>
              {restaurantData?.address || '123 Main Street, City'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>
              {restaurantData?.phone || '+212 6XX XXX XXX'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {userData?.email || 'restaurant@example.com'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Horaires</Text>
            <Text style={styles.infoValue}>
              {restaurantData?.openingHours || '11:00 - 22:00'}
            </Text>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalCategories}</Text>
              <Text style={styles.statLabel}>Catégories</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Commandes</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#5a2c1c',
  },
  avatarEmoji: {
    fontSize: 50,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 13,
    color: '#5a2c1c',
    fontWeight: '600',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#5a2c1c',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 5,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5a2c1c',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 40,
  },
});

export default ProfileScreen;