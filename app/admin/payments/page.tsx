'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle2, Search, ExternalLink, Trash2, AlertCircle, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'

export default function PaymentVerificationQueuePage() {
  const [payments, setPayments] = useState([
    { id: 'pay_1', user: 'Acme Real Estate', adTitle: 'Luxury Apartment in Downtown', amount: 49.99, method: 'Credit Card', status: 'pending', ref: 'txn_xasd2312' },
    { id: 'pay_2', user: 'Tech Reseller LLC', adTitle: 'MacBook Pro M2 Max 64GB', amount: 19.99, method: 'Bank Transfer', status: 'pending', ref: 'txn_bhq23ks9' },
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [paymentToReject, setPaymentToReject] = useState<string | null>(null)

  const handleVerify = (paymentId: string) => {
    setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'verified' } : p))
    toast.success('Payment verified. Ad is now officially published.')
  }

  const handleReject = (paymentId: string) => {
    setPaymentToReject(paymentId)
    setRejectDialogOpen(true)
  }

  const confirmReject = () => {
    if (paymentToReject) {
      setPayments(payments.map(p => p.id === paymentToReject ? { ...p, status: 'rejected' } : p))
      toast.error('Payment rejected. User notified.')
      setRejectDialogOpen(false)
      setPaymentToReject(null)
    }
  }

  const handleDelete = (paymentId: string) => {
    setPaymentToDelete(paymentId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (paymentToDelete) {
      setPayments(payments.filter(p => p.id !== paymentToDelete))
      toast.success('Payment record deleted.')
      setDeleteDialogOpen(false)
      setPaymentToDelete(null)
    }
  }

  const filteredPayments = payments.filter(p =>
    p.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Payment Verifications</h1>
          <p className="text-muted-foreground text-lg">Manually verify pending payments before ads go live.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Txn ID..." 
            className="pl-11 h-11 bg-muted/30" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-border/80 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold px-6 py-5">Transaction Ref</TableHead>
              <TableHead className="font-semibold">User & Ad Info</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Method</TableHead>
              <TableHead className="text-right font-semibold px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((pay) => (
              <TableRow key={pay.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs font-semibold px-6 py-4 text-muted-foreground">
                  {pay.ref}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-foreground/90">{pay.user}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1 flex items-center gap-1 font-medium">
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400 px-1.5 py-0.5 rounded mr-1">AD</span> 
                    {pay.adTitle} <Link href="#"><ExternalLink className="w-3 h-3 text-indigo-500 hover:text-indigo-700"/></Link>
                  </div>
                </TableCell>
                <TableCell className="font-black text-xl text-foreground tracking-tighter">
                  ${pay.amount}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-bold tracking-widest uppercase text-[10px] bg-muted/50 border-border/80 text-foreground/70 py-1">
                    {pay.method}
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    {pay.status === 'pending' && (
                      <>
                        <Button onClick={() => handleVerify(pay.id)} className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 font-bold h-10 px-6 transition-all">
                          <CheckCircle2 className="h-4.5 w-4.5 mr-2" /> Verify
                        </Button>
                        <Button onClick={() => handleReject(pay.id)} variant="destructive" className="font-bold h-10 px-6 transition-all">
                          <XCircle className="h-4.5 w-4.5 mr-2" /> Reject
                        </Button>
                      </>
                    )}
                    <Button onClick={() => handleDelete(pay.id)} variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No payments found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-white/10 bg-surface-container">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Delete Payment Record
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this payment record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-white/10">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-white/10 bg-surface-container">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <XCircle className="h-5 w-5" />
              Reject Payment
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to reject this payment? The user will be notified and the ad will not be published.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="border-white/10">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              className="bg-red-500 hover:bg-red-600"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
