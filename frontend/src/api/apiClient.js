import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://digiplus-hackathon.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('digiplus_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
};

export const hoardingsAPI = {
  getAll: async () => {
    const res = await api.get('/hoardings');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/hoardings', data);
    return res.data;
  },
  update: async (site_id, data) => {
    const res = await api.put(`/hoardings/${site_id}`, data);
    return res.data;
  },
  delete: async (site_id) => {
    const res = await api.delete(`/hoardings/${site_id}`);
    return res.data;
  },
};

export const vacanciesAPI = {
  getUpcoming: async () => {
    const res = await api.get('/vacancies');
    return res.data;
  },
};

export const pitchAPI = {
  generate: async (site_id, customer_id, suggested_rate) => {
    const res = await api.post('/pitch/generate', {
      site_id,
      customer_id,
      suggested_rate: suggested_rate ? parseFloat(suggested_rate) : null,
    });
    return res.data;
  },
  sendEmail: async (data) => {
    const res = await api.post('/email/send', data);
    return res.data;
  },
};

export const analyticsAPI = {
  getSummary: async () => {
    const res = await api.get('/analytics/summary');
    return res.data;
  },
};

export const pipelineAPI = {
  getStatus: async () => {
    const res = await api.get('/pipeline/status');
    return res.data;
  },
  run: async () => {
    const res = await api.post('/pipeline/run');
    return res.data;
  },
  refresh: async (reloadCsv = false) => {
    const res = await api.post('/pipeline/refresh', { reload_csv: reloadCsv });
    return res.data;
  },
};

export const leadsAPI = {
  getForSite: async (site_id) => {
    const res = await api.get(`/vacancies/${site_id}/leads`);
    return res.data;
  },
};

export const customersAPI = {
  getAll: async () => {
    const res = await api.get('/customers');
    return res.data;
  },
};

export const mapAPI = {
  getHeatmap: async () => {
    const res = await api.get('/map/heatmap');
    return res.data;
  },
  geocode: async (address) => {
    const res = await api.post('/map/geocode', { address });
    return res.data;
  },
};

export default api;
