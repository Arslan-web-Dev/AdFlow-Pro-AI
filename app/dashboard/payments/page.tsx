'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle2, Clock, XCircle, Download } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const DUMMY_PAYMENTS = [
  { id: 'TXN-1001', date: '2026-03-20', ad: 'Luxury Apartment Downtown', package: 'Premium', amount: 49.99, status: 'verified' },
  { id: 'TXN-1002', date: '2026-03-18', ad: 'MacBook Pro M2', package: 'Standard', amount: 19.99, status: 'pending' },
  { id: 'TXN-1003', date: '2026-03-10', ad: 'Toyota Corolla 2023', package: 'Basic', amount: 9.99, status: 'verified' },
  { id: 'TXN-1004', date: '2026-03-01', ad: 'iPhone 15 Pro Max', package: 'Premium', amount: 49.99, status: 'rejected' },
]

const statusConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  verified: { label: 'Verified', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800', icon: CheckCircle2 },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800', icon: Clock },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800', icon: XCircle },
}

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Payments</h1>
          <p className="text-muted-foreground text-lg">Track all your ad spend and payment history.</p>
        </div>
        <Button variant="outline" className="font-bold gap-2 h-11 border-border/80">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Spent</CardTitle>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg"><CreditCard className="h-4 w-4 text-indigo-600" /></div>
          </CardHeader>
          <CardContent><div className="text-3xl font-extrabold">$129.96</div></CardContent>
        </Card>
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Verified</CardTitle>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
          </CardHeader>
          <CardContent><div className="text-3xl font-extrabold">3</div></CardContent>
        </Card>
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Pending</CardTitle>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg"><Clock className="h-4 w-4 text-amber-600" /></div>
          </CardHeader>
          <CardContent><div className="text-3xl font-extrabold">1</div></CardContent>
        </Card>
      </div>

      <Card className="border-border/80 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold px-6 py-5">Transaction ID</TableHead>
              <TableHead className="font-semibold">Ad Listing</TableHead>
              <TableHead className="font-semibold">Package</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_PAYMENTS.map((p) => {
              const s = statusConfig[p.status]
              const Icon = s.icon
              return (
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground px-6 py-4 font-semibold">{p.id}</TableCell>
                  <TableCell className="font-bold text-foreground/90 max-w-[200px]"><div className="line-clamp-1">{p.ad}</div></TableCell>
                  <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">{p.package}</TableCell>
                  <TableCell className="text-muted-foreground font-medium">{p.date}</TableCell>
                  <TableCell className="font-black text-lg">${p.amount}</TableCell>
                  <TableCell>
                    <Badge className={`${s.className} font-bold flex items-center gap-1 w-fit border text-xs`}>
                      <Icon className="w-3 h-3" /> {s.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
