import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { RoleName } from '../../types/api';

export function ProtectedRoute({ roles }: { roles?: RoleName[] }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container shell">Caricamento...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !hasRole(roles)) return <Navigate to="/" replace />;
  return <Outlet />;
}

