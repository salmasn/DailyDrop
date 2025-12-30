// api/auth.js
// api/auth.js
import apiClient from './client';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    const { access_token, user } = response.data;

    await SecureStore.setItemAsync('access_token', access_token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    
    return response.data;
  },
};

export default authService;