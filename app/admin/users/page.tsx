'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, ShieldAlert, ShieldCheck, Plus, Trash2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function UserManagementPage() {
  const [users, setUsers] = useState([
    { id: '1', email: 'admin@adflow.com', name: 'Super Admin', role: 'super_admin', verified: true },
    { id: '2', email: 'moderator@adflow.com', name: 'Mod Team', role: 'moderator', verified: true },
    { id: '3', email: 'john@doe.com', name: 'John Doe', role: 'client', verified: false },
    { id: '4', email: 'acme@realestate.com', name: 'Acme Real Estate', role: 'client', verified: true },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState<{ name: string; email: string; role: string }>({ name: '', email: '', role: 'client' })

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    const label = users.find((u) => u.id === userId)?.email ?? userId
    toast.success(`Updated ${label} → ${newRole}`)
  }

  const handleDelete = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete))
      toast.success('User deleted successfully')
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleCreate = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all fields')
      return
    }
    const id = (users.length + 1).toString()
    setUsers([...users, { ...newUser, id, verified: false }])
    toast.success('User created successfully')
    setCreateDialogOpen(false)
    setNewUser({ name: '', email: '', role: 'client' })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setCreateDialogOpen(open)
    if (!open) {
      setNewUser({ name: '', email: '', role: 'client' })
    }
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">User Management</h1>
          <p className="text-muted-foreground text-lg">Manage roles and verification status for all platform users.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-11 h-11 bg-muted/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="h-11 gap-2">
            <Plus className="h-4 w-4" /> Add User
          </Button>
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
            {filteredUsers.map((user) => (
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
                  <div className="flex items-center gap-2">
                    <Select defaultValue={user.role} onValueChange={(val) => handleRoleChange(user.id, val as string)}>
                      <SelectTrigger className="w-[140px] h-10 bg-muted/20 border-border/60 focus:ring-indigo-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
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

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the platform. They will receive an email to verify their account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Muhammad Arslan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="arslan@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role || 'client'} 
                onValueChange={(val) => setNewUser({ ...newUser, role: val as string })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
