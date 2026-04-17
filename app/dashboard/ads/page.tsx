'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusCircle, ExternalLink, Edit, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

type AdRow = {
  id: string
  user_id: string
  title: string
  slug: string
  category_id: string | null
  price: number | string | null
  status: string | null
  is_featured: boolean | null
  image_url?: string | null
  image_urls?: string[] | null
}

export default function MyAdsPage() {
  const [ads, setAds] = useState<AdRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adToDelete, setAdToDelete] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalAmount: 0
  })

  useEffect(() => {
    fetchAds()
  }, [])

  // Refresh ads when component gains focus (real-time sync)
  useEffect(() => {
    const handleFocus = () => {
      fetchAds()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const fetchAds = async () => {
    try {
      setLoading(true)
      
      // Fetch all ads from database (not filtered by user_id for now)
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Fetched ads:', data)
      console.log('Fetch error:', error)

      if (error) throw error

      const allAds = (data as AdRow[]) || []
      setAds(allAds)

      // Calculate statistics
      const total = allAds.length
      const pending = allAds.filter(ad => ad.status === 'pending').length
      const approved = allAds.filter(ad => ad.status === 'published').length
      const totalAmount = allAds.reduce((sum, ad) => {
        const price = typeof ad.price === 'number' ? ad.price : parseFloat(ad.price?.toString() || '0')
        return sum + (isNaN(price) ? 0 : price)
      }, 0)

      setStats({ total, pending, approved, totalAmount })

      console.log('Statistics:', { total, pending, approved, totalAmount })
    } catch (error) {
      console.error('Error fetching ads:', error)
      toast.error('Failed to load ads')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (adId: string) => {
    setAdToDelete(adId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (adToDelete) {
      try {
        const { error } = await supabase
          .from('ads')
          .delete()
          .eq('id', adToDelete)

        if (error) throw error

        setAds(ads.filter(ad => ad.id !== adToDelete))
        toast.success('Ad deleted successfully')
        setDeleteDialogOpen(false)
        setAdToDelete(null)
      } catch (error) {
        console.error('Error deleting ad:', error)
        toast.error('Failed to delete ad')
      }
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
          <p className="text-muted-foreground text-lg">Manage your classified advertisements ({stats.total} total)</p>
        </div>
        <Link href="/dashboard/create">
          <Button size="lg" className="btn-primary shadow-lg shadow-primary/25 transition-all scroll-p-2">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Ad
          </Button>
        </Link>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-4">
        <motion.div variants={itemVariants} className="af-panel p-6 border border-primary/20">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Ads</div>
          <div className="text-3xl font-extrabold text-foreground mt-2">{stats.total}</div>
        </motion.div>
        <motion.div variants={itemVariants} className="af-panel p-6 border border-emerald-500/20">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Approved</div>
          <div className="text-3xl font-extrabold text-emerald-500 mt-2">{stats.approved}</div>
        </motion.div>
        <motion.div variants={itemVariants} className="af-panel p-6 border border-amber-500/20">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pending</div>
          <div className="text-3xl font-extrabold text-amber-500 mt-2">{stats.pending}</div>
        </motion.div>
        <motion.div variants={itemVariants} className="af-panel p-6 border border-indigo-500/20">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Value</div>
          <div className="text-3xl font-extrabold text-indigo-500 mt-2">${stats.totalAmount.toLocaleString()}</div>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading ads...</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <motion.div
                key={ad.id}
                whileHover={{ scale: 1.02 }}
                className="af-panel overflow-hidden group"
              >
                {/* Image */}
                <div className="aspect-video bg-muted/30 relative overflow-hidden">
                  {ad.image_urls && ad.image_urls.length > 0 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={ad.image_urls[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : ad.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-black text-muted-foreground/30">AD</span>
                      </div>
                    </>
                  )}
                  {ad.is_featured && (
                    <Badge className="absolute top-3 right-3 bg-[hsl(var(--warning))] text-white font-bold">
                      Featured
                    </Badge>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground line-clamp-1">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground">{ad.category_id ? `Category ID: ${ad.category_id}` : 'AI Generated Ad'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-foreground">
                      {ad.price ? `$${Number(ad.price).toLocaleString()}` : 'N/A'}
                    </span>
                    <Badge 
                      className={ad.status === 'published' 
                        ? 'bg-[hsl(var(--success))] text-white font-bold' 
                        : 'bg-[hsl(var(--warning))] text-white font-bold'
                      }
                    >
                      {ad.status?.replace('_', ' ') || 'Draft'}
                    </Badge>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(ad.id)}
                      className="flex-1 border-border/50 hover:bg-muted"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Link href={`/ad/${ad.slug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-border/50 hover:bg-muted">
                        <ExternalLink className="h-4 w-4 mr-1" /> View
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(ad.id)}
                      className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {ads.length === 0 && (
              <div className="col-span-full">
                <Card className="p-12 text-center border-border/10">
                  <p className="text-muted-foreground font-medium">
                    You haven&apos;t posted any ads yet. <Link href="/dashboard/create" className="text-primary hover:underline">Create your first ad</Link> or <Link href="/dashboard/ai-generator" className="text-primary hover:underline">Generate with AI</Link>
                  </p>
                </Card>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-border/10 bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[hsl(var(--danger))]">
              <AlertCircle className="h-5 w-5" />
              Delete Ad
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this ad? This action cannot be undone and the ad will be permanently removed from the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-border/50">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-[hsl(var(--danger))] hover:bg-[hsl(var(--danger))]/90"
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

