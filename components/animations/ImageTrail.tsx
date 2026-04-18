'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailImage {
  id: number;
  x: number;
  y: number;
  src: string;
  scale: number;
  rotation: number;
}

interface ImageTrailProps {
  images: string[];
  className?: string;
}

export default function ImageTrail({ images, className = '' }: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trailImages, setTrailImages] = React.useState<TrailImage[]>([]);
  const imageIndexRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);

  const addImage = useCallback((x: number, y: number) => {
    const now = Date.now();
    const distance = Math.sqrt(
      Math.pow(x - lastPositionRef.current.x, 2) +
      Math.pow(y - lastPositionRef.current.y, 2)
    );

    // Only add image if enough distance and time passed
    if (distance < 100 || now - lastTimeRef.current < 100) return;

    const newImage: TrailImage = {
      id: now,
      x,
      y,
      src: images[imageIndexRef.current % images.length],
      scale: 0.8 + Math.random() * 0.4,
      rotation: (Math.random() - 0.5) * 30,
    };

    imageIndexRef.current++;
    lastPositionRef.current = { x, y };
    lastTimeRef.current = now;

    setTrailImages(prev => [...prev.slice(-4), newImage]);

    // Remove image after animation
    setTimeout(() => {
      setTrailImages(prev => prev.filter(img => img.id !== newImage.id));
    }, 1000);
  }, [images]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only enable on desktop
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only add if inside container
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        addImage(x, y);
      }
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [addImage]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
    >
      <AnimatePresence>
        {trailImages.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: img.x - 75,
              y: img.y - 75,
              rotate: img.rotation,
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, img.scale, img.scale * 0.9, 0],
              x: img.x - 75,
              y: img.y - 75,
              rotate: img.rotation,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 1,
              ease: [0.23, 1, 0.32, 1],
              opacity: { times: [0, 0.1, 0.8, 1] },
              scale: { times: [0, 0.2, 0.8, 1] },
            }}
            className="absolute pointer-events-none"
            style={{
              width: 150,
              height: 150,
              zIndex: index,
            }}
          >
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 border-[var(--primary-color)]/30">
              <img 
                src={img.src} 
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
