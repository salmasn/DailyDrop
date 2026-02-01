import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./AuthThunk";
const initialState = {
  isLoggedIn: false,
  error: null,
  loading: false,
  user: null, // Ajouter pour stocker les infos utilisateur
  role: null, // Ajouter pour stocker le rôle
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.error = null;
       state.user = null; // Réinitialiser
      state.role = null;  // Réinitialiser
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user; // Stocker les infos utilisateur
        state.role = action.payload.user.role; // Stocker le rôle
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload;
        state.user = null;
        state.role = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
