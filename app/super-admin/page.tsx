'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AntigravityBackground from '@/components/animations/antigravity-bg';
import BlobCursor from '@/components/animations/blob-cursor';
import Sidebar from '@/components/ui/sidebar';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import FadeOnScroll from '@/components/animations/fade-on-scroll';
import { Database, Activity, Server, Cpu, MemoryStick, HardDrive } from 'lucide-react';

interface SystemHealth {
  mongodb: 'healthy' | 'degraded' | 'down';
  supabase: 'healthy' | 'degraded' | 'down';
  api: 'healthy' | 'degraded' | 'down';
  ai: 'healthy' | 'degraded' | 'down';
}

interface SystemStats {
  uptime: string;
  requests: number;
  errors: number;
  memory: number;
  cpu: number;
  disk: number;
}

interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    mongodb: 'healthy',
    supabase: 'healthy',
    api: 'healthy',
    ai: 'healthy',
  });
  const [systemStats, setSystemStats] = useState<SystemStats>({
    uptime: '99.9%',
    requests: 12543,
    errors: 12,
    memory: 45,
    cpu: 32,
    disk: 68,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchUserData();
    // Simulate system stats update
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        requests: prev.requests + Math.floor(Math.random() * 10),
        cpu: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 30) + 40,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      const response = await fetch('/api/sync/full', { method: 'POST' });
      if (response.ok) {
        alert('Sync completed successfully');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Sync failed');
    }
  };

  const healthColors: Record<string, string> = {
    healthy: 'text-green-400 bg-green-500/20',
    degraded: 'text-yellow-400 bg-yellow-500/20',
    down: 'text-red-400 bg-red-500/20',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <BlobCursor />
      <AntigravityBackground />
      
      <Sidebar
        role={user?.role || 'super_admin'}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <FadeOnScroll>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
              <p className="text-gray-400">System monitoring and control</p>
            </div>
          </FadeOnScroll>

          {/* System Health */}
          <FadeOnScroll delay={0.1}>
            <GlassCard className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">System Health</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(systemHealth).map(([service, status]) => (
                  <div
                    key={service}
                    className={`p-4 rounded-xl ${healthColors[status]} border border-current/20`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {service === 'mongodb' && <Database className="w-5 h-5" />}
                      {service === 'supabase' && <Server className="w-5 h-5" />}
                      {service === 'api' && <Activity className="w-5 h-5" />}
                      {service === 'ai' && <Cpu className="w-5 h-5" />}
                      <span className="font-medium capitalize">{service}</span>
                    </div>
                    <div className="text-sm capitalize">{status}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </FadeOnScroll>

          {/* System Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <FadeOnScroll delay={0.2}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-2 text-purple-400">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium">Uptime</span>
                </div>
                <div className="text-3xl font-bold">{systemStats.uptime}</div>
              </GlassCard>
            </FadeOnScroll>
            <FadeOnScroll delay={0.3}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-2 text-blue-400">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium">Requests</span>
                </div>
                <div className="text-3xl font-bold">{systemStats.requests.toLocaleString()}</div>
              </GlassCard>
            </FadeOnScroll>
            <FadeOnScroll delay={0.4}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-2 text-red-400">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium">Errors</span>
                </div>
                <div className="text-3xl font-bold">{systemStats.errors}</div>
              </GlassCard>
            </FadeOnScroll>
            <FadeOnScroll delay={0.5}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-2 text-green-400">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium">Response Time</span>
                </div>
                <div className="text-3xl font-bold">45ms</div>
              </GlassCard>
            </FadeOnScroll>
          </div>

          {/* Resource Usage */}
          <FadeOnScroll delay={0.6}>
            <GlassCard className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Resource Usage</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm">
                      <Cpu className="w-4 h-4" /> CPU
                    </span>
                    <span>{systemStats.cpu}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${systemStats.cpu}%` }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm">
                      <MemoryStick className="w-4 h-4" /> Memory
                    </span>
                    <span>{systemStats.memory}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${systemStats.memory}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm">
                      <HardDrive className="w-4 h-4" /> Disk
                    </span>
                    <span>{systemStats.disk}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${systemStats.disk}%` }}
                      className="h-full bg-green-500"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </FadeOnScroll>

          {/* Database Sync */}
          <FadeOnScroll delay={0.7}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Database Synchronization</h2>
                <Button variant="primary" onClick={handleSync}>
                  Sync Now
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <h3 className="font-medium mb-2">MongoDB</h3>
                  <p className="text-sm text-gray-400">Primary database</p>
                  <div className="mt-2 text-green-400 text-sm">● Connected</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <h3 className="font-medium mb-2">Supabase</h3>
                  <p className="text-sm text-gray-400">Backup & sync</p>
                  <div className="mt-2 text-green-400 text-sm">● Connected</div>
                </div>
              </div>
            </GlassCard>
          </FadeOnScroll>
        </div>
      </main>
    </div>
  );
}
