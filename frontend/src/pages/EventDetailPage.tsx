import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchEvent } from '../services/eventService';
import type { Event } from '../types/api';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';

export function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchEvent(Number(id)).then(setEvent).catch(() => setError('Evento non trovato'));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!event) return <Loading />;
  return (
    <div className="panel panel-pad grid">
      <h1>{event.title}</h1>
      <p className="lead">{event.description}</p>
      <p className="meta">{event.location}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link className="btn btn-primary" to={`/prenotazione/${event.id}`}>Prenota</Link>
        <Link className="btn btn-secondary" to={`/feedback/${event.id}`}>Lascia feedback</Link>
      </div>
    </div>
  );
}

