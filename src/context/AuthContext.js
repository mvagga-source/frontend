import { createContext, useEffect, useState } from "react";

import { userLogout, userSession } from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {

    await userLogout();

    setUser(null);
  };

  useEffect(() => {

    (async () => {
        try {
            const res = await userSession();
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    })();

  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};