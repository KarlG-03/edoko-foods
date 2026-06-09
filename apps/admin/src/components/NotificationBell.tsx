import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui';
import { Bell } from 'lucide-react';
import { adminFetch } from '@/lib/api';
import type { Notification } from '@/lib/types';

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const [items, count] = await Promise.all([
        adminFetch<Notification[]>('/api/notifications?unread=true'),
        adminFetch<number>('/api/notifications/unread-count'),
      ]);
      setNotifications(items.slice(0, 10));
      setUnreadCount(count);
    } catch {
      // handled silently
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  async function markAsRead(id: string) {
    try {
      await adminFetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      await load();
    } catch {
      // handled silently
    }
  }

  async function markAllRead() {
    try {
      await adminFetch('/api/notifications/read-all', { method: 'PATCH' });
      await load();
    } catch {
      // handled silently
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative size-9"
        onClick={() => setOpen(!open)}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-popover shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No new notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`cursor-pointer border-b px-4 py-3 transition-colors last:border-0 hover:bg-muted/50 ${
                      !n.isRead ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.orderId) {
                        setOpen(false);
                        navigate('/orders');
                      }
                    }}
                  >
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
