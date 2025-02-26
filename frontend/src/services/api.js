import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const recordsApi = {
  getRecords: async (params = {}) => {
    try {
      console.log('Calling API with params:', params);
      const response = await api.get('/records', { params });
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getPersonDetails: async (pid) => {
    const response = await api.get(`/records/${pid}/details`);
    return response.data;
  },

  getDocuments: async (pid) => {
    const response = await api.get(`/records/${pid}/documents`);
    return response.data;
  },

  updatePerson: async (pid, data) => {
    const response = await api.put(`/records/${pid}`, data);
    return response.data;
  },

  getHistory: async (pid) => {
    const response = await api.get(`/records/${pid}/history`);
    return response.data;
  }
};