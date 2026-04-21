import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const blogService = {
  // Get all blogs
  getAllBlogs: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getBlogs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Get blog by ID
  getBlogById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getBlogById/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
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
      console.error('Error toggling like:', error);
      throw error;
    }
  },
};

export default blogService;
