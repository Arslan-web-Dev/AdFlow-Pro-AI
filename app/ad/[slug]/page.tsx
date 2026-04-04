import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bath, Bed, CheckCircle2, ChevronRight, Flag, Heart, Mail, MapPin, Star } from 'lucide-react'
import { MainNav } from '@/components/layouts/main-nav'
import { SiteFooter } from '@/components/layouts/site-footer'
import { Button } from '@/components/ui/button'
import { DUMMY_ADS } from '@/lib/dummy-data'

export default function AdDetailPage({ params }: { params: { slug: string } }) {
  const ad = DUMMY_ADS.find((a) => a.slug === params.slug)

  if (!ad) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <MainNav />
      <div className="flex min-w-0 flex-1 flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-16 md:px-8 md:pt-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium text-on-surface-variant">
          <Link href="/explore" className="transition-colors hover:text-on-surface">
            Marketplace
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
          <span>{ad.category.name}</span>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
          <span className="text-on-surface">{ad.title}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="space-y-4">
              <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-surface-container">
                <Image src={ad.thumbnail} alt={ad.title} fill className="object-cover" priority />
                {ad.is_featured && (
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                      Premium Package
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/50 text-on-surface backdrop-blur-md transition-colors hover:bg-background/70"
                  aria-label="Save listing"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
                <div className="relative aspect-square overflow-hidden rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-background">
                  <Image src={ad.thumbnail} alt="" fill className="object-cover" />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-lg opacity-90 transition-opacity hover:opacity-100">
                  <Image src={ad.thumbnail} alt="" fill className="object-cover" />
                </div>
              </div>
            </section>

            <section className="space-y-6 rounded-xl bg-surface-container p-8">
              <h2 className="text-xl font-bold text-on-surface">Listing Description</h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant leading-relaxed">
                <p>{ad.description}</p>
                <ul className="mt-6 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2">
                  {['Detailed photos & verified seller', 'Secure messaging through AdFlow', 'Location context on map below'].map((line) => (
                    <li key={line} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <section className="glass-effect space-y-4 rounded-xl border border-border/30 bg-surface-container-high p-6 shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.5)]">
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-primary">
                  {ad.category.name} • {ad.is_featured ? 'Featured' : 'Standard'}
                </span>
                <h1 className="text-2xl font-black leading-tight text-on-surface">{ad.title}</h1>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {ad.city.name}, {ad.city.state}
                </span>
              </div>
              <div className="flex items-end justify-between border-y border-border/30 py-4">
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-tighter text-on-surface-variant">
                    Price
                  </span>
                  <span className="text-3xl font-black text-on-surface">${ad.price.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="mb-1 block text-xs text-on-surface-variant">Listing</span>
                  <span className="text-sm font-bold text-muted-foreground">Live now</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <Bed className="mx-auto mb-1 h-6 w-6 text-accent" />
                  <span className="block text-xs text-on-surface-variant">Layout</span>
                  <span className="block text-sm font-bold">Multi-room</span>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <Bath className="mx-auto mb-1 h-6 w-6 text-accent" />
                  <span className="block text-xs text-on-surface-variant">Details</span>
                  <span className="block text-sm font-bold">As listed</span>
                </div>
              </div>
            </section>

            <section className="space-y-6 rounded-xl bg-surface-container p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-primary/30 bg-muted text-lg font-bold text-primary">
                  {ad.seller.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold text-on-surface">{ad.seller.name}</h3>
                  <div className="mb-1 flex flex-wrap items-center gap-1 text-primary">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                    <Star className="h-4 w-4 text-primary" />
                    <span className="ml-1 text-xs font-bold text-on-surface-variant">4.8 (demo)</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Verified on AdFlow Pro</span>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="flex h-12 w-full items-center justify-center gap-2 bg-primary font-bold text-primary-foreground hover:opacity-90">
                  <Mail className="h-4 w-4" />
                  Contact Seller
                </Button>
                <Button
                  variant="outline"
                  className="flex h-12 w-full items-center justify-center gap-2 border-border/50 bg-muted/30 font-bold text-on-surface hover:bg-muted/60"
                >
                  <Flag className="h-4 w-4" />
                  Report Ad
                </Button>
              </div>
              <div className="border-t border-border/30 pt-4 text-center">
                <Link href="/explore" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                  View All Listings
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </section>

            <section className="relative h-48 overflow-hidden rounded-xl bg-surface-container">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative text-center">
                  <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded border border-primary/25 bg-background px-2 py-1 text-[10px] font-bold shadow-lg">
                    Exact location hidden
                  </div>
                  <MapPin className="mx-auto h-10 w-10 text-primary" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 rounded-full border border-border/30 bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                {ad.city.name}, {ad.city.state}
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
      </div>
    </div>
  )
}
