import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
// Use absolute backend URL in production.
// Local dev proxy still works, because BASE_URL defaults to localhost.
const api = axios.create({ baseURL: `${BASE_URL.replace(/\/$/, '')}/api` });


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

export default api;
