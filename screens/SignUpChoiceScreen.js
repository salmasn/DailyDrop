import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

function SignUpChoiceScreen({ navigation }) {
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.appName}>Registration</Text>
        <Text style={styles.tagline}>Welcome to DailyDrop — smart food, smart prices</Text>
      </View>

      {/* Cartes côte à côte */}
      <View style={styles.cardsRow}>
        <TouchableOpacity
          style={styles.typeCard}
          onPress={() => navigation.navigate('ClientSignUp')}
          activeOpacity={0.8}
        >
          <View style={styles.typeIcon}>
            <Image
              source={require('../assets/Icons/client.png')}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.typeCardTitle}>Client</Text>
          <Text style={styles.typeCardDescription}>
            Quick access to nearby deals
          </Text>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.typeCard}
          onPress={() => navigation.navigate('RestaurantSignUpStep1')}
          activeOpacity={0.8}
        >
          <View style={styles.typeIcon}>
            <Image
              source={require('../assets/Icons/restaurant.png')}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.typeCardTitle}>Restaurateur</Text>
          <Text style={styles.typeCardDescription}>
           Manage and publish daily offers
          </Text>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginText}>Already have an account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding:5,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5a2c1c',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typeCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 200,
    minWidth:90
    },
  typeIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    },
  iconImage: {
    width: 45,
    height: 45,
    },
  typeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    },
  typeCardDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 15,
    },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5a2c1c',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    },
  arrow: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    },
  loginText: {
    color: '#666',
    fontSize: 14,
    },
  loginLink: {
    color: '#5a2c1c',
    fontSize: 14,
    fontWeight: 'bold',
    },
});
export default SignUpChoiceScreen;