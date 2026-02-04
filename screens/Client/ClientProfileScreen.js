import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import ScreenHeader from '../../components/Owner/ScreenHeader';

function ClientProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5a2c1c" />
      
      {/* Header avec ScreenHeader */}
      <ScreenHeader
        title="My Profile"
        subtitle="Manage your account"
        rightAction={() => console.log('Settings')}
        rightIcon="⚙️"
        avatarSource={require('../../assets/images/avatar.png')}
        backgroundColor="#5a2c1c"
      />
      
      <ScrollView style={styles.scrollView}>
        {/* User Info Card */}
        <View style={styles.userInfoCard}>
          <Text style={styles.userName}>Client DailyDrop</Text>
          <Text style={styles.userEmail}>client@dailydrop.com</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Offres utilisées</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>145€</Text>
            <Text style={styles.statLabel}>Économisé</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⭐</Text>
            <Text style={styles.menuText}>Favoris</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📜</Text>
            <Text style={styles.menuText}>Historique</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notifications</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Paramètres</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  userInfoCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5a2c1c',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e74c3c',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 30,
  },
});

export default ClientProfileScreen;