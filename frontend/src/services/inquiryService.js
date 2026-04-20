import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const inquiryService = {
  // Submit new inquiry
  submitInquiry: async (inquiryData) => {
    try {
      console.log('inquiryService: Making API call to:', `${API_BASE_URL}/addInquiry`);
      console.log('inquiryService: Data being sent:', inquiryData);
      
      const response = await axios.post(`${API_BASE_URL}/addInquiry`, inquiryData);
      console.log('inquiryService: Raw API response:', response);
      console.log('inquiryService: Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('inquiryService: Error submitting inquiry:', error);
      console.error('inquiryService: Error response:', error.response);
      throw error;
    }
  },

  // Get all inquiries (admin only)
  getInquiries: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getInquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      throw error;
    }
  },

  // Get inquiry by ID (admin only)
  getInquiryById: async (id, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getInquiryById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching inquiry by ID:', error);
      throw error;
    }
  },

  // Update inquiry status (admin only)
  updateInquiryStatus: async (id, status, token) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/updateInquiryStatus/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      throw error;
    }
  },

  // Delete inquiry (admin only)
  deleteInquiry: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteInquiry/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      throw error;
    }
  },
};

export default inquiryService;
