import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/routing/ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CatalogPage } from '../pages/CatalogPage';
import { WorkDetailPage } from '../pages/WorkDetailPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { BookingPage } from '../pages/BookingPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { VisitorDashboardPage } from '../pages/VisitorDashboardPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminCatalogPage } from '../pages/AdminCatalogPage';
import { AdminEventsPage } from '../pages/AdminEventsPage';
import { AdminBookingsPage } from '../pages/AdminBookingsPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminFeedbackPage } from '../pages/AdminFeedbackPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrazione" element={<RegisterPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalogo/:id" element={<WorkDetailPage />} />
        <Route path="/eventi" element={<EventsPage />} />
        <Route path="/eventi/:id" element={<EventDetailPage />} />

        <Route element={<ProtectedRoute roles={['Admin', 'Operatore', 'Visitatore']} />}>
          <Route path="/prenotazione/:eventId" element={<BookingPage />} />
          <Route path="/feedback/:eventId" element={<FeedbackPage />} />
          <Route path="/dashboard/visitatore" element={<VisitorDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['Admin', 'Operatore']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/catalogo" element={<AdminCatalogPage />} />
            <Route path="/admin/eventi" element={<AdminEventsPage />} />
            <Route path="/admin/prenotazioni" element={<AdminBookingsPage />} />
            <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
            <Route element={<ProtectedRoute roles={['Admin']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/utenti" element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
