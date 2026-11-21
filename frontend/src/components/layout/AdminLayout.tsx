import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpenText, CalendarDays, Users, MessageSquareText, ClipboardList, LogOut } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/catalogo', label: 'Catalogo', icon: BookOpenText },
  { to: '/admin/eventi', label: 'Eventi', icon: CalendarDays },
  { to: '/admin/prenotazioni', label: 'Prenotazioni', icon: ClipboardList },
  { to: '/admin/utenti', label: 'Utenti', icon: Users },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquareText },
];

export function AdminLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Logo size="small" showText className="admin-sidebar__logo" />
        </div>
        <nav className="admin-sidebar__nav">
          {adminLinks.filter(({ to }) => user?.role.name === 'Admin' || to !== '/dashboard/admin' && to !== '/admin/utenti').map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`.trim()}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-ghost admin-sidebar__logout" onClick={logout}>
          <LogOut size={18} />
          <span>Esci</span>
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
