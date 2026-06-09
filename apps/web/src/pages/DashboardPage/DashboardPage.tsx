import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { ShoppingCart, UtensilsCrossed } from 'lucide-react';

export function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to Edoko Foods</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your premium food catering dashboard.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="size-5 text-primary" />
              Browse Menu
            </CardTitle>
            <CardDescription>
              Explore our curated selection of dishes for your next event.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link to="/menu">View Menu</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5 text-primary" />
              Place an Order
            </CardTitle>
            <CardDescription>
              Select dishes, set event details, and submit your catering order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/order">Order Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
