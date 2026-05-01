import axios from 'axios';

// Use relative URL - will work on same domain
const api = axios.create({
  baseURL: '/api'
  // baseURL: 'http://localhost:4000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;