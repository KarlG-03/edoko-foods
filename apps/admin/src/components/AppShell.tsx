import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  ClipboardList,
  LogOut,
  Shield,
  UtensilsCrossed,
  Users,
  Wifi,
} from 'lucide-react';
import { Button } from '@repo/ui';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';

const navItems = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/notification-settings', icon: Bell, label: 'Notifications' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/sessions', icon: Wifi, label: 'Sessions' },
];

export function AppShell() {
  const { logout, adminEmail } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-dvh bg-background">
      <aside className="w-56 flex-none border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Shield className="size-5 text-primary" />
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t space-y-1">
          {adminEmail && (
            <p className="text-xs text-muted-foreground px-1 truncate">{adminEmail}</p>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 items-center justify-end border-b px-4">
          <NotificationBell />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
