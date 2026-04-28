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
      const res = await fetch(`${API_BASE_URL}/orders/kitchen-queue`, {
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
      const res = await fetch(`${API_BASE_URL}/orders/create`, {
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

  const updateOrderStatus = useCallback(async (orderId, dishItemId, status) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/orders/update-item-status/${orderId}/${dishItemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        await fetchOrders();
        return { success: true };
      }

      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authHeaders, fetchOrders]);

  const deleteOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/order/deleteOrder/${orderId}`, {
        method: "DELETE",
        headers: authHeaders
      });
      const data = await res.json();
      if (data.success) {
        await fetchOrders();
        return { success: true };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders, fetchOrders]);

  const getOrdersByTable = useCallback((tableId) => {
    return orders.filter(order => order.tableId === tableId);
  }, [orders]);

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      error,
      fetchOrders,
      createOrder,
      updateOrderStatus,
      deleteOrder,
      getOrdersByTable
    }}>
      {children}
    </OrderContext.Provider>
  );
};
