import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Button } from '../ui/Button';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar__inner">
          <Link to="/" className="topbar__brand">
            <Logo size="small" showText />
          </Link>
          <nav className="topbar__nav">
            <NavLink to="/catalogo" className={({ isActive }) => (isActive ? 'active' : undefined)}>Catalogo</NavLink>
            <NavLink to="/eventi" className={({ isActive }) => (isActive ? 'active' : undefined)}>Eventi</NavLink>
            {!user ? (
              <>
                <Link className="topbar__action" to="/login"><LogIn size={16} /> Login</Link>
                <Link className="topbar__action topbar__action--primary" to="/registrazione"><UserPlus size={16} /> Registrati</Link>
              </>
            ) : (
              <>
                {user.role.name === 'Visitatore' && <NavLink to="/dashboard/visitatore" className={({ isActive }) => (isActive ? 'active' : undefined)}>Dashboard</NavLink>}
                {user.role.name === 'Admin' && <NavLink to="/dashboard/admin" className={({ isActive }) => (isActive ? 'active' : undefined)}>Admin</NavLink>}
                <Button variant="ghost" onClick={logout}>Esci</Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container shell app-main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer__inner">
          <Logo size="small" showText />
          <p>CultureHub · piattaforma web per la digitalizzazione dei processi culturali.</p>
        </div>
      </footer>
    </div>
  );
}
