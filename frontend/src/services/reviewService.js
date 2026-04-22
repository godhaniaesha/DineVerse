// src/services/reviewService.js
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const reviewService = {
  // Add new review (needs auth)
  addReview: async (reviewData, token) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reviews/add`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  // Get all reviews (public)
  getAllReviews: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/get-all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  // Delete review (admin / manager only)
  deleteReview: async (id, token) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/reviews/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  // Get reviews by area (e.g. Restaurant / Cafe / Bar)
  getAreaReviews: async (area) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/reviews/area/${encodeURIComponent(area)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching area reviews:", error);
      throw error;
    }
  },

  // Get reviews by userId
  getUserReviews: async (userId, token) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/reviews/user/${userId}`,
        {
          headers: {
            // If your backend doesn't need auth here, you can remove headers
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  },
};

export default reviewService;