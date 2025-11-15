import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

export const updatePassword = (data) => API.put('/users/password', data);
export const getAllUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post('/users', data);

export const getAllStores = (params) => API.get('/stores', { params });
export const getStoreById = (id) => API.get(`/stores/${id}`);
export const createStore = (data) => API.post('/stores', data);

export const submitRating = (storeId, rating) =>
  API.post('/ratings', { storeId, rating });
export const getUserRating = (storeId) =>
  API.get(`/ratings/store/${storeId}/user`);
export const getStoreRatings = (storeId) =>
  API.get(`/ratings/store/${storeId}`);

export default API;
