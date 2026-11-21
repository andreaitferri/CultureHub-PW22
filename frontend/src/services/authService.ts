import { api } from './api';
import type { AuthUser, TokenResponse } from '../types/api';

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<TokenResponse>('/auth/login', { email, password });
  return data;
}

export async function meRequest() {
  const { data } = await api.get<AuthUser>('/auth/me');
  return data;
}

export async function registerRequest(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post<AuthUser>('/auth/register', payload);
  return data;
}
