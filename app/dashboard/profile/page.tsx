'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { User, Phone, MapPin, ShieldCheck, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  
  const handleSave = () => {
    toast.success('Profile updated successfully!')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
  }

  const fullName = user?.user_metadata?.full_name || 'User'
  const email = user?.email || 'user@example.com'
  const initial = fullName.charAt(0).toUpperCase()
  
  const nameParts = fullName.split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your account information and verification status.</p>
      </div>

      {/* Avatar & Status */}
      <Card className="border-border/80 shadow-sm">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/20">
            {initial}
          </div>
          <div>
            <h2 className="text-xl font-bold">{fullName}</h2>
            <p className="text-muted-foreground font-medium text-sm">{email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800 font-bold">Client</Badge>
              <Badge className="bg-muted text-muted-foreground border border-border/60 font-bold gap-1 flex items-center">
                <ShieldCheck className="w-3 h-3" /> Unverified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-lg font-bold flex items-center gap-2"><User className="w-5 h-5 text-indigo-500" /> Personal Information</CardTitle>
          <CardDescription>Update your personal details below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="font-semibold">First Name</Label>
              <Input defaultValue={firstName} className="h-11 bg-muted/20 font-medium" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Last Name</Label>
              <Input defaultValue={lastName} className="h-11 bg-muted/20 font-medium" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</Label>
            <Input defaultValue="+92 300 1234567" className="h-11 bg-muted/20 font-medium" />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4" /> City</Label>
            <Input defaultValue="Karachi" className="h-11 bg-muted/20 font-medium" />
          </div>
          <Separator className="my-2" />
          <div className="flex justify-end">
            <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold h-11 px-8 shadow-md shadow-indigo-500/20 gap-2" onClick={handleSave}>
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
