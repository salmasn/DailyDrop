import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/AuthThunk";
import { useState ,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";


export const useAuth = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const loading = useSelector((state) => state.auth.loading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role); // Récupérer le rôle

   // Redirection automatique selon le rôle
  useEffect(() => {
    if (isLoggedIn && role) {
      if (role === 'client') {
        navigation.replace('Recommendation'); // Page client
      } else if (role === 'restaurant_owner') {
        navigation.replace('OwnerHomeScreen'); // Page owner
      }
    }
  }, [isLoggedIn, role]);


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