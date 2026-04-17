'use client';

import { ReactNode, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClickSparkProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

function Spark({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute w-4 h-4 bg-white rounded-full pointer-events-none"
      style={{ left: x, top: y }}
    />
  );
}

export default function ClickSpark({ children, className = '', onClick }: ClickSparkProps) {
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 8;
    const y = e.clientY - rect.top - 8;

    const newSpark = {
      id: Date.now(),
      x,
      y,
    };

    setSparks((prev) => [...prev, newSpark]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((spark) => spark.id !== newSpark.id));
    }, 500);

    onClick?.(e);
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      <AnimatePresence>
        {sparks.map((spark) => (
          <Spark key={spark.id} x={spark.x} y={spark.y} />
        ))}
      </AnimatePresence>
      {children}
    </div>
  );
}
