'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DUMMY_ADS } from '@/lib/dummy-data'
import { PlusCircle, ExternalLink, Edit, Trash2, AlertCircle } from 'lucide-react'
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

export default function MyAdsPage() {
  const [ads, setAds] = useState(DUMMY_ADS)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adToDelete, setAdToDelete] = useState<string | null>(null)

  const handleDelete = (adId: string) => {
    setAdToDelete(adId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (adToDelete) {
      setAds(ads.filter(ad => ad.id !== adToDelete))
      toast.success('Ad deleted successfully')
      setDeleteDialogOpen(false)
      setAdToDelete(null)
    }
  }

  const handleEdit = (adId: string) => {
    toast.info(`Edit functionality for ad ${adId} - Navigate to edit page`)
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Ads</h1>
          <p className="text-muted-foreground text-lg">Manage your ad listings and monitor their status.</p>
        </div>
        <Link href="/dashboard/create">
          <Button size="lg" className="bg-primary hover:opacity-90 shadow-lg shadow-primary/25 transition-all scroll-p-2 active:scale-95">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Ad
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-white/5 shadow-sm overflow-hidden bg-white/[0.02] backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="font-semibold px-6 py-4 text-white">Ad Title</TableHead>
                <TableHead className="font-semibold text-white">Category</TableHead>
                <TableHead className="font-semibold text-white">Price</TableHead>
                <TableHead className="font-semibold text-white">Status</TableHead>
                <TableHead className="font-semibold text-white">Date</TableHead>
                <TableHead className="text-right font-semibold px-6 text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id} className="hover:bg-white/[0.03] transition-colors border-white/5">
                  <TableCell className="font-bold px-6 py-4">
                    <div className="line-clamp-1 text-white">{ad.title}</div>
                    {ad.is_featured && (
                      <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-widest leading-tight block mt-1">
                        Featured Badge Active
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">{ad.category.name}</TableCell>
                  <TableCell className="font-black text-white">${ad.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={ad.status === 'published' ? 'default' : 'secondary'} 
                      className={ad.status === 'published' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 shadow-none font-bold' : 'bg-white/5 text-white/60 border-white/10 font-bold'}
                    >
                      {ad.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-medium">Oct 24, 2023</TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Edit" 
                        onClick={() => handleEdit(ad.id)}
                        className="text-white/60 hover:text-primary hover:bg-white/5 transition-all active:scale-90"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Link href={`/ad/${ad.slug}`}>
                        <Button variant="ghost" size="icon" title="View Public" className="text-white/60 hover:text-primary hover:bg-white/5 transition-all active:scale-90">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Delete"
                        onClick={() => handleDelete(ad.id)}
                        className="text-white/60 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {ads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-medium">
                    You haven&apos;t posted any ads yet. <Link href="/dashboard/create" className="text-primary hover:underline">Create your first ad</Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-white/10 bg-surface-container">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Delete Ad
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this ad? This action cannot be undone and the ad will be permanently removed from the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-white/10">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Ad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

