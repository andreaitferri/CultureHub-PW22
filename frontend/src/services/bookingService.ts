import { api } from './api';
import type { Booking } from '../types/api';

export async function fetchMyBookings() {
  const { data } = await api.get<Booking[]>('/bookings/me');
  return data;
}

export async function fetchAllBookings() {
  const { data } = await api.get<Booking[]>('/bookings');
  return data;
}

export async function createBooking(payload: { event_id: number; seats: number; status?: string }) {
  const { data } = await api.post<Booking>('/bookings', payload);
  return data;
}

export async function updateBooking(id: number, payload: Partial<{ seats: number; status: string }>) {
  const { data } = await api.put<Booking>(`/bookings/${id}`, payload);
  return data;
}

export async function deleteBooking(id: number) {
  await api.delete(`/bookings/${id}`);
}

