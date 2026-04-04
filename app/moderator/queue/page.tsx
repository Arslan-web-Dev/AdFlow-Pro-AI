'use client'

import type { SVGProps } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { DUMMY_ADS } from '@/lib/dummy-data'
import { CheckCircle2, XCircle, Eye, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ReviewQueuePage() {
  const handleApprove = () => {
    toast.success('Ad approved. Moving to payment pipeline.')
  }
  
  const handleReject = () => {
    toast.error('Ad rejected. Creator notified.')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Review Queue</h1>
          <p className="text-muted-foreground text-lg">Review and moderate user-submitted ads.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search pending ads..." className="pl-11 h-11 bg-muted/30" />
        </div>
      </div>

      <Card className="border-border/80 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold px-6 py-5 hover:bg-transparent cursor-default">Ad Title</TableHead>
              <TableHead className="font-semibold hover:bg-transparent cursor-default">Seller</TableHead>
              <TableHead className="font-semibold hover:bg-transparent cursor-default">Package</TableHead>
              <TableHead className="font-semibold hover:bg-transparent cursor-default">Status</TableHead>
              <TableHead className="text-right font-semibold px-6 hover:bg-transparent cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_ADS.map((ad) => (
              <TableRow key={ad.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-bold px-6 py-4">
                  <div className="line-clamp-1">{ad.title}</div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase block mt-1">{ad.category.name}</span>
                </TableCell>
                <TableCell className="font-medium text-foreground/80">
                  {ad.seller.name}
                  {ad.seller.is_verified && <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 text-[10px] font-bold tracking-widest uppercase leading-none px-2 py-0.5 shadow-sm">Verified</Badge>}
                </TableCell>
                <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">Premium</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-amber-100/50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-sm font-semibold">
                    Pending Review
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-1">
                    <Link href={`/ad/${ad.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" title="Preview" className="hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors mr-1">
                        <Eye className="h-4.5 w-4.5" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={handleApprove} title="Approve" className="hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors mr-1">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 w-9 h-9" title="Reject / Need Changes">
                        <XCircle className="h-5 w-5" />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] border-border/80 shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" /> Reject Listing
                          </DialogTitle>
                          <DialogDescription className="text-base text-muted-foreground/90 pt-2">
                            Please provide a reason for rejecting this ad. The user will be notified to make changes before resuming the workflow.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Textarea placeholder="e.g. Images are confusing, or description violates our platform policy." className="min-h-[140px] text-base resize-none bg-muted/30 focus:bg-background transition-colors p-4" />
                        </div>
                        <DialogFooter className="gap-3 sm:gap-0">
                          <Button variant="outline" className="font-semibold text-muted-foreground">Cancel</Button>
                          <Button variant="destructive" onClick={handleReject} className="font-bold shadow-md shadow-red-500/20 px-8">Confirm Rejection</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function ShieldAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}
