import type { ReactNode } from 'react'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardTopBar } from './dashboard-top-bar'

type DashboardShellProps = {
  children: ReactNode
  /** Full-width band below the header, above the constrained page column (e.g. Meet the Creator on `/dashboard` only). */
  topContent?: ReactNode | null
}

export function DashboardShell({ children, topContent = null }: DashboardShellProps) {
  return (
    <div className="af-shell flex min-h-screen bg-background text-on-surface">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col md:pl-0">
        <DashboardTopBar />

        <main className="flex-1 overflow-y-auto">
          {topContent ? (
            <div className="border-b border-border/15 px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-5 lg:px-8">
              {topContent}
            </div>
          ) : null}
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
