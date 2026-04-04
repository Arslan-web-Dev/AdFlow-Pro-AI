import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardTopBar } from './dashboard-top-bar'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="af-shell flex min-h-screen bg-background text-on-surface">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col md:pl-0">
        <DashboardTopBar />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
