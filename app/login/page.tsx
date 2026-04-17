'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AntigravityBackground from '@/components/animations/antigravity-bg';
import BlobCursor from '@/components/animations/blob-cursor';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import MagnetButton from '@/components/animations/magnet-button';
import GlareHover from '@/components/animations/glare-hover';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect based on user role
        const dashboardRoute = data.user.role === 'client' ? '/client' :
                               data.user.role === 'moderator' ? '/moderator' :
                               data.user.role === 'admin' ? '/admin' : '/super-admin';
        router.push(dashboardRoute);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BlobCursor />
      <AntigravityBackground />
      
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <GlareHover>
            <GlassCard glow className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-3xl">A</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-400">Sign in to your AdFlow Pro account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="w-5 h-5" />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <MagnetButton>
                  <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
                    Sign In
                  </Button>
                </MagnetButton>
              </form>

              <div className="mt-6 text-center text-gray-400">
                Don't have an account?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Sign up
                </Link>
              </div>
            </GlassCard>
          </GlareHover>
        </motion.div>
      </div>
    </div>
  );
}
