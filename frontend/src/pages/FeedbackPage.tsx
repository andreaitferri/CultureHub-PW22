import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { createFeedback } from '../services/feedbackService';

export function FeedbackPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <Card>
      <h1>Feedback</h1>
      <form
        className="grid"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createFeedback({ event_id: Number(eventId), rating, comment });
            toast.success('Feedback inviato');
            navigate('/dashboard/visitatore');
          } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Invio fallito');
          }
        }}
      >
        <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        <Textarea rows={6} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Scrivi il tuo feedback" />
        <Button type="submit">Invia</Button>
      </form>
    </Card>
  );
}

