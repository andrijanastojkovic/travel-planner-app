import axios from 'axios';

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL,
});

export const tripApi = axios.create({
  baseURL: import.meta.env.VITE_TRIP_SERVICE_URL,
});

export const expenseApi = axios.create({
  baseURL: import.meta.env.VITE_EXPENSE_SERVICE_URL,
});

const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

tripApi.interceptors.request.use(attachToken);
expenseApi.interceptors.request.use(attachToken);