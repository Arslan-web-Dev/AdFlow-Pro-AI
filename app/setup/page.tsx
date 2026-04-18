'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Check, AlertCircle, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const runSetup = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupKey: 'adflow-setup-2024' }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Setup failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Database className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Database Setup</h1>
          <p className="text-gray-400 mb-6">
            Create demo users and initialize the database for testing.
          </p>

          <Button
            variant="primary"
            onClick={runSetup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Run Setup
              </>
            )}
          </Button>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-left"
            >
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Setup Complete!</span>
                </div>
                <p className="text-sm text-gray-400">{result.message}</p>
              </div>

              {result.demoAccounts && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Demo Accounts:</h3>
                  {result.demoAccounts.map((account: any, i: number) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg text-sm">
                      <p><span className="text-gray-400">Email:</span> {account.email}</p>
                      <p><span className="text-gray-400">Password:</span> {account.password}</p>
                      <p><span className="text-gray-400">Role:</span> {account.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
