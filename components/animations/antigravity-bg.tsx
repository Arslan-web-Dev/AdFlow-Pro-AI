'use client';

import { motion } from 'framer-motion';

interface FloatingShapeProps {
  delay: number;
  duration: number;
  size: number;
  color: string;
  top: string;
  left: string;
}

function FloatingShape({ delay, duration, size, color, top, left }: FloatingShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
        y: [0, -50, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`absolute rounded-full blur-3xl ${color}`}
      style={{
        width: size,
        height: size,
        top,
        left,
      }}
    />
  );
}

export default function AntigravityBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black" />
      
      <FloatingShape
        delay={0}
        duration={8}
        size={400}
        color="bg-purple-500/30"
        top="10%"
        left="10%"
      />
      <FloatingShape
        delay={2}
        duration={10}
        size={300}
        color="bg-blue-500/30"
        top="60%"
        left="80%"
      />
      <FloatingShape
        delay={4}
        duration={12}
        size={350}
        color="bg-pink-500/20"
        top="70%"
        left="20%"
      />
      <FloatingShape
        delay={1}
        duration={9}
        size={250}
        color="bg-indigo-500/30"
        top="20%"
        left="70%"
      />
      <FloatingShape
        delay={3}
        duration={11}
        size={320}
        color="bg-violet-500/25"
        top="80%"
        left="50%"
      />
    </div>
  );
}
