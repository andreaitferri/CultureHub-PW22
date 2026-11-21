import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BarChart3, CalendarDays, ClipboardList, Layers3, MessageSquareText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Loading } from '../components/ui/Loading';
import { fetchAllBookings } from '../services/bookingService';
import { fetchCategories } from '../services/categoryService';
import { fetchDashboardSummary } from '../services/dashboardService';
import { fetchEvents } from '../services/eventService';
import { fetchAllFeedback } from '../services/feedbackService';
import { fetchWorks } from '../services/workService';
import { getApiErrorMessage } from '../utils/apiError';
import { useAuth } from '../context/AuthContext';
import type { Booking, Category, Event, Feedback, Work } from '../types/api';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof fetchDashboardSummary>> | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchDashboardSummary(), fetchAllBookings(), fetchAllFeedback(), fetchEvents(), fetchWorks(), fetchCategories()])
      .then(([nextSummary, nextBookings, nextFeedback, nextEvents, nextWorks, nextCategories]) => {
        setSummary(nextSummary); setBookings(nextBookings); setFeedback(nextFeedback); setEvents(nextEvents); setWorks(nextWorks); setCategories(nextCategories);
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Impossibile caricare la dashboard')));
  }, []);

  const eventNames = useMemo(() => new Map(events.map((event) => [event.id, event.title])), [events]);
  const categoryNames = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);
  const bookingsByEvent = useMemo(() => events.map((event) => ({ label: event.title, value: bookings.filter((booking) => booking.event_id === event.id).length })).filter((item) => item.value > 0).slice(0, 6), [bookings, events]);
  const worksByCategory = useMemo(() => categories.map((category) => ({ label: category.name, value: works.filter((work) => work.category_id === category.id).length })).filter((item) => item.value > 0), [categories, works]);
  const bookingStates = useMemo(() => ['pending', 'confirmed', 'cancelled', 'rejected'].map((status) => ({ label: status, value: bookings.filter((booking) => booking.status === status).length })).filter((item) => item.value > 0), [bookings]);
  const max = (items: { value: number }[]) => Math.max(...items.map((item) => item.value), 1);
  const upcoming = [...events].filter((event) => new Date(event.starts_at) >= new Date()).sort((a, b) => a.starts_at.localeCompare(b.starts_at)).slice(0, 4);
  const latestBookings = [...bookings].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);
  const pendingFeedback = feedback.filter((item) => item.moderation_status === 'pending').slice(0, 5);

  if (error) return <ErrorState message={error} />;
  if (!summary) return <Loading />;

  return (
    <div className="admin-dashboard grid">
      <header className="admin-dashboard__header"><div><p className="eyebrow">Area amministrativa</p><h1>Buongiorno, {user?.first_name || 'Admin'}.</h1><p className="meta">{new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div><BarChart3 size={42} /></header>
      <div className="stats-grid"><Card className="stat-card"><Layers3 className="stat-card__icon" /><span>Opere</span><strong>{summary.works}</strong></Card><Card className="stat-card"><CalendarDays className="stat-card__icon" /><span>Eventi</span><strong>{summary.events}</strong></Card><Card className="stat-card"><ClipboardList className="stat-card__icon" /><span>Prenotazioni</span><strong>{summary.bookings}</strong></Card><Card className="stat-card"><Users className="stat-card__icon" /><span>Utenti</span><strong>{summary.users}</strong></Card></div>

      <div className="dashboard-grid dashboard-grid--charts">
        <Card><h2>Prenotazioni per evento</h2>{bookingsByEvent.length === 0 ? <EmptyState message="Nessuna prenotazione disponibile." /> : <div className="bar-chart">{bookingsByEvent.map((item) => <div className="bar-chart__row" key={item.label}><span title={item.label}>{item.label}</span><div><i style={{ width: `${(item.value / max(bookingsByEvent)) * 100}%` }} /><strong>{item.value}</strong></div></div>)}</div>}</Card>
        <Card><h2>Opere per categoria</h2>{worksByCategory.length === 0 ? <EmptyState message="Nessuna opera disponibile." /> : <div className="bar-chart">{worksByCategory.map((item) => <div className="bar-chart__row" key={item.label}><span title={item.label}>{item.label}</span><div><i style={{ width: `${(item.value / max(worksByCategory)) * 100}%` }} /><strong>{item.value}</strong></div></div>)}</div>}</Card>
        <Card><h2>Stato prenotazioni</h2>{bookingStates.length === 0 ? <EmptyState message="Nessuna prenotazione disponibile." /> : <div className="status-chart">{bookingStates.map((item) => <div key={item.label}><span className={`status-dot status-dot--${item.label}`} /><strong>{item.value}</strong><small>{item.label}</small></div>)}</div>}</Card>
      </div>

      <div className="dashboard-grid"><Card><div className="dashboard-card-title"><h2>Prossimi eventi</h2><Link to="/admin/eventi">Gestisci <ArrowUpRight size={15} /></Link></div>{upcoming.length === 0 ? <EmptyState message="Nessun evento imminente." /> : upcoming.map((event) => <div className="dashboard-list-row" key={event.id}><div><strong>{event.title}</strong><span>{new Date(event.starts_at).toLocaleDateString('it-IT')} · {event.location}</span></div><span className="status-badge">{event.capacity} posti</span></div>)}</Card><Card><div className="dashboard-card-title"><h2>Ultime prenotazioni</h2><Link to="/admin/prenotazioni">Vedi tutte <ArrowUpRight size={15} /></Link></div>{latestBookings.length === 0 ? <EmptyState message="Nessuna prenotazione." /> : latestBookings.map((booking) => <div className="dashboard-list-row" key={booking.id}><div><strong>Prenotazione #{booking.id}</strong><span>{eventNames.get(booking.event_id) || `Evento #${booking.event_id}`} · {booking.seats} posti</span></div><span className="status-badge">{booking.status}</span></div>)}</Card></div>
      <Card><div className="dashboard-card-title"><h2>Feedback da moderare</h2><Link to="/admin/feedback">Gestisci <MessageSquareText size={15} /></Link></div>{pendingFeedback.length === 0 ? <EmptyState message="Nessun feedback in attesa." /> : pendingFeedback.map((item) => <div className="dashboard-list-row" key={item.id}><div><strong>{item.rating}/5 · Utente #{item.user_id}</strong><span>{item.comment}</span></div><span className="status-badge status-badge--pending">In attesa</span></div>)}</Card>
      <div className="quick-actions"><Link to="/admin/catalogo" className="quick-action"><Layers3 size={20} /><span>Nuova opera</span><ArrowUpRight size={16} /></Link><Link to="/admin/eventi" className="quick-action"><CalendarDays size={20} /><span>Nuovo evento</span><ArrowUpRight size={16} /></Link><Link to="/admin/prenotazioni" className="quick-action"><ClipboardList size={20} /><span>Gestisci prenotazioni</span><ArrowUpRight size={16} /></Link><Link to="/admin/feedback" className="quick-action"><MessageSquareText size={20} /><span>Modera feedback</span><ArrowUpRight size={16} /></Link></div>
      <span className="sr-only">Categorie disponibili: {categoryNames.size}</span>
    </div>
  );
}
