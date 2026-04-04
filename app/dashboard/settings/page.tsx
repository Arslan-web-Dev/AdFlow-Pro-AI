'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Bell, Globe, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const handleSave = () => toast.success('Settings saved!')
  const handleDelete = () => toast.error('Account deletion requires email confirmation.')

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your notification preferences and account settings.</p>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-lg font-bold flex items-center gap-2"><Bell className="w-5 h-5 text-indigo-500" /> Notifications</CardTitle>
          <CardDescription>Choose how and when you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-6">
          {[
            { label: 'Ad Status Updates', desc: 'Get notified when your ad is approved, rejected, or published.', defaultChecked: true },
            { label: 'Payment Confirmations', desc: 'Receive a receipt when a payment is verified.', defaultChecked: true },
            { label: 'Weekly Summary', desc: 'Get a weekly summary of your ad views and impressions.', defaultChecked: false },
            { label: 'Platform Announcements', desc: 'Stay up to date with new AdFlow Pro features and changes.', defaultChecked: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
              <div>
                <p className="font-bold text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultChecked} className="data-[state=checked]:bg-indigo-600" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-lg font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-500" /> Appearance & Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-6">
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div>
              <p className="font-bold text-sm">Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">Toggle between light and dark interface.</p>
            </div>
            <Switch className="data-[state=checked]:bg-indigo-600" />
          </div>
          <div className="flex justify-end pt-2">
            <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold h-11 px-8 shadow-md shadow-indigo-500/20" onClick={handleSave}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900/60 shadow-sm bg-red-50/40 dark:bg-red-950/10">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-700 dark:text-red-400"><Trash2 className="w-5 h-5" /> Danger Zone</CardTitle>
          <CardDescription className="text-red-600/70 dark:text-red-400/70">These actions are irreversible.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-red-700 dark:text-red-400">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">All your data, ads and history will be permanently removed.</p>
            </div>
            <Button variant="destructive" className="font-bold h-11 px-6 shadow-md shadow-red-500/20" onClick={handleDelete}>Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
