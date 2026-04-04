'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Bell, Globe, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    }
  },
}

export default function SettingsPage() {
  const handleSave = () => toast.success('Settings saved!')
  const handleDelete = () => toast.error('Account deletion requires email confirmation.')

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-3xl"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your notification preferences and account settings.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-white/5 shadow-sm bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
              <Bell className="w-5 h-5 text-primary" /> Notifications
            </CardTitle>
            <CardDescription>Choose how and when you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-6 pb-6">
            {[
              { label: 'Ad Status Updates', desc: 'Get notified when your ad is approved, rejected, or published.', defaultChecked: true },
              { label: 'Payment Confirmations', desc: 'Receive a receipt when a payment is verified.', defaultChecked: true },
              { label: 'Weekly Summary', desc: 'Get a weekly summary of your ad views and impressions.', defaultChecked: false },
              { label: 'Platform Announcements', desc: 'Stay up to date with new AdFlow Pro features and changes.', defaultChecked: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group">
                <div>
                  <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.defaultChecked} className="data-[state=checked]:bg-primary" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-white/5 shadow-sm bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-primary" /> Appearance & Language
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-6 pb-6">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="font-bold text-sm text-white">Dark Mode</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Toggle between light and dark interface.</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                className="bg-primary hover:opacity-90 font-bold h-11 px-8 shadow-lg shadow-primary/25 transition-all active:scale-95" 
                onClick={handleSave}
              >
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-red-500/20 shadow-sm bg-red-500/[0.02] backdrop-blur-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-500">
              <Trash2 className="w-5 h-5" /> Danger Zone
            </CardTitle>
            <CardDescription className="text-red-500/50">These actions are irreversible.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-red-500">Delete Account</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">All your data, ads and history will be permanently removed.</p>
              </div>
              <Button variant="destructive" className="font-bold h-11 px-6 shadow-lg shadow-red-500/20 active:scale-95 transition-all" onClick={handleDelete}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

