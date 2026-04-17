'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface FadeOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function FadeOnScroll({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: FadeOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 },
  };

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start({
        opacity: 1,
        ...directions[direction],
        x: 0,
        y: 0,
      });
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated, controls, direction]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={controls}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
