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
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../services/categoryService';
import { getApiErrorMessage } from '../utils/apiError';
import { createWork, deleteWork, fetchWorks, updateWork } from '../services/workService';
import type { Category, Work, WorkStatus } from '../types/api';

const emptyWork = { title: '', author: '', description: '', image_url: '', status: 'active' as WorkStatus, category_id: '' };
const emptyCategory = { name: '', description: '' };

export function AdminCatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workForm, setWorkForm] = useState(emptyWork);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [nextCategories, nextWorks] = await Promise.all([fetchCategories(), fetchWorks()]);
      setCategories(nextCategories);
      setWorks(nextWorks);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile caricare il catalogo'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const submitCategory = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        toast.success('Categoria aggiornata');
      } else {
        await createCategory(categoryForm);
        toast.success('Categoria creata');
      }
      setCategoryForm(emptyCategory);
      setEditingCategory(null);
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Operazione categoria non riuscita'));
    } finally {
      setSaving(false);
    }
  };

  const submitWork = async (event: FormEvent) => {
    event.preventDefault();
    if (!workForm.category_id) {
      toast.error('Seleziona una categoria');
      return;
    }
    const payload = { ...workForm, category_id: Number(workForm.category_id) };
    try {
      setSaving(true);
      if (editingWork) {
        await updateWork(editingWork.id, payload);
        toast.success('Opera aggiornata');
      } else {
        await createWork(payload);
        toast.success('Opera creata');
      }
      setWorkForm(emptyWork);
      setEditingWork(null);
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Operazione opera non riuscita'));
    } finally {
      setSaving(false);
    }
  };

  const startWorkEdit = (work: Work) => setWorkForm({
    title: work.title,
    author: work.author || '',
    description: work.description || '',
    image_url: work.image_url || '',
    status: work.status,
    category_id: String(work.category_id),
  });

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="grid">
      <div>
        <h1>Gestione catalogo</h1>
        <p className="meta">Opere: {works.length} · Categorie: {categories.length}</p>
      </div>

      <div className="grid grid-2">
        <Card>
          <h2>{editingCategory ? 'Modifica categoria' : 'Nuova categoria'}</h2>
          <form className="grid" onSubmit={submitCategory}>
            <Input required minLength={2} maxLength={120} placeholder="Nome categoria" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
            <Textarea maxLength={2000} placeholder="Descrizione" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
            <div>
              <Button type="submit" disabled={saving}>{editingCategory ? 'Salva categoria' : 'Crea categoria'}</Button>
              {editingCategory && <Button type="button" variant="ghost" onClick={() => { setEditingCategory(null); setCategoryForm(emptyCategory); }}>Annulla</Button>}
            </div>
          </form>
        </Card>

        <Card>
          <h2>{editingWork ? 'Modifica opera' : 'Nuova opera'}</h2>
          <form className="grid" onSubmit={submitWork}>
            <Input required minLength={2} maxLength={200} placeholder="Titolo" value={workForm.title} onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })} />
            <Input maxLength={200} placeholder="Autore" value={workForm.author} onChange={(e) => setWorkForm({ ...workForm, author: e.target.value })} />
            <Textarea placeholder="Descrizione" value={workForm.description} onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })} />
            <Input maxLength={500} placeholder="URL immagine" value={workForm.image_url} onChange={(e) => setWorkForm({ ...workForm, image_url: e.target.value })} />
            <Select required value={workForm.category_id} onChange={(e) => setWorkForm({ ...workForm, category_id: e.target.value })}>
              <option value="">Categoria</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Select>
            <Select value={workForm.status} onChange={(e) => setWorkForm({ ...workForm, status: e.target.value as WorkStatus })}>
              <option value="active">Attiva</option>
              <option value="archived">Archiviata</option>
            </Select>
            <div>
              <Button type="submit" disabled={saving}>{editingWork ? 'Salva opera' : 'Crea opera'}</Button>
              {editingWork && <Button type="button" variant="ghost" onClick={() => { setEditingWork(null); setWorkForm(emptyWork); }}>Annulla</Button>}
            </div>
          </form>
        </Card>
      </div>

      <Card>
        <h2>Categorie</h2>
        {categories.length === 0 ? <EmptyState message="Nessuna categoria presente" /> : categories.map((category) => (
          <div className="admin-row" key={category.id}>
            <div><strong>{category.name}</strong><p className="meta">{category.description || 'Nessuna descrizione'}</p></div>
            <div className="admin-actions">
              <Button variant="ghost" onClick={() => { setEditingCategory(category); setCategoryForm({ name: category.name, description: category.description || '' }); }}>Modifica</Button>
              <Button variant="danger" onClick={async () => { if (!window.confirm(`Eliminare la categoria ${category.name}?`)) return; try { await deleteCategory(category.id); toast.success('Categoria eliminata'); await load(); } catch (err) { toast.error(getApiErrorMessage(err, 'Eliminazione non riuscita')); } }}>Elimina</Button>
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <h2>Opere</h2>
        {works.length === 0 ? <EmptyState message="Nessuna opera presente" /> : works.map((work) => (
          <div className="admin-row" key={work.id}>
            <div><strong>{work.title}</strong><p className="meta">{work.author || 'Autore non indicato'} · {work.category.name} · {work.status}</p></div>
            <div className="admin-actions">
              <Button variant="ghost" onClick={() => { setEditingWork(work); startWorkEdit(work); }}>Modifica</Button>
              <Button variant="danger" onClick={async () => { if (!window.confirm(`Eliminare l'opera ${work.title}?`)) return; try { await deleteWork(work.id); toast.success('Opera eliminata'); await load(); } catch (err) { toast.error(getApiErrorMessage(err, 'Eliminazione non riuscita')); } }}>Elimina</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
