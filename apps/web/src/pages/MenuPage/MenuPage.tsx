import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui';
import { ChefHat } from 'lucide-react';
import { publicJson } from '@/lib/api';
import type { MenuCategory, MenuItem } from '@/lib/types';

const CATEGORIES: { value: MenuCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'APPETIZER', label: 'Appetizers' },
  { value: 'MAIN', label: 'Mains' },
  { value: 'DESSERT', label: 'Desserts' },
  { value: 'BEVERAGE', label: 'Beverages' },
  { value: 'PACKAGE', label: 'Packages' },
];

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicJson<MenuItem[]>('/api/menu')
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ChefHat className="size-5 text-primary" />
            Edoko Foods
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/order">Order Now</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Our Menu</h1>
        <p className="mt-1 text-muted-foreground">
          Browse our curated selection of dishes for your next event.
        </p>

        <Tabs defaultValue="ALL" className="mt-8">
          <TabsList className="flex-wrap">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((cat) => {
            const filtered =
              cat.value === 'ALL'
                ? items
                : items.filter((i) => i.category === cat.value);
            return (
              <TabsContent key={cat.value} value={cat.value}>
                {filtered.length === 0 ? (
                  <p className="py-12 text-center text-muted-foreground">
                    No items in this category yet.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        {item.imageUrl && (
                          <div className="aspect-video w-full overflow-hidden bg-muted">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base">{item.name}</CardTitle>
                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {item.category}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                          <p className="mt-3 text-lg font-semibold text-primary">
                            ₱{item.price.toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link to="/order">Place an Order</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
