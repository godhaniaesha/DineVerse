import { createContext, useContext, useState } from "react";

const SubscriptionContext = createContext();

const API_BASE_URL = "http://localhost:8000/api";

export const SubscriptionProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [error, setError] = useState(null);

    // 🔹 Subscribe user
    const subscribeUser = async (email, interests = []) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/subscriptions/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, interests }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Something went wrong");
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Get all subscriptions (Admin)
    const fetchSubscriptions = async (token) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/subscriptions/getAll`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // required for protected route
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Failed to fetch subscriptions");
            }

            setSubscriptions(data.data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Delete subscription (Admin)
    const deleteSubscription = async (id, token) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/subscriptions/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Delete failed");
            }

            // update UI
            setSubscriptions((prev) =>
                prev.filter((sub) => sub._id !== id)
            );

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <SubscriptionContext.Provider
            value={{
                loading,
                error,
                subscriptions,
                subscribeUser,
                fetchSubscriptions,
                deleteSubscription,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

// custom hook
export const useSubscription = () => {
    return useContext(SubscriptionContext);
};