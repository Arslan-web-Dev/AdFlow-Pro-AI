'use client'

import { useState } from 'react'
import { DashboardTopBar } from './dashboard-top-bar'
import { AIAssistant, AIToggle } from '@/components/ai/ai-assistant'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isAIActive, setIsAIActive] = useState(false)

  return (
    <div className="af-shell relative flex min-h-screen flex-col overflow-hidden bg-background text-on-surface transition-colors duration-500">
      {/* Animated Background Glows */}
      <div className="af-bg-glow -left-[10%] -top-[10%] h-[500px] w-[500px]" />
      <div className="af-bg-glow -right-[5%] top-[20%] h-[400px] w-[400px] [animation-delay:-5s] opacity-20" />
      <div className="af-bg-glow bottom-[10%] left-[20%] h-[600px] w-[600px] [animation-delay:-10s] opacity-15" />

      <DashboardTopBar isAIActive={isAIActive} onAIToggle={() => setIsAIActive(!isAIActive)} />

      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 custom-scrollbar">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      {/* AI Mode Components */}
      <AIAssistant isOpen={isAIActive} onClose={() => setIsAIActive(false)} />
      <AIToggle isOpen={isAIActive} onClick={() => setIsAIActive(!isAIActive)} />
    </div>
  )
}
