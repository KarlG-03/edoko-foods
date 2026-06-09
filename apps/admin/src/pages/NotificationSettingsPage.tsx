import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@repo/ui';
import { adminFetch } from '@/lib/api';
import type { NotificationSetting } from '@/lib/types';

export function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch<NotificationSetting>('/api/notifications/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await adminFetch<NotificationSetting>('/api/notifications/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          enableInApp: settings.enableInApp,
          enableEmail: settings.enableEmail,
          reminderHoursBefore: settings.reminderHoursBefore,
        }),
      });
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // handled silently
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Could not load notification settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notification Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure how you receive catering reminders and order alerts.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Notification Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.enableInApp}
              onChange={(e) => setSettings({ ...settings, enableInApp: e.target.checked })}
              className="rounded"
            />
            <div>
              <p className="text-sm font-medium">In-App Notifications</p>
              <p className="text-xs text-muted-foreground">
                Show alerts in the notification bell
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.enableEmail}
              onChange={(e) => setSettings({ ...settings, enableEmail: e.target.checked })}
              className="rounded"
            />
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive email reminders for upcoming events
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Reminder Timing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="reminderHours">Hours before event</Label>
          <Input
            id="reminderHours"
            type="number"
            min={1}
            max={168}
            value={settings.reminderHoursBefore}
            onChange={(e) =>
              setSettings({ ...settings, reminderHoursBefore: parseInt(e.target.value, 10) || 24 })
            }
            className="max-w-[120px]"
          />
          <p className="text-xs text-muted-foreground">
            You&apos;ll be reminded this many hours before each catering event.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button disabled={saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </div>
  );
}
