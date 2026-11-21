import { api } from './api';
import type { Event } from '../types/api';

export async function fetchEvents() {
  const { data } = await api.get<Event[]>('/events');
  return data;
}

export async function fetchEvent(id: number) {
  const { data } = await api.get<Event>(`/events/${id}`);
  return data;
}

export async function createEvent(payload: {
  title: string;
  description?: string;
  location: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  status?: string;
}) {
  const { data } = await api.post<Event>('/events', payload);
  return data;
}

export async function updateEvent(id: number, payload: Partial<Parameters<typeof createEvent>[0]>) {
  const { data } = await api.put<Event>(`/events/${id}`, payload);
  return data;
}

export async function deleteEvent(id: number) {
  await api.delete(`/events/${id}`);
}

