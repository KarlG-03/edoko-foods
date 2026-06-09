import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { RequireAdmin } from '@/components/RequireAdmin';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { MenuPage } from '@/pages/MenuPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { NotificationSettingsPage } from '@/pages/NotificationSettingsPage';
import { SessionsPage } from '@/pages/SessionsPage';
import { UserSessionsPage } from '@/pages/UserSessionsPage';
import { UsersPage } from '@/pages/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAdmin>
                <AppShell />
              </RequireAdmin>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/notification-settings" element={<NotificationSettingsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id/sessions" element={<UserSessionsPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
