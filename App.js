import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux'; // 👈 Ajouté
import store from './store/store'; // 👈 Ajouté (crée ce fichier ci-dessous)

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpChoiceScreen from './screens/SignUpChoiceScreen';
import ClientSignUpScreen from './screens/SignUp/Client/ClientSignUpScreen';
import RestaurantSignUpStep1 from './screens/SignUp/Owner/RestaurantSignUpStep1';
import RestaurantSignUpStep2 from './screens/SignUp/Owner/RestaurantSignUpStep2';
import RestaurantSignUpStep3 from './screens/SignUp/Owner/RestaurantSignUpStep3';
import RestaurantSignUpStep4 from './screens/SignUp/Owner/RestaurantSignUpStep4';
import RestaurantLocationChoice from './screens/SignUp/Owner/Restaurantlocationchoice';
import RestaurantGPSLocation from './screens/SignUp/Owner/Restaurantgpslocation';
import RestaurantMapSelection from './screens/SignUp/Owner/Restaurantmapselection';
import OwnerHomeScreen from './screens/Owner/OwnerHomeScreen';

import RecommendationScreen from './screens/Client/RecommendationScreen';
import TrackRestaurantsScreen from './screens/Client/TrackRestaurantsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}> 
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUpChoice" component={SignUpChoiceScreen} />
          <Stack.Screen name="ClientSignUp" component={ClientSignUpScreen} />
          <Stack.Screen name="RestaurantSignUpStep1" component={RestaurantSignUpStep1} />
          <Stack.Screen name="RestaurantSignUpStep2" component={RestaurantSignUpStep2} />
          <Stack.Screen name="RestaurantSignUpStep3" component={RestaurantSignUpStep3} />
          <Stack.Screen name="RestaurantSignUpStep4" component={RestaurantSignUpStep4} />
          <Stack.Screen name="Recommendation" component={RecommendationScreen} />
          <Stack.Screen name="TrackRestaurants" component={TrackRestaurantsScreen} />
          <Stack.Screen name="RestaurantLocationChoice" component={RestaurantLocationChoice} />
          <Stack.Screen name="RestaurantGPSLocation" component={RestaurantGPSLocation} />
          <Stack.Screen name="RestaurantMapSelection" component={RestaurantMapSelection} />
          <Stack.Screen name="OwnerHomeScreen" component={OwnerHomeScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </Provider>
  );
}