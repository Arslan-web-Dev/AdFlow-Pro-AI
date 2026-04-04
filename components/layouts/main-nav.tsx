'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const navItems = [
  { label: 'Marketplace', href: '/explore' },
  { label: 'Creator', href: '/#creator' },
  { label: 'Help', href: '/dashboard/settings' },
  { label: 'Support', href: '/auth/login' },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="af-glass-header fixed top-0 z-50 w-full border-b border-white/5">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-on-surface">
            AdFlow Pro
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const active =
                item.href === '/#creator'
                  ? pathname === '/'
                  : item.href === '/explore'
                    ? pathname === '/explore' || pathname.startsWith('/ad/')
                    : pathname === item.href ||
                      (item.href !== '/' && !item.href.startsWith('/#') && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'pb-1 text-sm font-medium transition-colors',
                    active
                      ? 'border-b-2 border-primary font-semibold text-primary'
                      : 'border-b-2 border-transparent text-on-surface-variant hover:text-on-surface'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative hidden max-w-xs lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              className="h-9 rounded-full border-0 bg-[hsl(var(--input))] pl-10 pr-4 text-sm text-on-surface placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-muted/60"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link
            href="/dashboard"
            className="h-9 w-9 overflow-hidden rounded-full border border-border/50 ring-2 ring-primary/20 transition hover:ring-primary/40"
          >
            <span className="flex h-full w-full items-center justify-center bg-surface-container-high text-xs font-bold text-primary">
              AF
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
