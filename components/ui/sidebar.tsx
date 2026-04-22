'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-600 text-white"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`lg:static fixed left-0 top-0 h-full z-50 lg:z-auto lg:block bg-black/80 backdrop-blur-xl border-r border-purple-500/20 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: collapsed ? '80px' : '280px' }}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-purple-500/20">
            <div
              className={`flex items-center gap-3 transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              {!collapsed && (
                <div className="text-white font-bold text-xl animate-in slide-in-from-left-2 duration-200">
                  AdFlow Pro
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {!collapsed && (
                      <span className="flex-1 animate-in slide-in-from-left-2 duration-200">
                        {item.label}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
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
              {!collapsed && (
                <span className="animate-in slide-in-from-left-2 duration-200">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
