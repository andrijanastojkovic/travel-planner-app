export const ActivityStatus = {
  PLANIRANO: 'Planirano',
  REZERVISANO: 'Rezervisano',
  ZAVRSENO: 'Zavrseno',
  OTKAZANO: 'Otkazano',
};

export function createActivity(data = {}) {
  return {
    id: data.id ?? null,
    tripPlanId: data.tripPlanId ?? null,
    date: data.date ?? '',
    name: data.name ?? '',
    time: data.time ?? null,
    location: data.location ?? '',
    description: data.description ?? '',
    estimatedCost: data.estimatedCost ?? 0,
    status: data.status ?? ActivityStatus.PLANIRANO,
  };
}