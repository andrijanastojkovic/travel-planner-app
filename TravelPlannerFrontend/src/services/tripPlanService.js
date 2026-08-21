import { tripApi } from './api';

export const getTripPlans = async () => {
  const response = await tripApi.get('/api/tripplans');
  return response.data;
};

export const getTripPlan = async (id) => {
  const response = await tripApi.get(`/api/tripplans/${id}`);
  return response.data;
};

export const createTripPlan = async (tripPlan) => {
  const response = await tripApi.post('/api/tripplans', tripPlan);
  return response.data;
};

export const updateTripPlan = async (id, tripPlan) => {
  const response = await tripApi.put(`/api/tripplans/${id}`, tripPlan);
  return response.data;
};

export const deleteTripPlan = async (id) => {
  await tripApi.delete(`/api/tripplans/${id}`);
};