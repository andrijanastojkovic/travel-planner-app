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