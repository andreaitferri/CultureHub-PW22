import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { createBooking } from '../services/bookingService';

export function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState(1);

  return (
    <Card>
      <h1>Prenotazione</h1>
      <form
        className="grid"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createBooking({ event_id: Number(eventId), seats });
            toast.success('Prenotazione salvata');
            navigate('/dashboard/visitatore');
          } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Prenotazione fallita');
          }
        }}
      >
        <Input type="number" min={1} max={20} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
        <Button type="submit">Conferma prenotazione</Button>
      </form>
    </Card>
  );
}

