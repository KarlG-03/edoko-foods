import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { CheckCircle, ChefHat } from 'lucide-react';

export function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('id');

  return (
    <main className="min-h-dvh bg-background">
      <header className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ChefHat className="size-5 text-primary" />
            Edoko Foods
          </Link>
        </div>
      </header>
      <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
        <CheckCircle className="size-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold">Order Submitted!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your order. We&apos;ll review the details and get back to you soon.
        </p>
        {orderId && (
          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Order Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-xs break-all">{orderId}</code>
            </CardContent>
          </Card>
        )}
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/menu">View Menu</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
