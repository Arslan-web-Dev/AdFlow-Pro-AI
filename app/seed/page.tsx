'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Check, AlertCircle, Loader2, Sprout } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const runSeed = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedKey: 'adflow-seed-2024' }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Seed failed');
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
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <Sprout className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Seed Database</h1>
          <p className="text-gray-400 mb-6">
            Create demo categories, cities, packages, and ads for testing.
          </p>

          <Button
            variant="primary"
            onClick={runSeed}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Seeding database...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Run Database Seed
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
                  <span className="text-green-400 font-medium">Seed Complete!</span>
                </div>
                <p className="text-sm text-gray-400">{result.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-400">{result.results.categories}</p>
                  <p className="text-xs text-gray-400">Categories</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-400">{result.results.cities}</p>
                  <p className="text-xs text-gray-400">Cities</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-400">{result.results.packages}</p>
                  <p className="text-xs text-gray-400">Packages</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">{result.results.ads}</p>
                  <p className="text-xs text-gray-400">Ads</p>
                </div>
              </div>

              {result.results.errors.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm font-medium mb-2">Warnings:</p>
                  {result.results.errors.map((err: string, i: number) => (
                    <p key={i} className="text-xs text-yellow-400/80">{err}</p>
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
