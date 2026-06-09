import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { ChefHat, Clock, MapPin, UtensilsCrossed } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export function LandingPage() {
  const [featured, setFeatured] = useState<MenuItem[]>([]);

  useEffect(() => {
    const base = getApiBaseUrl();
    if (!base) return;
    fetch(`${base}/api/menu`)
      .then((r) => r.json())
      .then((data: MenuItem[]) => setFeatured(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-dvh bg-background">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center gap-6 px-6 py-24 text-center sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative z-10 space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ChefHat className="size-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Edoko Foods
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Premium catering for every occasion. From intimate gatherings to grand celebrations,
            we craft unforgettable culinary experiences.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/order">Place an Order</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/menu">View Menu</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: UtensilsCrossed, title: 'Diverse Menu', desc: 'From appetizers to desserts, curated for every palate.' },
            { icon: Clock, title: 'On-Time Delivery', desc: 'Punctual service so your event runs smoothly.' },
            { icon: MapPin, title: 'Any Venue', desc: 'We cater at your chosen location, indoors or outdoors.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Menu */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
            Featured Dishes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
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
                  <CardTitle className="text-base">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <p className="mt-2 font-semibold text-primary">
                    ₱{item.price.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/menu">See Full Menu</Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-muted/50 px-6 py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Ready to plan your event?</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Tell us about your occasion and let us handle the food.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/order">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/menu">View Menu</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Edoko Foods. All rights reserved.
      </footer>
    </main>
  );
}
