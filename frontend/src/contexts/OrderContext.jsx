import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = "http://localhost:8000/api";

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/order/getKitchenQueue`, {
        headers: { ...authHeaders }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const createOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/order/createOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchOrders();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders, fetchOrders]);

  return (
    <OrderContext.Provider value={{ orders, loading, error, fetchOrders, createOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
