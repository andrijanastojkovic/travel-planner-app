export function createTripPlan(data = {}) {
  return {
    id: data.id ?? null,
    userId: data.userId ?? null,
    name: data.name ?? '',
    description: data.description ?? '',
    startDate: data.startDate ?? '',
    endDate: data.endDate ?? '',
    budget: data.budget ?? 0,
    notes: data.notes ?? '',
    createdAt: data.createdAt ?? null,
  };
}