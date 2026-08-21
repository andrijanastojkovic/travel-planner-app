import { tripApi } from './api';
import { createChecklistItem as toChecklistItem } from '../models/ChecklistItem';

export const getChecklistItems = async (tripPlanId) => {
  const response = await tripApi.get(`/api/tripplans/${tripPlanId}/checklist-items`);
  return response.data.map(toChecklistItem);
};

export const createChecklistItem = async (tripPlanId, item) => {
  const response = await tripApi.post(`/api/tripplans/${tripPlanId}/checklist-items`, item);
  return response.data;
};

export const toggleChecklistItem = async (tripPlanId, id) => {
  const response = await tripApi.put(`/api/tripplans/${tripPlanId}/checklist-items/${id}/toggle`);
  return response.data;
};

export const deleteChecklistItem = async (tripPlanId, id) => {
  await tripApi.delete(`/api/tripplans/${tripPlanId}/checklist-items/${id}`);
};