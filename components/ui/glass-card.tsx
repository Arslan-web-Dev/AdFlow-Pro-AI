'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
}: GlassCardProps) {
  return (
    <div
      className={`
        relative backdrop-blur-xl
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/10
        rounded-2xl
        overflow-hidden
        transition-transform duration-200
        ${hover ? 'hover:scale-[1.02] hover:-translate-y-1' : ''}
        ${glow ? 'shadow-lg shadow-purple-500/20' : ''}
        ${className}
      `}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
