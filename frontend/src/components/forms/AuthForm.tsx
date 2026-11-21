import { useState, type ReactNode } from 'react';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export function AuthForm({
  title,
  submitLabel,
  onSubmit,
  extra,
}: {
  title: string;
  submitLabel: string;
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  extra?: ReactNode;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Card className="auth-card">
      <div className="auth-card__brand">
        <Logo size="large" showText />
      </div>
      <h1>{title}</h1>
      <form
        className="grid"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await onSubmit({ email, password });
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" disabled={loading} variant="primary">{loading ? 'Attendere...' : submitLabel}</Button>
      </form>
      {extra}
    </Card>
  );
}
