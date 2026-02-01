import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';

// Screens
import MenuScreen from '../screens/Owner/MenuScreen';
import CalendarScreen from '../screens/Owner/CalendarScreen';
import ProfileScreen from '../screens/Owner/ProfileScreen';
import SettingsScreen from '../screens/Owner/SettingsScreen';

const Tab = createBottomTabNavigator();

// VERSION SANS TINTCOLOR - Pour icônes déjà en couleur
const TabIcon = ({ icon, label, focused }) => (
  <View style={styles.iconContainer}>
    <Image 
      source={icon} 
      style={[
        styles.iconImage, 
        focused && styles.iconImageActive,
        // ❌ PAS de tintColor - l'icône garde sa couleur d'origine
      ]}
      resizeMode="contain"
    />
    <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
  </View>
);

function OwnerTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Menu"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#5a2c1c',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon={require('../assets/Icons/menu.png')} 
              label="Menu" 
              focused={focused} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon={require('../assets/Icons/calendar.png')} 
              label="Calendar" 
              focused={focused} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon={require('../assets/Icons/settings.png')} 
              label="Settings" 
              focused={focused} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon={require('../assets/Icons/profile.png')} 
              label="Profile" 
              focused={focused} 
            />
          ),
        }}
      />
      
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingTop: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
   tabBarItem: {
    paddingHorizontal: 0, // ✅ Ajouté : réduit l'espace entre chaque tab
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 26,      // Légèrement plus grand
    height: 26,
    marginBottom: 3,
  },
  iconImageActive: {
    transform: [{ scale: 1.15 }], // Animation plus visible
  },
  label: {
    fontSize: 7,
    color: '#999',
    fontWeight: '500',
  },
  labelActive: {
    color: '#5a2c1c',
    fontWeight: 'bold',
  },
});

export default OwnerTabNavigator;