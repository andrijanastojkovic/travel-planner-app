import { expenseApi } from './api';

export const getExpenses = async (tripPlanId) => {
  const response = await expenseApi.get(`/api/tripplan/${tripPlanId}/expense`);
  return response.data;
};

export const getExpenseSummary = async (tripPlanId) => {
  const response = await expenseApi.get(`/api/tripplan/${tripPlanId}/expense/summary`);
  return response.data;
};

export const createExpense = async (tripPlanId, expense) => {
  const response = await expenseApi.post(`/api/tripplan/${tripPlanId}/expense`, expense);
  return response.data;
};

export const deleteExpense = async (tripPlanId, id) => {
  await expenseApi.delete(`/api/tripplan/${tripPlanId}/expense/${id}`);
};