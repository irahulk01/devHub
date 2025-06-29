import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { fetchDeveloperByUID } from "../services/apiServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("devhub-user")) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        localStorage.setItem("firebase-user", JSON.stringify(currentUser));
        setUser(currentUser);
        fetchDeveloperByUID(currentUser.uid)
          .then((res) => {
            const dev = res.data?.[0];
            if (dev) {
              const cleanUser = {
                uid: dev.uid,
                email: dev.email || currentUser.email,
                name: dev.name,
                avatar: dev.avatar,
                title: dev.title,
              };
              setUser(cleanUser);
              localStorage.setItem("devhub-user", JSON.stringify(cleanUser));
            } else {
              setUser(null);
              localStorage.removeItem("devhub-user");
            }
          })
          .catch(() => {
            setUser(null);
            localStorage.removeItem("devhub-user");
          });
      } else {
        setUser(null);
        localStorage.removeItem("devhub-user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth);
    localStorage.removeItem("devhub-user");
    localStorage.removeItem("firebase-user");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);