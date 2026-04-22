// src/services/blogService.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const blogService = {
  // Get all blogs
  getAllBlogs: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getBlogs`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  },

  // Get blog by ID
  getBlogById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getBlogById/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      throw error;
    }
  },

  // Toggle like on blog
  toggleLike: async (id, token) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/toggleLike/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  },

  // Create new blog (expects FormData)
  createBlog: async (formData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/addBlog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  },

  // Update blog (expects FormData)
  updateBlog: async (id, formData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/updateBlog/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  },

  // Delete blog
  deleteBlog: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteBlog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  },
};

export default blogService;