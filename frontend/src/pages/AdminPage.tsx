import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminLogin from '../components/admin/AdminLogin';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import BookingsList from '../components/admin/BookingsList';
import AdminGallery from '../components/admin/AdminGallery';
import AdminSettings from '../components/admin/AdminSettings';

function AdminApp({ onLogout }: { onLogout: () => void }) {
  return (
    <AdminLayout onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookings" element={<BookingsList onLogout={onLogout} />} />
        <Route path="/gallery" element={<AdminGallery />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default function AdminPage() {
  const { isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={(email, password) => login(email, password).then(() => undefined)} />;
  }

  return <AdminApp onLogout={logout} />;
}
