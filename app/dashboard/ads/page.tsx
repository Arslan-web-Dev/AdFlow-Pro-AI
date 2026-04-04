import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DUMMY_ADS } from '@/lib/dummy-data'
import { PlusCircle, ExternalLink, Edit } from 'lucide-react'

export default function MyAdsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Ads</h1>
          <p className="text-muted-foreground text-lg">Manage your ad listings and monitor their status.</p>
        </div>
        <Link href="/dashboard/create">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Ad
          </Button>
        </Link>
      </div>

      <Card className="border-border/80 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold px-6 py-4">Ad Title</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="text-right font-semibold px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_ADS.map((ad) => (
              <TableRow key={ad.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-bold px-6 py-4">
                  <div className="line-clamp-1">{ad.title}</div>
                  {ad.is_featured && <span className="text-[10px] uppercase font-bold text-amber-500/90 tracking-widest leading-tight block mt-1">Featured Badge Active</span>}
                </TableCell>
                <TableCell className="text-muted-foreground font-medium">{ad.category.name}</TableCell>
                <TableCell className="font-bold">${ad.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={ad.status === 'published' ? 'default' : 'secondary'} className={ad.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200 dark:border-emerald-900 shadow-none' : ''}>
                    {ad.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm font-medium">Oct 24, 2023</TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Edit" className="hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Link href={`/ad/${ad.slug}`}>
                      <Button variant="ghost" size="icon" title="View Public" className="hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {DUMMY_ADS.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-medium">
                  You haven&apos;t posted any ads yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
