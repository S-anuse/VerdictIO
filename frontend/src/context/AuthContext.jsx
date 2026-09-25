import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Failed to verify user session", error);
      // Clear token if invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const loginUser = (userToken, userData) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUserState = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAdmin: user?.role === "admin",
    login: loginUser,
    logout: logoutUser,
    updateUser: updateUserState,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
