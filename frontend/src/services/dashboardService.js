import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const dashboardService = {
  // Get dashboard overview data
  getDashboardData: async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('Making dashboard API call with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${API_BASE_URL}/dashboard/admin-overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Dashboard API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed. Token may be expired or invalid.');
        // Clear invalid token
        localStorage.removeItem('authToken');
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/orders/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get analytics data
  getAnalytics: async (queryParams = '') => {
    try {
      const token = localStorage.getItem('authToken');
      const url = queryParams ? `${API_BASE_URL}/analytics${queryParams}` : `${API_BASE_URL}/analytics`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
};

export default dashboardService;
