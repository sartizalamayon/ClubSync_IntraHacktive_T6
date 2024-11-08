import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../Firebase/Firebase.config";
  // import { GoogleAuthProvider } from "firebase/auth/web-extension";
  
  // const auth = getAuth(app);
  export const AuthContext = createContext(null);
  const AuthProvider = ({ children }) => {
    const googleProvider = new GoogleAuthProvider();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const createUser = (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
    };
    const login = (email, password) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth, email, password);
    };
    const logOut= () =>{
      setLoading(true);
      return signOut(auth);
    };
    const googleLogin = () =>{
      setLoading(true);
      return signInWithPopup(auth, googleProvider)
    }
    const updateInfo = (name, photourl)=>{
      setLoading(true);
      return updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photourl,
      })
    }
    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
        console.log(user.user, 'current user,,,')
      });
      return () => {
        return unSubscribe();
      };
    }, []);
    const drilling = {
      user,
      createUser,
      login,
      logOut,
      loading,
      setLoading,
      updateInfo,
      googleLogin
    };
    return (
      <AuthContext.Provider value={drilling}>{children}</AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
  