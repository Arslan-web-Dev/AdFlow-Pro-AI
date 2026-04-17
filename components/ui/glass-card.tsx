'use client';

import { motion } from 'framer-motion';
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
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={`
        relative backdrop-blur-xl
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/10
        rounded-2xl
        overflow-hidden
        ${glow ? 'shadow-lg shadow-purple-500/20' : ''}
        ${className}
      `}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
