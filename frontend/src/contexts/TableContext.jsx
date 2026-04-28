import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = "http://localhost:8000/api";

const TableContext = createContext();

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within TableProvider");
  }
  return context;
};

export const TableProvider = ({ children }) => {
  const { token } = useAuth();

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 GET ALL TABLES
  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/getTables`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTables(data.data);
        setError(null);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Failed to fetch tables");
    } finally {
      setLoading(false);
    }
  };

  // ➕ ADD TABLE
  const addTable = async (payload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/addTable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(data,"tdata");
      

      if (data.success) {
        await fetchTables();
        return { success: true };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ✏️ UPDATE TABLE
  const updateTable = async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/updateTable/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        await fetchTables();
        return { success: true };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ❌ DELETE TABLE
  const deleteTable = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/deleteTable/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        await fetchTables();
        return { success: true };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // 📍 FILTER BY AREA
  const getTablesByArea = async (area) => {
    try {
      const res = await fetch(`${API_BASE_URL}/getTablesByArea?area=${area}`);
      const data = await res.json();

      if (data.success) return data.data;
      return [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (token) {
      fetchTables();
    }
  }, [token]);

  return (
    <TableContext.Provider
      value={{
        tables,
        loading,
        error,
        fetchTables,
        addTable,
        updateTable,
        deleteTable,
        getTablesByArea,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};