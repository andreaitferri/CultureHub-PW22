import { useEffect, useState } from 'react';
import { BookingCard } from '../components/cards/BookingCard';
import { FeedbackCard } from '../components/cards/FeedbackCard';
import { SectionTitle } from '../components/ui/SectionTitle';
import { fetchMyBookings } from '../services/bookingService';
import { fetchMyFeedback } from '../services/feedbackService';
import type { Booking, Feedback } from '../types/api';

export function VisitorDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    fetchMyBookings().then(setBookings);
    fetchMyFeedback().then(setFeedback);
  }, []);

  return (
    <div className="grid">
      <SectionTitle title="Dashboard Visitatore" subtitle="Prenotazioni e feedback personali." />
      <div className="grid grid-2">
        <div className="grid">{bookings.map((item) => <BookingCard key={item.id} booking={item} />)}</div>
        <div className="grid">{feedback.map((item) => <FeedbackCard key={item.id} feedback={item} />)}</div>
      </div>
    </div>
  );
}

