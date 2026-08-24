import { tripApi } from './api';

export const createShareToken = async (tripPlanId, accessType) => {
  const response = await tripApi.post(`/api/tripplans/${tripPlanId}/share`, {
    accessType,
  });
  return response.data;
};

export const getSharedTripPlan = async (token) => {
  const response = await tripApi.get(`/api/share/${token}`);
  return response.data;
};

export const createDestinationViaShare = async (token, tripPlanId, destination) => {
  const response = await tripApi.post(`/api/share/${token}/tripplan/${tripPlanId}/destinations`, destination);
  return response.data;
};

export const deleteDestinationViaShare = async (token, tripPlanId, id) => {
  await tripApi.delete(`/api/share/${token}/tripplan/${tripPlanId}/destinations/${id}`);
};

export const createActivityViaShare = async (token, tripPlanId, activity) => {
  const response = await tripApi.post(`/api/share/${token}/tripplan/${tripPlanId}/activities`, activity);
  return response.data;
};

export const deleteActivityViaShare = async (token, tripPlanId, id) => {
  await tripApi.delete(`/api/share/${token}/tripplan/${tripPlanId}/activities/${id}`);
};

export const createChecklistItemViaShare = async (token, tripPlanId, item) => {
  const response = await tripApi.post(`/api/share/${token}/tripplan/${tripPlanId}/checklist`, item);
  return response.data;
};

export const toggleChecklistItemViaShare = async (token, tripPlanId, id) => {
  const response = await tripApi.put(`/api/share/${token}/tripplan/${tripPlanId}/checklist/${id}/toggle`);
  return response.data;
};

export const deleteChecklistItemViaShare = async (token, tripPlanId, id) => {
  await tripApi.delete(`/api/share/${token}/tripplan/${tripPlanId}/checklist/${id}`);
};