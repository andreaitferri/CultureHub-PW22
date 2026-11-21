import { api } from './api';
import type { AuthUser } from '../types/api';

export type UserCreatePayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
};

export type UserUpdatePayload = Partial<Omit<UserCreatePayload, 'password'>> & {
  password?: string;
  is_active?: boolean;
};

export async function fetchUsers() {
  const { data } = await api.get<AuthUser[]>('/users');
  return data;
}

export async function fetchUser(id: number) {
  const { data } = await api.get<AuthUser>(`/users/${id}`);
  return data;
}

export async function createUser(payload: UserCreatePayload) {
  const { data } = await api.post<AuthUser>('/users', payload);
  return data;
}

export async function updateUser(id: number, payload: UserUpdatePayload) {
  const { data } = await api.put<AuthUser>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: number) {
  await api.delete(`/users/${id}`);
}
