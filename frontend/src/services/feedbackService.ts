import { api } from './api';
import type { Feedback } from '../types/api';

export async function fetchMyFeedback() {
  const { data } = await api.get<Feedback[]>('/feedback/me');
  return data;
}

export async function fetchAllFeedback() {
  const { data } = await api.get<Feedback[]>('/feedback');
  return data;
}

export async function createFeedback(payload: {
  event_id?: number;
  booking_id?: number;
  rating: number;
  comment: string;
  moderation_status?: string;
}) {
  const { data } = await api.post<Feedback>('/feedback', payload);
  return data;
}

export async function updateFeedback(id: number, payload: Partial<{ rating: number; comment: string; moderation_status: string }>) {
  const { data } = await api.put<Feedback>(`/feedback/${id}`, payload);
  return data;
}

export async function moderateFeedback(id: number, payload: { moderation_status: string }) {
  const { data } = await api.patch<Feedback>(`/feedback/${id}/moderation`, payload);
  return data;
}

export async function deleteFeedback(id: number) {
  await api.delete(`/feedback/${id}`);
}

