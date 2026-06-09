import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, NativeSelect } from '@repo/ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { adminFetch } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const q = statusFilter ? `?status=${statusFilter}` : '';
      const data = await adminFetch<Order[]>(`/api/orders${q}`);
      setOrders(data);
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    try {
      await adminFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await loadOrders();
    } catch {
      // handled silently
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} order(s)</p>
        </div>
        <NativeSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </NativeSelect>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const expanded = expandedId === order.id;
            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div
                    className="flex cursor-pointer items-center gap-4"
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{order.customerName}</p>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.eventDate).toLocaleDateString()} at {order.eventTime} &middot; {order.eventLocation}
                      </p>
                    </div>
                    <p className="font-semibold shrink-0">₱{order.totalAmount.toLocaleString()}</p>
                    {expanded ? <ChevronUp className="size-4 shrink-0" /> : <ChevronDown className="size-4 shrink-0" />}
                  </div>

                  {expanded && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Contact</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-1">
                            <p>{order.customerName}</p>
                            <p>{order.customerEmail}</p>
                            <p>{order.customerPhone}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Event</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-1">
                            <p>{new Date(order.eventDate).toLocaleDateString()} at {order.eventTime}</p>
                            <p>{order.eventLocation}</p>
                            <p>{order.guestCount} guests</p>
                            {order.specialRequests && (
                              <p className="text-muted-foreground">{order.specialRequests}</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-medium">Items</h4>
                        <div className="rounded-lg border text-sm">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b px-3 py-2 last:border-0">
                              <span>{item.menuItem.name} &times; {item.quantity}</span>
                              <span>₱{item.subtotal.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between bg-muted/50 px-3 py-2 font-medium">
                            <span>Total</span>
                            <span>₱{order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Update status:</span>
                        {ALL_STATUSES.map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            variant={order.status === s ? 'default' : 'outline'}
                            className="text-xs"
                            onClick={() => updateStatus(order.id, s)}
                          >
                            {s.replace('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
