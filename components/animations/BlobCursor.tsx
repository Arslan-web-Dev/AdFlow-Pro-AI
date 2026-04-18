'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

export default function BlobCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const blobRef = useRef<Point>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isActiveRef = useRef(false);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Smooth follow
    blobRef.current.x += (mouseRef.current.x - blobRef.current.x) * 0.15;
    blobRef.current.y += (mouseRef.current.y - blobRef.current.y) * 0.15;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create gradient
    const gradient = ctx.createRadialGradient(
      blobRef.current.x, blobRef.current.y, 0,
      blobRef.current.x, blobRef.current.y, 80
    );
    
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#4F46E5';
    gradient.addColorStop(0, `${primaryColor}40`);
    gradient.addColorStop(0.5, `${primaryColor}20`);
    gradient.addColorStop(1, 'transparent');

    // Draw blob
    ctx.beginPath();
    ctx.arc(blobRef.current.x, blobRef.current.y, 80, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw core
    ctx.beginPath();
    ctx.arc(blobRef.current.x, blobRef.current.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.fill();

    // Draw glow
    ctx.beginPath();
    ctx.arc(blobRef.current.x, blobRef.current.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = `${primaryColor}60`;
    ctx.fill();

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      return; // Don't show on touch devices
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        blobRef.current = { ...mouseRef.current };
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseLeave = () => {
      isActiveRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate]);

  // Don't render on server or touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
