import React, { createContext, useState, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = "http://localhost:8000/api";

const StaffContext = createContext();

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};

export const StaffProvider = ({ children }) => {
  const { token } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const addStaff = useCallback(async (staffData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/addStaff`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: staffData,
      });

      const data = await response.json();
      
      if (data.success) {
        setStaff(prev => [...prev, data.data]);
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to add staff" };
      }
    } catch (error) {
      console.error("Add staff error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getStaff = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getStaff`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data, "data");
      
      
      if (data.success) {
        setStaff(data.data);
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to fetch staff" };
      }
    } catch (error) {
      console.error("Get staff error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateStaffProfile = useCallback(async (id, staffData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/updateStaffProfile/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: staffData,
      });

      const data = await response.json();
      
      if (data.success) {
        setStaff(prev => prev.map(s => s._id === id ? data.data : s));
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to update staff" };
      }
    } catch (error) {
      console.error("Update staff error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteStaff = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/deleteStaff/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setStaff(prev => prev.filter(s => s._id !== id));
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to delete staff" };
      }
    } catch (error) {
      console.error("Delete staff error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <StaffContext.Provider
      value={{
        staff,
        loading,
        addStaff,
        getStaff,
        updateStaffProfile,
        deleteStaff,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};
