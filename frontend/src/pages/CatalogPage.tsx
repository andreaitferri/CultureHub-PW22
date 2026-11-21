import { useEffect, useState } from 'react';
import { fetchWorks } from '../services/workService';
import type { Work } from '../types/api';
import { WorkCard } from '../components/cards/WorkCard';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';

export function CatalogPage() {
  const [items, setItems] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorks().then(setItems).catch(() => setError('Impossibile caricare il catalogo')).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  return <div className="grid grid-3">{items.map((work) => <WorkCard key={work.id} work={work} />)}</div>;
}

