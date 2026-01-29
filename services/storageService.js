import * as SecureStore from 'expo-secure-store';
const storageService={
    saveToken :async (token)=>{
        await SecureStore.setItemAsync("access_token",token);
    },
    getToken:async ()=>{
        return await SecureStore.getItemAsync("access_token");

    }

};
export default storageService;