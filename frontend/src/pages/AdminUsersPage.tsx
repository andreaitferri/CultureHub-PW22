import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import { Select } from '../components/ui/Select';
import { createUser, deleteUser, fetchUsers, updateUser } from '../services/userService';
import { getApiErrorMessage } from '../utils/apiError';
import type { AuthUser, RoleName } from '../types/api';

const emptyForm = { first_name: '', last_name: '', email: '', password: '', role_id: '3', is_active: true };

export function AdminUsersPage() {
  const [items, setItems] = useState<AuthUser[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await fetchUsers());
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile caricare gli utenti'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (editing) {
        const payload = {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          role_id: Number(form.role_id),
          is_active: form.is_active,
          ...(form.password ? { password: form.password } : {}),
        };
        await updateUser(editing.id, payload);
        toast.success('Utente aggiornato');
      } else {
        await createUser({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          role_id: Number(form.role_id),
        });
        toast.success('Utente creato');
      }
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Operazione utente non riuscita'));
    } finally {
      setSaving(false);
    }
  };

  const edit = (user: AuthUser) => {
    setEditing(user);
    setForm({ first_name: user.first_name, last_name: user.last_name, email: user.email, password: '', role_id: String(user.role.id), is_active: user.is_active });
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="grid">
      <div><h1>Gestione utenti</h1><p className="meta">Utenti: {items.length} · operazioni riservate ad Admin</p></div>
      <Card>
        <h2>{editing ? 'Modifica utente' : 'Nuovo utente'}</h2>
        <form className="grid grid-2" onSubmit={submit}>
          <Input required minLength={2} maxLength={100} placeholder="Nome" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <Input required minLength={2} maxLength={100} placeholder="Cognome" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          <Input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input required={!editing} minLength={8} maxLength={128} type="password" placeholder={editing ? 'Nuova password (opzionale)' : 'Password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Select value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })}>
            <option value="1">Admin</option><option value="2">Operatore</option><option value="3">Visitatore</option>
          </Select>
          {editing && <label className="checkbox-field"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Utente attivo</label>}
          <div>
            <Button type="submit" disabled={saving}>{editing ? 'Salva utente' : 'Crea utente'}</Button>
            {editing && <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(emptyForm); }}>Annulla</Button>}
          </div>
        </form>
      </Card>
      <Card>
        <h2>Elenco utenti</h2>
        {items.length === 0 ? <EmptyState message="Nessun utente presente" /> : items.map((user) => (
          <div className="admin-row" key={user.id}>
            <div><strong>{user.first_name} {user.last_name}</strong><p className="meta">{user.email} · {user.role.name as RoleName} · {user.is_active ? 'Attivo' : 'Disattivato'}</p></div>
            <div className="admin-actions">
              <Button variant="ghost" onClick={() => edit(user)}>Modifica</Button>
              <Button variant="danger" onClick={async () => { if (!window.confirm(`Eliminare ${user.first_name} ${user.last_name}?`)) return; try { await deleteUser(user.id); toast.success('Utente eliminato'); await load(); } catch (err) { toast.error(getApiErrorMessage(err, 'Eliminazione non riuscita')); } }}>Elimina</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
