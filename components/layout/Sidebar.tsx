'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Megaphone,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  CheckSquare,
  PlusCircle,
  Wallet,
  MessageSquare,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navigation: Record<string, NavSection[]> = {
  client: [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/dashboard/client', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'My Ads', href: '/dashboard/client/ads', icon: <Megaphone className="w-5 h-5" /> },
        { label: 'Create Ad', href: '/dashboard/client/ads/create', icon: <PlusCircle className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Monetization',
      items: [
        { label: 'Packages', href: '/dashboard/client/packages', icon: <ShoppingBag className="w-5 h-5" /> },
        { label: 'Payments', href: '/dashboard/client/payments', icon: <Wallet className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { label: 'Performance', href: '/dashboard/client/analytics', icon: <BarChart3 className="w-5 h-5" /> },
      ],
    },
  ],
  moderator: [
    {
      title: 'Moderation',
      items: [
        { label: 'Dashboard', href: '/dashboard/moderator', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Pending Ads', href: '/dashboard/moderator/pending', icon: <CheckSquare className="w-5 h-5" />, badge: 0 },
        { label: 'All Ads', href: '/dashboard/moderator/ads', icon: <Megaphone className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Management',
      items: [
        { label: 'Activity Log', href: '/dashboard/moderator/activity', icon: <BarChart3 className="w-5 h-5" /> },
      ],
    },
  ],
  admin: [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Management',
      items: [
        { label: 'All Ads', href: '/dashboard/admin/ads', icon: <Megaphone className="w-5 h-5" /> },
        { label: 'Users', href: '/dashboard/admin/users', icon: <Users className="w-5 h-5" /> },
        { label: 'Payments', href: '/dashboard/admin/payments', icon: <Wallet className="w-5 h-5" /> },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Activity Log', href: '/dashboard/admin/activity-log', icon: <CheckSquare className="w-5 h-5" /> },
        { label: 'Settings', href: '/dashboard/admin/settings', icon: <Settings className="w-5 h-5" /> },
      ],
    },
  ],
};

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (isLoading || !user) {
    return (
      <aside className={`sidebar ${className}`}>
        <div className="p-6">
          <div className="skeleton w-10 h-10 rounded-xl" />
          <div className="mt-6 space-y-3">
            <div className="skeleton w-full h-10 rounded-lg" />
            <div className="skeleton w-full h-10 rounded-lg" />
            <div className="skeleton w-full h-10 rounded-lg" />
          </div>
        </div>
      </aside>
    );
  }

  const navSections = navigation[user.role] || [];

  const isActive = (href: string) => {
    if (href === pathname) return true;
    if (href !== '/dashboard/' + user.role && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside 
      className={`sidebar ${className} ${isCollapsed ? 'w-20' : 'w-[280px]'} transition-all duration-300`}
    >
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-[var(--primary-gradient)] flex items-center justify-center shadow-lg shadow-[var(--primary-color)]/20"
          >
            <span className="text-lg font-bold text-white">A</span>
          </motion.div>
          {!isCollapsed && (
            <span className="text-xl font-bold gradient-text">AdFlow</span>
          )}
        </Link>
      </div>

      {/* User Profile */}
      <div className={`px-4 mb-6 ${isCollapsed ? 'px-2' : ''}`}>
        <div className={`glass-card p-4 ${isCollapsed ? 'p-2' : ''}`}>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-full bg-[var(--primary-gradient)] flex items-center justify-center flex-shrink-0"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </motion.div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
                <p className="text-xs text-[var(--text-secondary)] capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-6">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-3">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        active
                          ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <span className={active ? 'text-[var(--primary-color)]' : ''}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <>
                          <span className="font-medium text-sm flex-1">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary-color)] text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={`p-4 border-t border-[var(--border)] ${isCollapsed ? 'px-2' : ''}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] transition-all mb-2 ${isCollapsed ? 'justify-center' : ''}`}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <>
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm flex-1">Collapse</span>
          </>}
        </button>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
