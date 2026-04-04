import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardTopBar } from './dashboard-top-bar'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="af-shell relative flex h-screen overflow-hidden bg-background text-on-surface">
      {/* Animated Background Glows */}
      <div className="af-bg-glow -left-[10%] -top-[10%] h-[500px] w-[500px]" />
      <div className="af-bg-glow -right-[5%] top-[20%] h-[400px] w-[400px] [animation-delay:-5s] opacity-20" />
      <div className="af-bg-glow bottom-[10%] left-[20%] h-[600px] w-[600px] [animation-delay:-10s] opacity-15" />

      <DashboardSidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardTopBar />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10 custom-scrollbar">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
