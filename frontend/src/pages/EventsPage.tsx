import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/eventService';
import type { Event } from '../types/api';
import { EventCard } from '../components/cards/EventCard';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';

export function EventsPage() {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents().then(setItems).catch(() => setError('Impossibile caricare gli eventi')).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  return <div className="grid grid-3">{items.map((event) => <EventCard key={event.id} event={event} />)}</div>;
}

