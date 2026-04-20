import React, { createContext, useState, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = "http://localhost:8000/api";

const RoomContext = createContext();

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
};

export const RoomProvider = ({ children }) => {
  const { token } = useAuth();
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Room Type Functions
  const getRoomTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/rooms/types`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success) {
        setRoomTypes(data.data);
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to fetch room types" };
      }
    } catch (error) {
      console.error("Get room types error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, []);

  const addRoomType = useCallback(async (roomTypeData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/rooms/types`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: roomTypeData,
      });
      console.log("addRoomType - response status:", response.status);
      const data = await response.json();
      console.log("addRoomType - response data:", data);
      
      if (data.success) {
        setRoomTypes(prev => [...prev, data.data]);
        return { success: true, data: data };
      } else {
        return { success: false, error: data.msg || data.message || "Failed to add room type" };
      }
    } catch (error) {
      console.error("Add room type error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateRoomType = useCallback(async (id, roomTypeData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/rooms/types/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: roomTypeData,
      });
      const data = await response.json();
      if (data.success) {
        setRoomTypes(prev => prev.map(rt => rt._id === id ? data.data : rt));
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to update room type" };
      }
    } catch (error) {
      console.error("Update room type error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteRoomType = useCallback(async (id) => {
    try {
      setLoading(true);
      console.log("deleteRoomType - calling with id:", id);
      const response = await fetch(`${API_BASE_URL}/rooms/types/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("deleteRoomType - response data:", data);
      
      if (data.success) {
        setRoomTypes(prev => prev.filter(rt => rt._id !== id));
        return { success: true, data: data };
      } else {
        return { success: false, error: data.msg || data.message || "Failed to delete room type" };
      }
    } catch (error) {
      console.error("Delete room type error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Room Functions
  const getRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getRooms`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to fetch rooms" };
      }
    } catch (error) {
      console.error("Get rooms error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addRoom = useCallback(async (roomData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/addRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });
      const data = await response.json();
      if (data.success) {
        setRooms(prev => [...prev, data.data]);
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to add room" };
      }
    } catch (error) {
      console.error("Add room error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateRoom = useCallback(async (id, roomData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/updateRoom/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });
      const data = await response.json();
      if (data.success) {
        setRooms(prev => prev.map(r => r._id === id ? data.data : r));
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to update room" };
      }
    } catch (error) {
      console.error("Update room error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteRoom = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/deleteRoom/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRooms(prev => prev.filter(r => r._id !== id));
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to delete room" };
      }
    } catch (error) {
      console.error("Delete room error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const searchRooms = useCallback(async (search, type, status) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (type) params.append("type", type);
      if (status) params.append("status", status);

      const response = await fetch(`${API_BASE_URL}/rooms/search?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
        return { success: true, data: data };
      } else {
        return { success: false, error: data.message || "Failed to search rooms" };
      }
    } catch (error) {
      console.error("Search rooms error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <RoomContext.Provider
      value={{
        roomTypes,
        rooms,
        loading,
        getRoomTypes,
        addRoomType,
        updateRoomType,
        deleteRoomType,
        getRooms,
        addRoom,
        updateRoom,
        deleteRoom,
        searchRooms,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
