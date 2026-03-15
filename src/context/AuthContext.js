import { createContext, useContext, useState, useEffect } from "react";
import { userSessionApi, userLogoutApi } from "../pages/Home/UserLoginApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = (userData) => {
    console.log("login : ",userData);
    localStorage.setItem("user", JSON.stringify(userData));    
    setUser(userData);
  };

  const logout = async () => {

    const res = await userLogoutApi();
    if(res.data){
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  useEffect(() => {

      const sessionCheck = async () => {

        const res = await userSessionApi();

        if (res.data != null ){
          console.log("auth ok!! : ",res.data);          
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));

        }else{
          console.log("auth error");
          setUser(null);
          localStorage.removeItem("user");
        }
      };

      sessionCheck();

  }, [children]);  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};