import * as SecureStore from 'expo-secure-store';
const storageService={
    saveToken :async (token)=>{
        await SecureStore.setItemAsync("access_token",token);
    },
    getToken:async ()=>{
        return await SecureStore.getItemAsync("access_token");

    },

    // Sauvegarder le rôle (doit être une string)
    saveUserRole: async (role) => {
        try {
        if (typeof role === 'string') {
            await SecureStore.setItemAsync("user_role", role);
        } else {
            console.error('Role must be a string, received:', typeof role);
        }
        } catch (error) {
        console.error('Error saving role:', error);
        }
    },
    
    // Récupérer le rôle
    getUserRole: async () => {
        try {
        return await SecureStore.getItemAsync("user_role");
        } catch (error) {
        console.error('Error getting role:', error);
        return null;
        }
    },
    
    // Sauvegarder les infos utilisateur complètes (en JSON)
    saveUserData: async (userData) => {
        try {
        const userDataString = JSON.stringify(userData);
        await SecureStore.setItemAsync("user_data", userDataString);
        } catch (error) {
        console.error('Error saving user data:', error);
        }
    },
    
    // Récupérer les infos utilisateur
    getUserData: async () => {
        try {
        const userDataString = await SecureStore.getItemAsync("user_data");
        return userDataString ? JSON.parse(userDataString) : null;
        } catch (error) {
        console.error('Error getting user data:', error);
        return null;
        }
    },
    
    // Tout effacer au logout
    clearAll: async () => {
        try {
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("user_role");
        await SecureStore.deleteItemAsync("user_data");
        } catch (error) {
        console.error('Error clearing storage:', error);
        }
    },

};
export default storageService;