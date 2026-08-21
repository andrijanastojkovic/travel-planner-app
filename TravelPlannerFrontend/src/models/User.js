export function createUser(data = {}) {
  return {
    id: data.id ?? null,
    name: data.name ?? '',
    email: data.email ?? '',
    role: data.role ?? 'User',
  };
}