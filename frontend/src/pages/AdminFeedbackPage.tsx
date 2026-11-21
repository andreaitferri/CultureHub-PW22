import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Loading } from '../components/ui/Loading';
import { Select } from '../components/ui/Select';
import { deleteFeedback, fetchAllFeedback, moderateFeedback } from '../services/feedbackService';
import { getApiErrorMessage } from '../utils/apiError';
import type { Feedback, FeedbackModerationStatus } from '../types/api';

export function AdminFeedbackPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setItems(await fetchAllFeedback());
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile caricare i feedback'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const moderate = async (feedback: Feedback, status: FeedbackModerationStatus) => {
    try {
      await moderateFeedback(feedback.id, { moderation_status: status });
      toast.success('Moderazione aggiornata');
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Moderazione non riuscita'));
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="grid">
      <div><h1>Gestione feedback</h1><p className="meta">Feedback: {items.length}</p></div>
      <Card>
        {items.length === 0 ? <EmptyState message="Nessun feedback presente" /> : items.map((feedback) => (
          <div className="admin-row" key={feedback.id}>
            <div>
              <strong>Feedback #{feedback.id} · {feedback.rating}/5</strong>
              <p>{feedback.comment}</p>
              <p className="meta">Utente #{feedback.user_id} · {feedback.booking_id ? `Prenotazione #${feedback.booking_id}` : `Evento #${feedback.event_id}`} · {new Date(feedback.created_at).toLocaleString('it-IT')}</p>
            </div>
            <div className="admin-actions">
              <Select value={feedback.moderation_status} onChange={(e) => void moderate(feedback, e.target.value as FeedbackModerationStatus)}>
                <option value="pending">In attesa</option><option value="approved">Approvato</option><option value="rejected">Rifiutato</option>
              </Select>
              <Button variant="danger" onClick={async () => { if (!window.confirm(`Eliminare il feedback #${feedback.id}?`)) return; try { await deleteFeedback(feedback.id); toast.success('Feedback eliminato'); await load(); } catch (err) { toast.error(getApiErrorMessage(err, 'Eliminazione non riuscita')); } }}>Elimina</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
