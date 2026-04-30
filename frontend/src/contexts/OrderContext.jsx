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

  const fetchOrders = useCallback(async (userRole) => {
    try {
      setLoading(true);
      let endpoint;

      // Determine endpoint based on user role
      if (userRole === "Super Admin" || userRole === "Manager") {
        endpoint = `${API_BASE_URL}/orders/all-orders`;
      } else {
        // For waiters, chefs, and other staff
        endpoint = `${API_BASE_URL}/orders/kitchen-queue`;
      }

      const res = await fetch(endpoint, {
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

  const getAllOrdersForAdmin = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = `${API_BASE_URL}/orders/all-orders${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(endpoint, {
        headers: { ...authHeaders }
      });
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      console.error("Get all orders error:", err);
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const fetchChefQueue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders/chef-queue`, {
        headers: { ...authHeaders }
      });
      console.log("res", res)
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Fetch chef queue error:", err);
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

  const getWaiterActiveOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching waiter active orders...");
      const res = await fetch(`${API_BASE_URL}/orders/waiter-active-orders`, {
        headers: { ...authHeaders }
      });
      const data = await res.json();
      console.log("Waiter orders response:", data);

      if (data.success) {
        console.log("Setting orders:", data.data);
        setOrders(data.data);
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      console.error("Get waiter active orders error:", err);
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const updateOrderStatus = useCallback(async (orderId, dishItemId, status, userRole) => {
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
        // Refresh data based on user role
        if (userRole === "Cafe Waiter" || userRole === "Restaurant Waiter" || userRole === "Bar Waiter") {
          await getWaiterActiveOrders();
        } else if (userRole === "Super Admin" || userRole === "Manager") {
          await getAllOrdersForAdmin();
        } else {
          await fetchOrders(userRole);
        }
        return { success: true };
      }

      return { success: false, error: data.msg };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authHeaders, fetchOrders, getAllOrdersForAdmin, getWaiterActiveOrders]);

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

  const getBillingOrders = useCallback(async (area) => {
    try {
      setLoading(true);
      const endpoint = area ? `${API_BASE_URL}/orders/billing-orders?area=${area}` : `${API_BASE_URL}/orders/billing-orders`;
      const res = await fetch(endpoint, {
        headers: { ...authHeaders }
      });
      const data = await res.json();

      if (data.success) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      console.error("Get billing orders error:", err);
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const createBillingPaymentIntent = useCallback(async (orderId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders/checkout-details/${orderId}`, {
        method: "POST",
        headers: { ...authHeaders }
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.msg || 'Payment intent creation failed' };
      }

      if (data.success) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg || 'Unknown error occurred' };
    } catch (err) {
      console.error("Create billing payment intent error:", err);
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const confirmBillingAndCheckout = useCallback(async (orderId, paymentData = {}) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders/confirm-checkout/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(paymentData)
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.msg || 'Checkout confirmation failed' };
      }

      if (data.success) {
        await fetchOrders();
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg || 'Unknown error occurred' };
    } catch (err) {
      console.error("Confirm billing and checkout error:", err);
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders, fetchOrders]);

  const getOrdersByTable = useCallback((tableId) => {
    return orders.filter(order => order.tableId === tableId);
  }, [orders]);

  const getCompletedPayments = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = `${API_BASE_URL}/orders/sales-history${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(endpoint, {
        headers: { ...authHeaders }
      });
      const data = await res.json();

      if (data.success) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg };
    } catch (err) {
      console.error("Get completed payments error:", err);
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      error,
      fetchOrders,
      getAllOrdersForAdmin,
      getWaiterActiveOrders,
      getBillingOrders,
      createBillingPaymentIntent,
      confirmBillingAndCheckout,
      createOrder,
      updateOrderStatus,
      deleteOrder,
      getOrdersByTable,
      getCompletedPayments
    }}>
      {children}
    </OrderContext.Provider>
  );
};
