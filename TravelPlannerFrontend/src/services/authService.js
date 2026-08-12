import { userApi } from './api';

export const register = async (name, email, password) => {
  const response = await userApi.post('/api/Auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await userApi.post('/api/Auth/login', {
    email,
    password,
  });
  return response.data;
};