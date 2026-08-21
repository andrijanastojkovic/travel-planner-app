export const ExpenseCategory = {
  PREVOZ: 'Prevoz',
  SMESTAJ: 'Smestaj',
  HRANA: 'Hrana',
  ULAZNICE: 'Ulaznice',
  KUPOVINA: 'Kupovina',
  OSTALO: 'Ostalo',
};

export function createExpense(data = {}) {
  return {
    id: data.id ?? null,
    tripPlanId: data.tripPlanId ?? null,
    name: data.name ?? '',
    category: data.category ?? ExpenseCategory.OSTALO,
    amount: data.amount ?? 0,
    date: data.date ?? '',
    description: data.description ?? '',
  };
}