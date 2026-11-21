import { Link } from 'react-router-dom';
import type { Work } from '../../types/api';
import { Card } from '../ui/Card';

export function WorkCard({ work }: { work: Work }) {
  return (
    <Card>
      <div className="grid">
        <strong>{work.title}</strong>
        <span className="meta">{work.author || 'Autore non indicato'}</span>
        <span className="meta">{work.category?.name}</span>
        <Link className="btn btn-secondary" to={`/catalogo/${work.id}`}>Dettaglio</Link>
      </div>
    </Card>
  );
}

