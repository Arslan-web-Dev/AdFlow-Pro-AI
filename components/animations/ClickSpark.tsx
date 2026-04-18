'use client';

import React, { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface ClickSparkProps {
  children: React.ReactNode;
  sparkCount?: number;
  sparkSize?: number;
  sparkColor?: string;
}

export default function ClickSpark({ 
  children, 
  sparkCount = 8,
  sparkSize = 4,
  sparkColor
}: ClickSparkProps) {
  const [sparks, setSparks] = React.useState<Spark[]>([]);
  const sparkIdRef = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSparks: Spark[] = [];
    const angleStep = (Math.PI * 2) / sparkCount;

    for (let i = 0; i < sparkCount; i++) {
      newSparks.push({
        id: sparkIdRef.current++,
        x,
        y,
        angle: i * angleStep,
      });
    }

    setSparks(prev => [...prev, ...newSparks]);

    // Clean up sparks after animation
    setTimeout(() => {
      setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
    }, 600);
  }, [sparkCount]);

  const color = sparkColor || 'var(--primary-color)';

  return (
    <span className="relative inline-block" onClick={handleClick}>
      {children}
      <AnimatePresence>
        {sparks.map((spark) => {
          const distance = 30 + Math.random() * 20;
          const endX = Math.cos(spark.angle) * distance;
          const endY = Math.sin(spark.angle) * distance;

          return (
            <motion.span
              key={spark.id}
              initial={{ 
                x: spark.x, 
                y: spark.y, 
                scale: 1, 
                opacity: 1 
              }}
              animate={{ 
                x: spark.x + endX, 
                y: spark.y + endY, 
                scale: 0, 
                opacity: 0 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.23, 1, 0.32, 1] 
              }}
              className="absolute pointer-events-none rounded-full"
              style={{
                width: sparkSize,
                height: sparkSize,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                left: 0,
                top: 0,
              }}
            />
          );
        })}
      </AnimatePresence>
    </span>
  );
}
