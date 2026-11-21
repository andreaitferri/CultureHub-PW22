import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function NotFoundPage() {
  return (
    <div className="page-center">
      <Card className="notfound-card">
        <Logo size="large" showText />
        <h1>Pagina non trovata</h1>
        <p className="text-secondary">La pagina richiesta non è disponibile oppure è stata spostata.</p>
        <Link to="/">
          <Button variant="primary">Torna alla home</Button>
        </Link>
      </Card>
    </div>
  );
}

