import { tripApi } from './api';

export const getDestinations = async (tripPlanId) => {
  const response = await tripApi.get(`/api/tripplan/${tripPlanId}/destination`);
  return response.data;
};

export const createDestination = async (tripPlanId, destination) => {
  const response = await tripApi.post(`/api/tripplan/${tripPlanId}/destination`, destination);
  return response.data;
};

export const deleteDestination = async (tripPlanId, id) => {
  await tripApi.delete(`/api/tripplan/${tripPlanId}/destination/${id}`);
};

export const updateDestination = async (tripPlanId, id, destination) => {
  const response = await tripApi.put(`/api/tripplan/${tripPlanId}/destination/${id}`, destination);
  return response.data;
};