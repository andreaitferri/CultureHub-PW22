import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchEvent } from '../services/eventService';
import type { Event } from '../types/api';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchEvent(Number(id)).then(setEvent).catch(() => setError('Evento non trovato'));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!event) return <Loading />;
  return (
    <div className="panel detail-panel grid">
      <p className="eyebrow">Evento · {event.status}</p>
      <h1>{event.title}</h1>
      <p className="lead">{event.description}</p>
      <div className="detail-panel__facts"><span>{event.location}</span><span>{new Date(event.starts_at).toLocaleString('it-IT')}</span><span>{event.capacity} posti</span></div>
      <div className="detail-panel__actions">
        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>← Torna indietro</Button>
        <Link className="btn btn-primary" to={`/prenotazione/${event.id}`}>Prenota</Link>
        <Link className="btn btn-secondary" to={`/feedback/${event.id}`}>Lascia feedback</Link>
      </div>
    </div>
  );
}
