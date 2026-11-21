import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, Layers3, MapPin, Palette, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Loading } from '../components/ui/Loading';
import { SectionTitle } from '../components/ui/SectionTitle';
import { fetchCategories } from '../services/categoryService';
import { fetchEvents } from '../services/eventService';
import { fetchWorks } from '../services/workService';
import { getApiErrorMessage } from '../utils/apiError';
import type { Category, Event, Work } from '../types/api';

export function HomePage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchWorks(), fetchEvents(), fetchCategories()])
      .then(([nextWorks, nextEvents, nextCategories]) => {
        setWorks(nextWorks);
        setEvents(nextEvents);
        setCategories(nextCategories);
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Impossibile caricare i contenuti')))
      .finally(() => setLoading(false));
  }, []);

  const upcomingEvents = useMemo(() => [...events].sort((a, b) => a.starts_at.localeCompare(b.starts_at)).slice(0, 3), [events]);
  const featuredWorks = works.slice(0, 4);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="home-page">
      <section className="home-hero panel panel-pad">
        <div className="home-hero__copy">
          <p className="eyebrow">Archivio · incontri · immaginari</p>
          <h1 className="page-title">La cultura prende forma.</h1>
          <p className="lead">CultureHub mette in dialogo opere, persone e luoghi per raccontare il patrimonio culturale con uno sguardo contemporaneo.</p>
          <div className="home-hero__actions">
            <Link className="btn btn-primary" to="/catalogo">Esplora il catalogo <ArrowUpRight size={17} /></Link>
            <Link className="btn btn-ghost" to="/eventi">Scopri gli eventi</Link>
          </div>
        </div>
        <div className="home-hero__visual" aria-label="Identità visiva CultureHub">
          <div className="hero-orbit hero-orbit--one" />
          <div className="hero-orbit hero-orbit--two" />
          <img src={logo} alt="CultureHub" />
          <span>STORIE<br />DA ABITARE</span>
        </div>
      </section>

      <section className="home-stats" aria-label="Statistiche del catalogo">
        <div><strong>{works.length}</strong><span>opere in catalogo</span></div>
        <div><strong>{events.length}</strong><span>prossimi appuntamenti</span></div>
        <div><strong>{categories.length}</strong><span>aree culturali</span></div>
      </section>

      <section className="home-section">
        <SectionTitle title="Opere in evidenza" subtitle="Una selezione dall’archivio CultureHub." />
        {featuredWorks.length === 0 ? <EmptyState message="Nessuna opera disponibile al momento." /> : <div className="home-work-grid">
          {featuredWorks.map((work) => (
            <Link className="home-work-card" to={`/catalogo/${work.id}`} key={work.id}>
              <div className="home-work-card__image">{work.image_url ? <img src={work.image_url} alt={work.title} /> : <Palette size={30} />}</div>
              <div className="home-work-card__body"><span className="eyebrow">{work.category.name}</span><h3>{work.title}</h3><p>{work.author || 'Autore non indicato'}</p></div>
            </Link>
          ))}
        </div>}
      </section>

      <section className="home-section home-section--events">
        <SectionTitle title="Prossimi eventi" subtitle="Incontri e percorsi per vivere il patrimonio da vicino." />
        {upcomingEvents.length === 0 ? <EmptyState message="Nessun evento pubblicato disponibile." /> : <div className="home-event-list">
          {upcomingEvents.map((event) => (
            <Card className="home-event-card" key={event.id}>
              <div className="home-event-card__date"><strong>{new Date(event.starts_at).toLocaleDateString('it-IT', { day: '2-digit' })}</strong><span>{new Date(event.starts_at).toLocaleDateString('it-IT', { month: 'short' })}</span></div>
              <div><h3>{event.title}</h3><p className="meta"><MapPin size={15} /> {event.location} · {event.capacity} posti</p></div>
              <Link className="btn btn-secondary" to={`/eventi/${event.id}`}>Dettagli</Link>
            </Card>
          ))}
        </div>}
      </section>

      <section className="home-values panel panel-pad">
        <div><p className="eyebrow">Valorizzazione culturale</p><h2>Conservare significa rendere presente.</h2><p className="lead">Dalla ricerca alla partecipazione, ogni contenuto diventa un invito a conoscere, prendersi cura e costruire nuove connessioni.</p></div>
        <div className="home-values__items"><span><Layers3 size={20} /> Archivi accessibili</span><span><CalendarDays size={20} /> Esperienze condivise</span><span><Sparkles size={20} /> Sguardi nuovi</span></div>
      </section>

      <section className="home-cta">
        <div><p className="eyebrow">Entra nella community</p><h2>Il prossimo racconto può iniziare da qui.</h2></div>
        <div className="home-hero__actions"><Link className="btn btn-primary" to="/registrazione">Crea il tuo account</Link><Link className="btn btn-ghost" to="/eventi">Prenota un’esperienza</Link></div>
      </section>
    </div>
  );
}
