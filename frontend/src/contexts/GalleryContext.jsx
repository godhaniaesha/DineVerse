import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = "http://localhost:8000/api";

const GalleryContext = createContext();

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
};

export const GalleryProvider = ({ children }) => {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getGallery`);
      const data = await response.json();
      
      if (data.success) {
        setImages(data.data);
        setError(null);
      } else {
        setError(data.msg || "Failed to fetch gallery");
      }
    } catch (err) {
      console.error("Fetch gallery error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addImage = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/addImage`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        await fetchGallery();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateImage = async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/updateImage/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        await fetchGallery();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleVisibility = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/toggleVisibility/${id}`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchGallery();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteImage = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteImage/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchGallery();
        return { success: true };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        images,
        loading,
        error,
        fetchGallery,
        addImage,
        updateImage,
        toggleVisibility,
        deleteImage,
        refreshGallery: fetchGallery,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};
