import { api } from './api';
import type { Work } from '../types/api';

export async function fetchWorks() {
  const { data } = await api.get<Work[]>('/catalog');
  return data;
}

export async function fetchWork(id: number) {
  const { data } = await api.get<Work>(`/catalog/${id}`);
  return data;
}

export async function createWork(payload: {
  title: string;
  author?: string;
  description?: string;
  image_url?: string;
  status?: string;
  category_id: number;
}) {
  const { data } = await api.post<Work>('/catalog', payload);
  return data;
}

export async function updateWork(id: number, payload: Partial<Parameters<typeof createWork>[0]>) {
  const { data } = await api.put<Work>(`/catalog/${id}`, payload);
  return data;
}

export async function deleteWork(id: number) {
  await api.delete(`/catalog/${id}`);
}

