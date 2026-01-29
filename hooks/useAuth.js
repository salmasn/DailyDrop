import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/AuthThunk";
import { useState } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const loading = useSelector((state) => state.auth.loading);
  
  const handleLogin = async () => {
    
    if (!email || !password) {
      alert("Champs requis : Veuillez remplir tous les champs");
      return;
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email invalide : Le format de l'email est incorrect");
      return;
    }
    
    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.rejected.match(resultAction)) {
        alert(`Erreur de connexion : ${resultAction.payload}`);
        return;
      }
      
      // Connexion réussie
      alert("Connexion réussie !");
      
    } catch (error) {
      alert(`Erreur : ${error.message}`);
    }
  };

  return { email, setEmail, password, setPassword, loading, handleLogin };
};