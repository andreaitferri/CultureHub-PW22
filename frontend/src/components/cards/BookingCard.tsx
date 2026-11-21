import type { Booking } from '../../types/api';
import { Card } from '../ui/Card';

export function BookingCard({ booking }: { booking: Booking }) {
  return <Card><strong>Prenotazione #{booking.id}</strong><p className="meta">Posti: {booking.seats} - Stato: {booking.status}</p></Card>;
}

