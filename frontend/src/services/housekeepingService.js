import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const housekeepingService = {
  // Get housekeeping tasks with stats
  getHousekeepingTasks: async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.get(`${API_BASE_URL}/housekeeping/getTasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching housekeeping tasks:', error);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed. Token may be expired or invalid.');
        localStorage.removeItem('authToken');
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw error;
    }
  },

  // Get housekeeping stats only
  getHousekeepingStats: async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.get(`${API_BASE_URL}/housekeeping/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching housekeeping stats:', error);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed. Token may be expired or invalid.');
        localStorage.removeItem('authToken');
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw error;
    }
  },

  // Update clean status
  updateCleanStatus: async (roomId, cleanStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.patch(`${API_BASE_URL}/housekeeping/updateStatus`, {
        roomId,
        cleanStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating clean status:', error);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed. Token may be expired or invalid.');
        localStorage.removeItem('authToken');
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw error;
    }
  },

  // Get housekeeping staff
  getHousekeepingStaff: async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.get(`${API_BASE_URL}/housekeeping/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching housekeeping staff:', error);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed. Token may be expired or invalid.');
        localStorage.removeItem('authToken');
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw error;
    }
  },

  // Assign housekeeper to room
  assignHousekeeper: async (roomId, housekeeperId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.patch(`${API_BASE_URL}/housekeeping/assign`, {
        roomId,
        housekeeperId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error assigning housekeeper:', error);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed. Token may be expired or invalid.');
        localStorage.removeItem('authToken');
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw error;
    }
  }
};

export default housekeepingService;
