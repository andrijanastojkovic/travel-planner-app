import { tripApi } from './api';
import { createDestination as toDestination } from '../models/Destination';

export const getDestinations = async (tripPlanId) => {
  const response = await tripApi.get(`/api/tripplans/${tripPlanId}/destinations`);
  return response.data.map(toDestination);
};

export const createDestination = async (tripPlanId, destination) => {
  const response = await tripApi.post(`/api/tripplans/${tripPlanId}/destinations`, destination);
  return response.data;
};

export const deleteDestination = async (tripPlanId, id) => {
  await tripApi.delete(`/api/tripplans/${tripPlanId}/destinations/${id}`);
};

export const updateDestination = async (tripPlanId, id, destination) => {
  const response = await tripApi.put(`/api/tripplans/${tripPlanId}/destinations/${id}`, destination);
  return response.data;
};