import { api } from './api';
import type { Category } from '../types/api';

export async function fetchCategories() {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}

export async function createCategory(payload: { name: string; description?: string }) {
  const { data } = await api.post<Category>('/categories', payload);
  return data;
}

export async function updateCategory(id: number, payload: { name?: string; description?: string }) {
  const { data } = await api.put<Category>(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: number) {
  await api.delete(`/categories/${id}`);
}

