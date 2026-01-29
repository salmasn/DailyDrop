// services/authService.js
import apiClient from "../Api/auth";
const authService = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    console.log(response.data.access_token);
    return response.data;
  }
};

export default authService;