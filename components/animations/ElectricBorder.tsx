'use client';

import React, { useEffect, useRef } from 'react';

interface ElectricBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export default function ElectricBorder({ 
  children, 
  className = '',
  color
}: ElectricBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const borderColor = color || getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#4F46E5';

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `${borderColor}${Math.floor(p.life * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        return true;
      });

      // Randomly spawn new particles along the border
      if (Math.random() < 0.3) {
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0, vx = 0, vy = 0;

        switch (side) {
          case 0: // Top
            x = Math.random() * canvas.width;
            y = 0;
            vx = (Math.random() - 0.5) * 2;
            vy = Math.random() * 2;
            break;
          case 1: // Right
            x = canvas.width;
            y = Math.random() * canvas.height;
            vx = -Math.random() * 2;
            vy = (Math.random() - 0.5) * 2;
            break;
          case 2: // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height;
            vx = (Math.random() - 0.5) * 2;
            vy = -Math.random() * 2;
            break;
          case 3: // Left
            x = 0;
            y = Math.random() * canvas.height;
            vx = Math.random() * 2;
            vy = (Math.random() - 0.5) * 2;
            break;
        }

        particlesRef.current.push({ x, y, vx, vy, life: 1 });
      }

      // Draw border glow
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `${borderColor}40`);
      gradient.addColorStop(0.5, `${borderColor}80`);
      gradient.addColorStop(1, `${borderColor}40`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [color]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none rounded-inherit"
        style={{ borderRadius: 'inherit' }}
      />
    </div>
  );
}
