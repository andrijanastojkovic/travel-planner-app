import { tripApi } from './api';

export const getTripPlans = async () => {
  const response = await tripApi.get('/api/TripPlan');
  return response.data;
};

export const getTripPlan = async (id) => {
  const response = await tripApi.get(`/api/TripPlan/${id}`);
  return response.data;
};

export const createTripPlan = async (tripPlan) => {
  const response = await tripApi.post('/api/TripPlan', tripPlan);
  return response.data;
};

export const updateTripPlan = async (id, tripPlan) => {
  const response = await tripApi.put(`/api/TripPlan/${id}`, tripPlan);
  return response.data;
};

export const deleteTripPlan = async (id) => {
  await tripApi.delete(`/api/TripPlan/${id}`);
};