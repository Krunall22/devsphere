import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("https://devsphere-gz00.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post("https://devsphere-gz00.onrender.com/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;