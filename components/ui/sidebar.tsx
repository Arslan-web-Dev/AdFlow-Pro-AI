'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Users,
  Settings,
  Database,
  Activity,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface SidebarProps {
  role: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/client',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['client', 'moderator', 'admin', 'super_admin'],
  },
  {
    label: 'My Ads',
    href: '/client/ads',
    icon: <FileText className="w-5 h-5" />,
    roles: ['client', 'moderator', 'admin', 'super_admin'],
  },
  {
    label: 'Moderation Queue',
    href: '/moderator/queue',
    icon: <CheckCircle className="w-5 h-5" />,
    roles: ['moderator', 'admin', 'super_admin'],
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin', 'super_admin'],
  },
  {
    label: 'System Monitoring',
    href: '/super-admin/system',
    icon: <Database className="w-5 h-5" />,
    roles: ['super_admin'],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: <Activity className="w-5 h-5" />,
    roles: ['moderator', 'admin', 'super_admin'],
  },
  {
    label: 'Notifications',
    href: '/notifications',
    icon: <Bell className="w-5 h-5" />,
    roles: ['client', 'moderator', 'admin', 'super_admin'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['client', 'moderator', 'admin', 'super_admin'],
  },
];

export default function Sidebar({ role, collapsed = false, onCollapse }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const filteredItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-600 text-white"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isMobileOpen ? 0 : -300 }}
        className="lg:static fixed left-0 top-0 h-full z-50 lg:z-auto lg:block bg-black/80 backdrop-blur-xl border-r border-purple-500/20"
        style={{ width: collapsed ? '80px' : '280px' }}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-purple-500/20">
            <motion.div
              animate={{ opacity: collapsed ? 0 : 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-white font-bold text-xl"
                >
                  AdFlow Pro
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex-1"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Collapse toggle & Logout */}
          <div className="p-4 border-t border-purple-500/20 space-y-2">
            <button
              onClick={() => onCollapse?.(!collapsed)}
              className="hidden lg:flex w-full items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <ChevronRight
                className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
              />
              {!collapsed && <span>Collapse</span>}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
