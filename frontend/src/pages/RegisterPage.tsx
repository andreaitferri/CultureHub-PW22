import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Logo } from '../components/common/Logo';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { registerRequest } from '../services/authService';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  return (
    <Card className="auth-card">
      <div className="auth-card__brand">
        <Logo size="large" showText />
      </div>
      <h1>Registrazione</h1>
      <form
        className="grid"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await registerRequest(form);
            toast.success('Registrazione completata');
            navigate('/login');
          } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Registrazione non riuscita');
          }
        }}
      >
        <Input placeholder="Nome" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <Input placeholder="Cognome" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" variant="primary">Crea account</Button>
      </form>
    </Card>
  );
}
