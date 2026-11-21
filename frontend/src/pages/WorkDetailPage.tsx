import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchWork } from '../services/workService';
import type { Work } from '../types/api';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';

export function WorkDetailPage() {
  const { id } = useParams();
  const [work, setWork] = useState<Work | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchWork(Number(id)).then(setWork).catch(() => {
      setError('Opera non trovata');
      toast.error('Errore nel caricamento');
    });
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!work) return <Loading />;
  return (
    <div className="panel panel-pad grid">
      <h1>{work.title}</h1>
      <p className="lead">{work.description}</p>
      <p className="meta">Categoria: {work.category?.name}</p>
      <Link className="btn btn-primary" to="/catalogo">Torna al catalogo</Link>
    </div>
  );
}

