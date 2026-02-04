import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';

// Screens
import RecommendationScreen from '../screens/Client/RecommendationScreen';
import ClientProfileScreen from '../screens/Client/ClientProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, label, focused }) => (
  <View style={styles.iconContainer}>
    <Image 
      source={icon} 
      style={[
        styles.iconImage, 
        focused && styles.iconImageActive,
      ]}
      resizeMode="contain"
    />
    <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
  </View>
);

function ClientTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#5a2c1c',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={RecommendationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon={require('../assets/Icons/menu.png')} 
              label="Home" 
              focused={focused} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ClientProfileScreen}
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
    paddingHorizontal: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 26,
    height: 26,
    marginBottom: 3,
  },
  iconImageActive: {
    transform: [{ scale: 1.15 }],
  },
  label: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  labelActive: {
    color: '#5a2c1c',
    fontWeight: 'bold',
  },
});

export default ClientTabNavigator;