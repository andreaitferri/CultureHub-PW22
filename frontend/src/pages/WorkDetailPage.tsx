import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchWork } from '../services/workService';
import type { Work } from '../types/api';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';

export function WorkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    <div className="panel detail-panel grid">
      <p className="eyebrow">Opera · {work.category?.name}</p>
      <h1>{work.title}</h1>
      <p className="detail-panel__author">{work.author || 'Autore non indicato'}</p>
      <p className="lead">{work.description}</p>
      <Button type="button" variant="ghost" onClick={() => navigate(-1)}>← Torna indietro</Button>
    </div>
  );
}
