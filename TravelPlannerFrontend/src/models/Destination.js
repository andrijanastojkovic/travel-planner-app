export function createDestination(data = {}) {
  return {
    id: data.id ?? null,
    tripPlanId: data.tripPlanId ?? null,
    name: data.name ?? '',
    location: data.location ?? '',
    arrivalDate: data.arrivalDate ?? '',
    departureDate: data.departureDate ?? '',
    description: data.description ?? '',
  };
}