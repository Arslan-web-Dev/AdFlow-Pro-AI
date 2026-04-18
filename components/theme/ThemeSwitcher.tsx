'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

type ThemeOption = {
  id: string;
  name: string;
  color: string;
  gradient: string;
};

const themes: ThemeOption[] = [
  { id: 'indigo', name: 'Indigo', color: '#4F46E5', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'blue', name: 'Ocean', color: '#2563EB', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'purple', name: 'Aurora', color: '#7C3AED', gradient: 'from-purple-500 to-pink-500' },
  { id: 'pink', name: 'Sunset', color: '#EC4899', gradient: 'from-pink-500 to-orange-500' },
  { id: 'orange', name: 'Magma', color: '#F97316', gradient: 'from-orange-500 to-yellow-500' },
  { id: 'green', name: 'Forest', color: '#10B981', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'red', name: 'Crimson', color: '#EF4444', gradient: 'from-red-500 to-pink-500' },
  { id: 'cyan', name: 'Arctic', color: '#06B6D4', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'emerald', name: 'Jade', color: '#059669', gradient: 'from-emerald-600 to-lime-500' },
];

interface ThemeSwitcherProps {
  variant?: 'bar' | 'dropdown';
  showLabels?: boolean;
}

export default function ThemeSwitcher({ 
  variant = 'bar',
  showLabels = true 
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ background: themes.find(t => t.id === theme)?.color }}
          />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {themes.find(t => t.id === theme)?.name}
          </span>
          <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="absolute top-full mt-2 left-0 w-48 py-2 rounded-lg bg-[var(--background-elevated)] border border-[var(--border)] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[var(--surface)] transition-colors ${
                theme === t.id ? 'bg-[var(--surface)]' : ''
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ background: t.color }}
              />
              <span className={`text-sm ${theme === t.id ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {t.name}
              </span>
              {theme === t.id && (
                <motion.svg 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }}
                  className="w-4 h-4 ml-auto text-[var(--primary-color)]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showLabels && (
        <span className="text-sm text-[var(--text-secondary)] mr-2">Theme:</span>
      )}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface)]/50 border border-[var(--border)]">
        {themes.map((t, index) => (
          <motion.button
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={`relative w-8 h-8 rounded-lg transition-all duration-300 ${
              theme === t.id 
                ? 'ring-2 ring-white ring-offset-2 ring-offset-[var(--surface)]' 
                : 'hover:scale-110'
            }`}
            style={{ background: t.color }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            title={t.name}
          >
            {theme === t.id && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-lg ring-2 ring-white"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={false}
              animate={theme === t.id ? { 
                boxShadow: `0 0 20px ${t.color}80, 0 0 40px ${t.color}40`
              } : {
                boxShadow: 'none'
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
