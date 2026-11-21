import { Link } from 'react-router-dom';
import type { Event } from '../../types/api';
import { Card } from '../ui/Card';

export function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <div className="grid">
        <strong>{event.title}</strong>
        <span className="meta">{event.location}</span>
        <span className="meta">{new Date(event.starts_at).toLocaleString('it-IT')}</span>
        <Link className="btn btn-secondary" to={`/eventi/${event.id}`}>Dettaglio</Link>
      </div>
    </Card>
  );
}

