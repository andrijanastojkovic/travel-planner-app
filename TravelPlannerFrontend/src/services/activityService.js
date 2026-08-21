import { tripApi } from './api';

export const getActivities = async (tripPlanId) => {
  const response = await tripApi.get(`/api/tripplans/${tripPlanId}/activities`);
  return response.data;
};

export const createActivity = async (tripPlanId, activity) => {
  const response = await tripApi.post(`/api/tripplans/${tripPlanId}/activities`, activity);
  return response.data;
};

export const deleteActivity = async (tripPlanId, id) => {
  await tripApi.delete(`/api/tripplans/${tripPlanId}/activities/${id}`);
};

export const updateActivity = async (tripPlanId, id, activity) => {
  const response = await tripApi.put(`/api/tripplans/${tripPlanId}/activities/${id}`, activity);
  return response.data;
};