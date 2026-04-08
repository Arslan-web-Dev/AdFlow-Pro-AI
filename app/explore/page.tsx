import Link from 'next/link'
import Image from 'next/image'
import {
  Briefcase,
  Car,
  ChevronDown,
  Grid3X3,
  Home,
  Laptop,
  LayoutGrid,
  MapPin,
  Search,
  Clock,
} from 'lucide-react'
import { SiteHeader, ThemeBar } from '@/components/layouts/site-header'
import { SiteFooter } from '@/components/layouts/site-footer'
import { Button } from '@/components/ui/button'
import { DUMMY_ADS, DUMMY_CATEGORIES, DUMMY_CITIES } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

const categoryIcon = (slug: string) => {
  switch (slug) {
    case 'real-estate':
      return Home
    case 'jobs':
      return Briefcase
    case 'electronics':
      return Laptop
    case 'vehicles':
      return Car
    default:
      return Grid3X3
  }
}

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <SiteHeader />
      <ThemeBar />
      <div className="flex min-h-0 flex-1">
        {/* Filter sidebar — discovery UI beside main nav */}
        <aside className="scrollbar-hide sticky top-28 z-20 hidden h-[calc(100vh-112px)] w-72 shrink-0 overflow-y-auto border-r border-border/30 bg-surface-container-low py-8 pl-6 pr-5 md:block">
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Discovery</h3>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search ads..."
                  className="w-full rounded-lg border-0 bg-[hsl(var(--input))] py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Categories</h3>
              <div className="space-y-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg bg-primary/15 px-3 py-2 text-left text-sm font-medium text-primary"
                >
                  <span className="flex items-center gap-3">
                    <LayoutGrid className="h-5 w-5 shrink-0" />
                    All Ads
                  </span>
                </button>
                {DUMMY_CATEGORIES.slice(0, 5).map((c) => {
                  const Icon = categoryIcon(c.slug)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-on-surface-variant transition-colors hover:bg-muted/50"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0 opacity-90" />
                        {c.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Location</h3>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border-0 bg-[hsl(var(--input))] py-2.5 pl-4 pr-10 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
                  {DUMMY_CITIES.slice(0, 6).map((c) => (
                    <option key={c.id}>
                      {c.name}, {c.state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg accent-primary"
                  aria-label="Price range"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full rounded-lg border-0 bg-[hsl(var(--input))] px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full rounded-lg border-0 bg-[hsl(var(--input))] px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90">
              Apply Filters
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="p-6 lg:p-10">
            <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">Explore Ads</h1>
                <p className="mt-2 text-base text-on-surface-variant md:text-lg">
                  Discover premium opportunities in the global marketplace.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sort By</span>
                <div className="relative">
                  <select className="appearance-none rounded-lg border border-border/50 bg-surface-container py-2 pl-4 pr-10 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Latest Arrivals</option>
                    <option>Featured First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {DUMMY_ADS.map((ad) => (
                <Link href={`/ad/${ad.slug}`} key={ad.id} className="group block h-full">
                  <article
                    className={cn(
                      'flex h-full flex-col overflow-hidden rounded-xl bg-surface-container ring-1 ring-border/40 transition-all duration-300',
                      'hover:-translate-y-1 hover:ring-primary/35'
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={ad.thumbnail}
                        alt={ad.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {ad.is_featured && (
                        <div className="absolute left-4 top-4">
                          <span className="rounded border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md">
                            Premium
                          </span>
                        </div>
                      )}
                      {!ad.is_featured && ad.seller.is_verified && (
                        <div className="absolute left-4 top-4">
                          <span className="rounded border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                            {ad.category.name}
                          </span>
                          <h3 className="text-xl font-bold leading-tight text-on-surface transition-colors group-hover:text-primary/90">
                            {ad.title}
                          </h3>
                        </div>
                        <p className="text-xl font-black text-on-surface">${ad.price.toLocaleString()}</p>
                      </div>
                      <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 shrink-0" />
                          {ad.city.name}, {ad.city.state}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 shrink-0" />
                          Recently listed
                        </span>
                      </div>
                      <span className="mt-auto block w-full rounded-lg border border-border/50 py-2.5 text-center text-sm font-medium text-on-surface transition-colors group-hover:bg-muted/40">
                        View Details
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Previous page"
              >
                ‹
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition-colors hover:bg-muted"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition-colors hover:bg-muted"
              >
                3
              </button>
              <span className="px-2 text-muted-foreground">…</span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
