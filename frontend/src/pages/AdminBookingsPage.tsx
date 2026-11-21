import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import { Select } from '../components/ui/Select';
import { fetchAllBookings, updateBooking } from '../services/bookingService';
import { getApiErrorMessage } from '../utils/apiError';
import type { Booking, BookingStatus } from '../types/api';

export function AdminBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await fetchAllBookings());
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile caricare le prenotazioni'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const save = async (booking: Booking, seats: number, status: BookingStatus) => {
    try {
      setSavingId(booking.id);
      await updateBooking(booking.id, { seats, status });
      toast.success('Prenotazione aggiornata');
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Aggiornamento non riuscito'));
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="grid">
      <div><h1>Gestione prenotazioni</h1><p className="meta">Prenotazioni: {items.length}</p></div>
      <Card>
        {items.length === 0 ? <EmptyState message="Nessuna prenotazione presente" /> : items.map((booking) => (
          <div className="admin-row" key={booking.id}>
            <div>
              <strong>Prenotazione #{booking.id}</strong>
              <p className="meta">Utente #{booking.user_id} · Evento #{booking.event_id} · Creata il {new Date(booking.created_at).toLocaleString('it-IT')}</p>
              <div className="admin-inline-form">
                <label>Posti<Input type="number" min={1} max={20} defaultValue={booking.seats} id={`seats-${booking.id}`} /></label>
                <label>Stato<Select defaultValue={booking.status} id={`status-${booking.id}`}>
                  <option value="pending">In attesa</option><option value="confirmed">Confermata</option><option value="cancelled">Annullata</option><option value="rejected">Rifiutata</option>
                </Select></label>
              </div>
            </div>
            <div className="admin-actions">
              <Button disabled={savingId === booking.id} onClick={() => {
                const seats = Number((document.getElementById(`seats-${booking.id}`) as HTMLInputElement).value);
                const status = (document.getElementById(`status-${booking.id}`) as HTMLSelectElement).value as BookingStatus;
                void save(booking, seats, status);
              }}>Salva</Button>
              {booking.status !== 'cancelled' && <Button variant="danger" disabled={savingId === booking.id} onClick={() => { if (window.confirm(`Annullare la prenotazione #${booking.id}?`)) void save(booking, booking.seats, 'cancelled'); }}>Annulla</Button>}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
