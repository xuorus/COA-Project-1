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
  },

  // Individual document fetching methods
  getPDS: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/pds`);
    return response.data;
  },

  getSALN: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/saln`);
    return response.data;
  },

  getNOSA: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/nosa`);
    return response.data;
  },

  getSR: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/sr`);
    return response.data;
  },

  getCA: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/ca`);
    return response.data;
  },

  getDesignationOrder: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/designation-order`);
    return response.data;
  },

  getNOA: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/noa`);
    return response.data;
  },

  getSAT: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/sat`);
    return response.data;
  },

  getCOE: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/coe`);
    return response.data;
  },

  getTOR: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/tor`);
    return response.data;
  },

  getMC: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/mc`);
    return response.data;
  },

  getMedCert: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/med-cert`);
    return response.data;
  },

  getNBI: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/nbi`);
    return response.data;
  },

  getCCAA: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/ccaa`);
    return response.data;
  },

  getDAD: async (pid) => {
    const response = await axios.get(`${API_URL}/records/${pid}/documents/dad`);
    return response.data;
  }
};