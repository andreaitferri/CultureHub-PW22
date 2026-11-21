import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { createEvent, deleteEvent, fetchEvents, updateEvent } from '../services/eventService';
import { getApiErrorMessage } from '../utils/apiError';
import type { Event as CultureEvent, EventStatus } from '../types/api';

const emptyForm = {
  title: '', description: '', location: '', starts_at: '', ends_at: '', capacity: '1', status: 'draft' as EventStatus,
};

function toInputDate(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function AdminEventsPage() {
  const [items, setItems] = useState<CultureEvent[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<CultureEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await fetchEvents());
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile caricare gli eventi'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (new Date(form.ends_at) <= new Date(form.starts_at)) {
      toast.error('La fine deve essere successiva all’inizio');
      return;
    }
    const payload = {
      title: form.title,
      description: form.description || undefined,
      location: form.location,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: new Date(form.ends_at).toISOString(),
      capacity: Number(form.capacity),
      status: form.status,
    };
    try {
      setSaving(true);
      if (editing) {
        await updateEvent(editing.id, payload);
        toast.success('Evento aggiornato');
      } else {
        await createEvent(payload);
        toast.success('Evento creato');
      }
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Operazione evento non riuscita'));
    } finally {
      setSaving(false);
    }
  };

  const edit = (item: CultureEvent) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || '',
      location: item.location,
      starts_at: toInputDate(item.starts_at),
      ends_at: toInputDate(item.ends_at),
      capacity: String(item.capacity),
      status: item.status,
    });
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="grid">
      <div><h1>Gestione eventi</h1><p className="meta">Eventi: {items.length}</p></div>
      <Card>
        <h2>{editing ? 'Modifica evento' : 'Nuovo evento'}</h2>
        <form className="grid grid-2" onSubmit={submit}>
          <Input required minLength={2} maxLength={200} placeholder="Titolo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input required minLength={2} maxLength={255} placeholder="Luogo" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Textarea placeholder="Descrizione" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid">
            <label>Inizio<Input required type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></label>
            <label>Fine<Input required type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></label>
          </div>
          <label>Capienza<Input required type="number" min={1} max={100000} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></label>
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })}>
            <option value="draft">Bozza</option><option value="published">Pubblicato</option><option value="cancelled">Annullato</option><option value="completed">Completato</option>
          </Select>
          <div>
            <Button type="submit" disabled={saving}>{editing ? 'Salva evento' : 'Crea evento'}</Button>
            {editing && <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(emptyForm); }}>Annulla</Button>}
          </div>
        </form>
      </Card>
      <Card>
        <h2>Elenco eventi</h2>
        {items.length === 0 ? <EmptyState message="Nessun evento presente" /> : items.map((item) => (
          <div className="admin-row" key={item.id}>
            <div><strong>{item.title}</strong><p className="meta">{item.location} · {item.capacity} posti · {item.status}</p><p className="meta">{new Date(item.starts_at).toLocaleString('it-IT')} — {new Date(item.ends_at).toLocaleString('it-IT')}</p></div>
            <div className="admin-actions">
              <Button variant="ghost" onClick={() => edit(item)}>Modifica</Button>
              <Button variant="danger" onClick={async () => { if (!window.confirm(`Eliminare l'evento ${item.title}?`)) return; try { await deleteEvent(item.id); toast.success('Evento eliminato'); await load(); } catch (err) { toast.error(getApiErrorMessage(err, 'Eliminazione non riuscita')); } }}>Elimina</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
