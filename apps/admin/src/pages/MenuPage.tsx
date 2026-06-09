import { useCallback, useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  NativeSelect,
} from '@repo/ui';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { adminFetch } from '@/lib/api';
import type { MenuCategory, MenuItem } from '@/lib/types';

const CATEGORIES: MenuCategory[] = ['APPETIZER', 'MAIN', 'DESSERT', 'BEVERAGE', 'PACKAGE'];

type FormData = {
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  imageUrl: string;
  isAvailable: boolean;
};

const emptyForm: FormData = {
  name: '',
  description: '',
  price: '',
  category: 'MAIN',
  imageUrl: '',
  isAvailable: true,
};

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [filter, setFilter] = useState('');

  const loadItems = useCallback(async () => {
    try {
      const data = await adminFetch<MenuItem[]>('/api/menu/all');
      setItems(data);
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        imageUrl: form.imageUrl || undefined,
        isAvailable: form.isAvailable,
      };
      if (editing) {
        await adminFetch(`/api/menu/${editing.id}`, { method: 'PATCH', body: JSON.stringify(body) });
      } else {
        await adminFetch('/api/menu', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      await loadItems();
    } catch {
      // handled silently
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await adminFetch(`/api/menu/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await loadItems();
    } catch {
      // handled silently
    }
  }

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(filter.toLowerCase()) ||
      i.category.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Menu Items</h1>
          <p className="text-sm text-muted-foreground">{items.length} items total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 size-4" /> Add Item
        </Button>
      </div>

      <Input
        placeholder="Search by name or category..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 text-center font-medium">Available</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{item.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">₱{item.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={item.isAvailable ? 'default' : 'destructive'}>
                      {item.isAvailable ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(item)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setDeleteTarget(item)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">
                {editing ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₱)</Label>
                  <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <NativeSelect value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MenuCategory })}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </NativeSelect>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL (optional)</Label>
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="rounded"
                />
                Available for ordering
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button disabled={saving || !form.name || !form.description || !form.price} onClick={handleSave}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &ldquo;{deleteTarget?.name}&rdquo; from the menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
