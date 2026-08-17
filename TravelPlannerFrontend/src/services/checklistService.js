import { tripApi } from './api';

export const getChecklistItems = async (tripPlanId) => {
  const response = await tripApi.get(`/api/tripplan/${tripPlanId}/checklist`);
  return response.data;
};

export const createChecklistItem = async (tripPlanId, item) => {
  const response = await tripApi.post(`/api/tripplan/${tripPlanId}/checklist`, item);
  return response.data;
};

export const toggleChecklistItem = async (tripPlanId, id) => {
  const response = await tripApi.put(`/api/tripplan/${tripPlanId}/checklist/${id}/toggle`);
  return response.data;
};

export const deleteChecklistItem = async (tripPlanId, id) => {
  await tripApi.delete(`/api/tripplan/${tripPlanId}/checklist/${id}`);
};