import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@repo/ui';
import { ChefHat, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { publicJson } from '@/lib/api';
import type { MenuItem } from '@/lib/types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

type Step = 'items' | 'details' | 'contact' | 'review';
const STEPS: Step[] = ['items', 'details', 'contact', 'review'];
const STEP_LABELS: Record<Step, string> = {
  items: 'Select Items',
  details: 'Event Details',
  contact: 'Contact Info',
  review: 'Review & Submit',
};

export function OrderPage() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [step, setStep] = useState<Step>('items');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    publicJson<MenuItem[]>('/api/menu')
      .then(setMenuItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cartItems = Array.from(cart.values());
  const total = cartItems.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const stepIdx = STEPS.indexOf(step);

  function updateQty(item: MenuItem, delta: number) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      const newQty = (existing?.quantity ?? 0) + delta;
      if (newQty <= 0) {
        next.delete(item.id);
      } else {
        next.set(item.id, { menuItem: item, quantity: newQty });
      }
      return next;
    });
  }

  function canAdvance(): boolean {
    switch (step) {
      case 'items':
        return cart.size > 0;
      case 'details':
        return !!(eventDate && eventTime && eventLocation && guestCount);
      case 'contact':
        return !!(customerName && customerEmail && customerPhone);
      default:
        return true;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const base = import.meta.env.VITE_API_URL?.trim()?.replace(/\/$/, '') || '';
      const res = await fetch(`${base}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          eventDate,
          eventTime,
          eventLocation,
          guestCount: parseInt(guestCount, 10),
          specialRequests: specialRequests || undefined,
          items: cartItems.map((i) => ({
            menuItemId: i.menuItem.id,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message || 'Failed to submit order');
      }
      const order = await res.json();
      navigate(`/order/success?id=${(order as { id: string }).id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground">Loading menu...</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background">
      <header className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ChefHat className="size-5 text-primary" />
            Edoko Foods
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/menu">Menu</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Place Your Order</h1>

        {/* Stepper */}
        <div className="mt-6 flex gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= stepIdx ? 'bg-primary' : 'bg-muted'
                }`}
              />
              <p className={`mt-1 text-xs ${i <= stepIdx ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {STEP_LABELS[s]}
              </p>
            </div>
          ))}
        </div>

        {/* Step: Items */}
        {step === 'items' && (
          <div className="mt-8 space-y-4">
            {menuItems.length === 0 ? (
              <p className="text-muted-foreground">No menu items available.</p>
            ) : (
              menuItems.map((item) => {
                const qty = cart.get(item.id)?.quantity ?? 0;
                return (
                  <Card key={item.id}>
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        <p className="text-sm font-semibold text-primary">₱{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          disabled={qty === 0}
                          onClick={() => updateQty(item, -1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{qty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => updateQty(item, 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
            {cart.size > 0 && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} item(s) &mdash;{' '}
                  <span className="text-primary">₱{total.toLocaleString()}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step: Event Details */}
        {step === 'details' && (
          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime">Event Time</Label>
              <Input id="eventTime" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventLocation">Venue / Location</Label>
              <Input id="eventLocation" placeholder="e.g., 123 Main St, Manila" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestCount">Number of Guests</Label>
              <Input id="guestCount" type="number" min={1} value={guestCount} onChange={(e) => setGuestCount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (optional)</Label>
              <textarea
                id="specialRequests"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Allergies, dietary restrictions, setup preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step: Contact */}
        {step === 'contact' && (
          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name</Label>
              <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone</Label>
              <Input id="customerPhone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>
          </div>
        )}

        {/* Step: Review */}
        {step === 'review' && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {cartItems.map((i) => (
                  <div key={i.menuItem.id} className="flex justify-between">
                    <span>{i.menuItem.name} &times; {i.quantity}</span>
                    <span>₱{(i.menuItem.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span className="text-primary">₱{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Date:</span> {eventDate}</p>
                <p><span className="text-muted-foreground">Time:</span> {eventTime}</p>
                <p><span className="text-muted-foreground">Location:</span> {eventLocation}</p>
                <p><span className="text-muted-foreground">Guests:</span> {guestCount}</p>
                {specialRequests && (
                  <p><span className="text-muted-foreground">Notes:</span> {specialRequests}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>{customerName}</p>
                <p>{customerEmail}</p>
                <p>{customerPhone}</p>
              </CardContent>
            </Card>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            disabled={stepIdx === 0}
            onClick={() => setStep(STEPS[stepIdx - 1])}
          >
            <ChevronLeft className="mr-1 size-4" />
            Back
          </Button>

          {step === 'review' ? (
            <Button disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'Submitting...' : 'Submit Order'}
            </Button>
          ) : (
            <Button disabled={!canAdvance()} onClick={() => setStep(STEPS[stepIdx + 1])}>
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
