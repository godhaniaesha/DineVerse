import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = "http://localhost:8000/api";
const ReservationContext = createContext();

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error(
      "useReservations must be used within a ReservationProvider",
    );
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token],
  );

  const getReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/reservations/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
      });
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const formatted = data.data.map((reservation) => ({
          id: reservation._id,
          reservation: reservation.bookingRef || reservation._id,
          guest:
            reservation.guest ||
            `${reservation.first_name} ${reservation.last_name}`,
          firstName: reservation.first_name || "",
          lastName: reservation.last_name || "",
          email: reservation.email || "",
          phone: reservation.phone || "",
          contact: reservation.phone || reservation.email || "",
          checkIn: reservation.checkIn || "",
          checkOut: reservation.checkOut || "",
          checkInFormatted: reservation.checkInFormatted || "",
          checkOutFormatted: reservation.checkOutFormatted || "",
          date: reservation.checkInFormatted || "",
          time: reservation.checkInTime || "",
          checkInTime: reservation.checkInTime || "",
          checkOutTime: reservation.checkOutTime || "",
          adults: Number(reservation.adults || 0),
          children: Number(reservation.children || 0),
          party:
            Number(reservation.adults || 0) + Number(reservation.children || 0),
          roomNumber: reservation.room?.roomNumber || "",
          floor: reservation.room?.floor || "",
          roomType: reservation.roomType?.display_name || "",
          specialRequest: reservation.specialRequest || "",
          paymentStatus: reservation.paymentStatus || "",
          totalAmount: reservation.totalAmount || 0,
          nights: reservation.nights || 0,
          createdAt: reservation.createdAt || "",
          type: "Room",
          status: reservation.status || "Pending",
          raw: reservation,
        }));
        setReservations(formatted);
        return { success: true, data: formatted };
      }

      setReservations([]);
      const message = data.message || "No reservations found";
      if (!data.success) setError(message);
      return { success: false, error: message };
    } catch (err) {
      console.error("Reservation fetch error:", err);
      setReservations([]);
      setError("Network error. Please try again.");
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const updateReservationStatus = useCallback(
    async (id, status) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/reservations/updateStatus/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify({ status }),
          },
        );

        const data = await response.json();
        if (data.success) {
          setReservations((prev) =>
            prev.map((reservation) =>
              reservation.id === id
                ? { ...reservation, status: status }
                : reservation,
            ),
          );
          return { success: true, data: data.data };
        }

        setError(data.message || "Failed to update reservation status");
        return {
          success: false,
          error: data.message || "Failed to update reservation status",
        };
      } catch (err) {
        console.error("Reservation status update error:", err);
        setError("Network error. Please try again.");
        return { success: false, error: "Network error. Please try again." };
      } finally {
        setLoading(false);
      }
    },
    [authHeaders],
  );

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        loading,
        error,
        getReservations,
        updateReservationStatus,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
