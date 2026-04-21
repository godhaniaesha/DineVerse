import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";
const API_BASE_URL = "http://localhost:8000/api";
const TableReservationContext = createContext();
export const useTableReservation = () => {
  const context = useContext(TableReservationContext);
  if (!context) {
    throw new Error("useTableReservation must be used within TableReservationProvider");
  }
  return context;
};
export const TableReservationProvider = ({ children }) => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);
  const callApiWithFallback = useCallback(async ({ endpoints, options }) => {
    let lastError = "Request failed";
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
        let data = {};
        try {
          data = await res.json();
        } catch (_) {
          data = {};
        }
        if (res.ok && data.success) {
          return { success: true, data: data.data };
        }
        if (res.status === 401 || res.status === 403 || res.status === 404) {
          lastError = data.msg || `Request failed: ${endpoint}`;
          continue;
        }
        return { success: false, error: data.msg || `Request failed with status ${res.status}` };
      } catch (_) {
        lastError = "Network error";
      }
    }
    return { success: false, error: lastError };
  }, []);
  const getAvailableTables = useCallback(async (params) => {
    try {
      setLoading(true);
      const primaryResult = await callApiWithFallback({
        endpoints: ["/table/getAvailableTablesByArea", "/getAvailableTablesByArea"],
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        },
      });
      if (primaryResult.success) {
        return primaryResult;
      }
      const areaQuery = params?.area ? `?area=${encodeURIComponent(params.area)}` : "";
      const fallbackRes = await fetch(`${API_BASE_URL}/getTablesByArea${areaQuery}`);
      const fallbackData = await fallbackRes.json();
      if (fallbackRes.ok && fallbackData?.success) {
        const guestCount = Number(params?.guests) || 0;
        const availableTables = (fallbackData.data || [])
          .filter((table) => table.status === "Available")
          .map((table) => ({
            ...table,
            capacityMatch: guestCount ? table.capacity >= guestCount : true,
            capacityGap: guestCount ? table.capacity - guestCount : 0,
          }));
        return { success: true, data: availableTables };
      }
      return primaryResult;
    } catch (_) {
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [callApiWithFallback]);
  const createPaymentIntent = useCallback(async (params) => {
    try {
      setLoading(true);
      return await callApiWithFallback({
        endpoints: ["/table/createTablePaymentIntent", "/createTablePaymentIntent"],
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify(params),
        },
      });
    } catch (_) {
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders, callApiWithFallback]);
  const confirmBooking = useCallback(async (params) => {
    try {
      setLoading(true);
      return await callApiWithFallback({
        endpoints: ["/table/confirmTableBooking", "/confirmTableBooking"],
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify(params),
        },
      });
    } catch (_) {
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders, callApiWithFallback]);
  const getReservations = useCallback(async (date = null) => {
    try {
      setLoading(true);
      const dateQuery = date ? `?date=${encodeURIComponent(date)}` : "";
      const result = await callApiWithFallback({
        endpoints: [
          `/table/getTableReservationsByDate${dateQuery}`,
          `/getTableReservationsByDate${dateQuery}`,
        ],
        options: { method: "GET", headers: { ...authHeaders } },
      });
      if (result.success) {
        setReservations(result.data);
      }
      return result;
    } catch (_) {
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders, callApiWithFallback]);
  const updateReservationStatus = useCallback(async (id, status, waiter = null) => {
    try {
      setLoading(true);
      const body = { status };
      if (waiter) body.waiter = waiter;

      const res = await fetch(`${API_BASE_URL}/table/updateTableReservationStatus/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, status, waiter: waiter || r.waiter } : r)));
        return { success: true, data: data.data };
      }
      return { success: false, error: data.msg || "Failed to update status" };
    } catch (_) {
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);
  return (
    <TableReservationContext.Provider
      value={{
        reservations,
        loading,
        error,
        getAvailableTables,
        createPaymentIntent,
        confirmBooking,
        getReservations,
        updateReservationStatus,
      }}
    >
      {children}
    </TableReservationContext.Provider>
  );
};
