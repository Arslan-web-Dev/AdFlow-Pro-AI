'use client'

import Link from 'next/link'
import Image from 'next/image'
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

  const PROFILE_IMAGE_URL = 'https://raw.githubusercontent.com/Arslan-web-Dev/My-projects-picks/refs/heads/main/personalpicks%20(1).png'

  return (
    <header className="af-glass-header sticky top-0 z-30">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden max-w-xl flex-1 items-center md:flex">
          <div className="relative w-full max-w-md group">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="search"
              placeholder="Search marketplace..."
              className="w-full rounded-full border border-white/5 bg-white/5 py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10"
            />
          </div>
        </div>

        <nav className="ml-auto hidden items-center gap-8 text-sm font-medium text-on-surface-variant lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-on-surface hover:translate-y-[-1px]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:ml-0">
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-[#0f172a]" />
          </button>
          <div className="hidden pl-4 text-right sm:block">
            {loading ? (
              <p className="text-xs text-muted-foreground">Loading…</p>
            ) : (
              <>
                <p className="text-sm font-bold text-on-surface leading-tight">{displayName}</p>
                <p className="text-[11px] font-medium text-muted-foreground/60">
                  @{username} · {roleLabel}
                </p>
              </>
            )}
          </div>
          <Link
            href="/dashboard/profile"
            className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary/20 ring-4 ring-primary/5 transition-all hover:scale-110 active:scale-95"
            title="Open profile"
          >
            <Image
              src={PROFILE_IMAGE_URL}
              alt={displayName}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
