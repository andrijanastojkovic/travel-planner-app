import { tripApi } from './api';

export const getActivities = async (tripPlanId) => {
  const response = await tripApi.get(`/api/tripplan/${tripPlanId}/activity`);
  return response.data;
};

export const createActivity = async (tripPlanId, activity) => {
  const response = await tripApi.post(`/api/tripplan/${tripPlanId}/activity`, activity);
  return response.data;
};

export const deleteActivity = async (tripPlanId, id) => {
  await tripApi.delete(`/api/tripplan/${tripPlanId}/activity/${id}`);
};