'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 
  | 'indigo' 
  | 'blue' 
  | 'purple' 
  | 'pink' 
  | 'orange' 
  | 'green' 
  | 'red' 
  | 'cyan' 
  | 'emerald';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'adflow-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('indigo');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
    if (savedTheme && isValidTheme(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function isValidTheme(theme: string): theme is Theme {
  const validThemes: Theme[] = [
    'indigo', 'blue', 'purple', 'pink', 'orange', 
    'green', 'red', 'cyan', 'emerald'
  ];
  return validThemes.includes(theme as Theme);
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
