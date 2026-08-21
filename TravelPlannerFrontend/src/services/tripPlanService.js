import { tripApi } from './api';
import { createTripPlan as toTripPlan } from '../models/TripPlan';

export const getTripPlans = async () => {
  const response = await tripApi.get('/api/tripplans');
  return response.data.map(toTripPlan);
};

export const getTripPlan = async (id) => {
  const response = await tripApi.get(`/api/tripplans/${id}`);
  return toTripPlan(response.data);
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