import { expenseApi } from './api';

export const getExpenses = async (tripPlanId) => {
  const response = await expenseApi.get(`/api/tripplans/${tripPlanId}/expenses`);
  return response.data;
};

export const getExpenseSummary = async (tripPlanId) => {
  const response = await expenseApi.get(`/api/tripplans/${tripPlanId}/expenses/summary`);
  return response.data;
};

export const createExpense = async (tripPlanId, expense) => {
  const response = await expenseApi.post(`/api/tripplans/${tripPlanId}/expenses`, expense);
  return response.data;
};

export const deleteExpense = async (tripPlanId, id) => {
  await expenseApi.delete(`/api/tripplans/${tripPlanId}/expenses/${id}`);
};