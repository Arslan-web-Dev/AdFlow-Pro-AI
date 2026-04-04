'use client'

import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function UserManagementPage() {
  const dummyUsers = [
    { id: '1', email: 'admin@adflow.com', name: 'Super Admin', role: 'super_admin', verified: true },
    { id: '2', email: 'moderator@adflow.com', name: 'Mod Team', role: 'moderator', verified: true },
    { id: '3', email: 'john@doe.com', name: 'John Doe', role: 'client', verified: false },
    { id: '4', email: 'acme@realestate.com', name: 'Acme Real Estate', role: 'client', verified: true },
  ]

  const handleRoleChange = (_userId: string, _newRole: string) => {
    toast.success('User role updated successfully.')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">User Management</h1>
          <p className="text-muted-foreground text-lg">Manage roles and verification status for all platform users.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users by email..." className="pl-11 h-11 bg-muted/30" />
        </div>
      </div>

      <Card className="border-border/80 shadow-sm overflow-hidden mb-8">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold px-6 py-4">User</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Current Role</TableHead>
              <TableHead className="font-semibold px-6">Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground/90">{user.name}</span>
                    {user.verified && (
                      <span title="Verified" className="flex items-center">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-muted-foreground text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'} className={
                    user.role === 'super_admin' ? 'bg-indigo-600 text-white border-transparent' :
                    user.role === 'moderator' ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent' : 'bg-muted/50 border-border/80'
                  }>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="px-6">
                  <Select defaultValue={user.role} onValueChange={(val) => handleRoleChange(user.id, val as string)}>
                    <SelectTrigger className="w-[150px] h-10 bg-muted/20 border-border/60 focus:ring-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {/* Skeleton for Categories / Packages */}
      <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">Pricing Packages Configuration</h2>
      <Card className="border-border/80 shadow-sm bg-muted/10 p-12 text-center rounded-2xl border-dashed">
        <div className="flex justify-center mb-4 opacity-50"><ShieldAlert className="w-10 h-10 text-muted-foreground" /></div>
        <p className="text-muted-foreground font-semibold text-lg">System Configuration Locked</p>
        <p className="text-sm text-muted-foreground/70 mt-2">Currently locked via DB migrations. Check back in the next version.</p>
      </Card>
    </div>
  )
}
