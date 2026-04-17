'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ElectricBorderProps {
  children: ReactNode;
  className?: string;
}

export default function ElectricBorder({ children, className = '' }: ElectricBorderProps) {
  return (
    <div className={`relative rounded-2xl ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(45deg, #8b5cf6, #3b82f6, #8b5cf6)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute inset-[2px] rounded-2xl bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
