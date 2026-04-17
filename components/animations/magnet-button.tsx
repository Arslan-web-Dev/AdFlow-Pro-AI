'use client';

import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagnetButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MagnetButton({ children, className = '', onClick }: MagnetButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate distance and limit the movement
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const maxDistance = 50;
    const scale = Math.min(distance / maxDistance, 1);
    
    x.set(mouseX * 0.3 * scale);
    y.set(mouseY * 0.3 * scale);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}
