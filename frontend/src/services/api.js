import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:5000/api' : 'app://./api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const recordsApi = {
  getRecords: async (params) => {
    try {
      const response = await api.get('/records', { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export const getPersonDetails = async (pid) => {
  const response = await api.get(`/records/${pid}/details`);
  return response.data;
};

export const getDocuments = async (pid) => {
  const response = await api.get(`/records/${pid}/documents`);
  return response.data;
};

export const getHistory = async (pid) => {
  const response = await api.get(`/records/${pid}/history`);
  return response.data;
};