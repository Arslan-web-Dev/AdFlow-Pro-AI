'use client';

import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useRequireAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
}

export default function DashboardLayout({ 
  children, 
  allowedRoles 
}: DashboardLayoutProps) {
  const { isLoading } = useRequireAuth(allowedRoles);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-[var(--primary-color)]/20 border-t-[var(--primary-color)] rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar className="!relative" />
      </div>

      {/* Main Content */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        <TopNavbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
