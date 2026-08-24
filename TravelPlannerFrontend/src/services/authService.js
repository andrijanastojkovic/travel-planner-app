import { userApi } from './api';
import { createUser as toUser } from '../models/User';

export const register = async (name, email, password) => {
  const response = await userApi.post('/api/Auth/register', {
    name,
    email,
    password,
  });
  return {
    ...toUser(response.data),
    token: response.data.token,
  };
};

export const login = async (email, password) => {
  const response = await userApi.post('/api/Auth/login', {
    email,
    password,
  });
  return {
    ...toUser(response.data),
    token: response.data.token,
  };
};

export const getAllUsers = async () => {
  const response = await userApi.get('/api/Auth/users');
  return response.data;
};
