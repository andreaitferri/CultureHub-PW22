import type { Feedback } from '../../types/api';
import { Card } from '../ui/Card';

export function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return <Card><strong>Valutazione {feedback.rating}/5</strong><p>{feedback.comment}</p></Card>;
}

