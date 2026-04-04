'use client'

import Link from 'next/link'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { getDisplayName, getRoleLabel, getUsername } from '@/lib/auth-display'

const links = [
  { label: 'Marketplace', href: '/explore' },
  { label: 'Help', href: '/dashboard/settings' },
  { label: 'Profile', href: '/dashboard/profile' },
]

export function DashboardTopBar() {
  const { user, profile, loading } = useAuth()

  const displayName = getDisplayName(user, profile)
  const username = getUsername(user)
  const roleLabel = getRoleLabel(profile?.role)

  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="af-glass-header sticky top-0 z-30 border-b border-border/30">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden max-w-xl flex-1 items-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search marketplace..."
              className="w-full rounded-full border-0 bg-[hsl(var(--input))] py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <nav className="ml-auto hidden items-center gap-8 text-sm font-medium text-on-surface-variant lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-on-surface">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:ml-0">
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition hover:bg-muted/50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
          </button>
          <div className="hidden border-l border-border/30 pl-4 text-right sm:block">
            {loading ? (
              <p className="text-xs text-muted-foreground">Loading…</p>
            ) : (
              <>
                <p className="text-sm font-bold text-on-surface">{displayName}</p>
                <p className="text-[11px] font-medium text-muted-foreground">
                  @{username} · {roleLabel}
                </p>
              </>
            )}
          </div>
          <Link
            href="/dashboard/profile"
            className="grid h-10 w-10 place-items-center rounded-full border border-primary/25 bg-surface-container text-sm font-black text-primary ring-2 ring-primary/15"
            title="Open profile"
          >
            {user?.user_metadata?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.user_metadata.avatar_url as string}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-black">{initial}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
