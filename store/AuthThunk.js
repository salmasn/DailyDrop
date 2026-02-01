import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";
import storageService from "../services/storageService";


export const loginUser = createAsyncThunk(
    "auth/login",
    async({email, password},{rejectWithValue})=>{
        try{
            const data = await authService.login({email,password});
            if(data && data.access_token)
            {
                //Sauvegarder le token
                await storageService.saveToken(data.access_token);

                //Sauvegarder le role
                await storageService.saveUserRole(data.user.role);


                //retourner les données
                return {
                    access_token: data.access_token,
                    user: data.user, // Contient id, email, role
                };

            }
            else{
                return rejectWithValue("identifiants incorrects");
            }
        }catch(error){
            return rejectWithValue(error.message || "Erreur de connexion");
        }
    }
);