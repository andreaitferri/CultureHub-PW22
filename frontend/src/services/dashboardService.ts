import { api } from './api';

export async function fetchDashboardSummary() {
  const { data } = await api.get('/dashboard/summary');
  return data as {
    users: number;
    categories: number;
    works: number;
    events: number;
    bookings: number;
    feedback: number;
  };
}

