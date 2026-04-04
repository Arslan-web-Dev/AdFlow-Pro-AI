'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  Menu,
  Search,
  UserCircle2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const navItems = [
  { label: 'Marketplace', href: '/explore', icon: LayoutGrid },
  { label: 'Creator', href: '/#creator', icon: UserCircle2 },
  { label: 'Help', href: '/dashboard/settings', icon: HelpCircle },
  { label: 'Support', href: '/auth/login', icon: LogIn },
] as const

export function MainNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopExpanded, setDesktopExpanded] = useState(true)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const linkActive = (href: string) => {
    if (href === '/#creator') return pathname === '/'
    if (href === '/explore') return pathname === '/explore' || pathname.startsWith('/ad/')
    return pathname === href || (!href.startsWith('/#') && pathname.startsWith(href))
  }

  return (
    <>
      {/* Mobile: menu trigger when drawer closed */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={cn(
          'fixed left-3 top-3 z-[60] grid h-11 w-11 place-items-center rounded-xl border border-border/50 bg-surface-container-low/95 text-on-surface shadow-lg backdrop-blur-md transition hover:border-primary/40 hover:bg-muted/50 md:hidden',
          mobileOpen && 'pointer-events-none opacity-0'
        )}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      <button
        type="button"
        aria-hidden={!mobileOpen}
        tabIndex={-1}
        className={cn(
          'fixed inset-0 z-[45] bg-background/70 backdrop-blur-sm transition-opacity md:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        data-expanded={desktopExpanded ? 'true' : 'false'}
        className={cn(
          'group/sidebar fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-border/40 bg-surface-container-low/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out',
          'w-[min(280px,88vw)] max-w-[320px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:translate-x-0 md:shadow-none',
          desktopExpanded ? 'md:w-[260px]' : 'md:w-[72px]'
        )}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center gap-1 border-b border-border/30 px-2">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-on-surface-variant hover:bg-muted/60 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex min-w-0 flex-1 items-center gap-2 px-1"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-sm font-black text-primary">
              AF
            </span>
            <span className="truncate text-lg font-bold tracking-tight text-on-surface md:group-data-[expanded=false]/sidebar:hidden">
              AdFlow Pro
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setDesktopExpanded((e) => !e)}
            className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg text-on-surface-variant transition hover:bg-muted/60 md:grid"
            aria-label={desktopExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {desktopExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>

        {/* Profile — circular photo + motion */}
        <div className="flex justify-center border-b border-border/20 py-5">
          <div
            className={cn(
              'relative rounded-full p-0.5 animate-af-nav-ring',
              desktopExpanded ? 'h-[88px] w-[88px]' : 'h-12 w-12 md:h-12 md:w-12'
            )}
          >
            <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-500/80 via-violet-600/80 to-primary p-[3px] shadow-lg">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-[#0f1629]">
                <Image
                  src="/images/creator.png"
                  alt="Creator"
                  fill
                  className="object-cover animate-af-nav-float"
                  sizes="88px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="scrollbar-hide flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = linkActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={item.label}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-on-surface-variant hover:bg-muted/50 hover:text-on-surface',
                  'md:justify-start md:group-data-[expanded=false]/sidebar:justify-center md:group-data-[expanded=false]/sidebar:px-0'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="truncate md:group-data-[expanded=false]/sidebar:hidden">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Search — expanded desktop / always on mobile drawer */}
        <div className="border-t border-border/30 p-3 md:group-data-[expanded=false]/sidebar:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search…"
              className="h-10 border-0 bg-[hsl(var(--input))] pl-10 text-sm text-on-surface placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div className="mt-auto flex flex-col gap-1 border-t border-border/30 p-2">
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-muted/50 hover:text-on-surface md:group-data-[expanded=false]/sidebar:justify-center md:group-data-[expanded=false]/sidebar:px-0"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-5 w-5 shrink-0" />
            <span className="md:group-data-[expanded=false]/sidebar:hidden">Alerts</span>
          </button>
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            title="Dashboard"
            className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15 md:group-data-[expanded=false]/sidebar:justify-center md:group-data-[expanded=false]/sidebar:px-2"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" aria-hidden />
            </span>
            <span className="md:group-data-[expanded=false]/sidebar:hidden">Dashboard</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
