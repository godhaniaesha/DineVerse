import React, { createContext, useState, useEffect, useContext } from "react";

const API_BASE_URL = "http://localhost:8000/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        const userData = data.data;
        setToken(userData.token);
        setUser(userData);
        localStorage.setItem("authToken", userData.token);
        localStorage.setItem("authUser", JSON.stringify(userData));
        localStorage.setItem("adminRole", userData.role);
        localStorage.setItem("adminName", userData.full_name);
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (full_name, email, phone, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name, email, phone, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Registration failed" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to send OTP" };
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (data.success) {
        return { success: true, resetToken: data.resetToken, data: data };
      } else {
        return { success: false, error: data.message || "OTP verification failed" };
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const resetPassword = async (email, newPassword, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resetPassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });

      const data = await response.json();
      
      if (data.success) {
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Password reset failed" };
      }
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("adminRole");
      localStorage.removeItem("adminName");
      localStorage.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        forgotPassword,
        verifyOTP,
        resetPassword,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
