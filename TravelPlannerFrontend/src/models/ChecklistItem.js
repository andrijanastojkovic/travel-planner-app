export function createChecklistItem(data = {}) {
  return {
    id: data.id ?? null,
    tripPlanId: data.tripPlanId ?? null,
    name: data.name ?? '',
    isDone: data.isDone ?? false,
  };
}