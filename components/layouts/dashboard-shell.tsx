import Link from 'next/link'
import { Bell, Search, UserCircle2 } from 'lucide-react'
import { DashboardSidebar } from './dashboard-sidebar'

const links = [
  { label: 'Marketplace', href: '/explore' },
  { label: 'Help', href: '/dashboard/settings' },
  { label: 'Support', href: '/auth/login' },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="af-shell flex min-h-screen bg-background text-on-surface">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col md:pl-0">
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
                <p className="text-sm font-bold text-on-surface">Alex Sterling</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Advertiser</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full border border-primary/25 bg-surface-container text-on-surface ring-2 ring-primary/15">
                <UserCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
