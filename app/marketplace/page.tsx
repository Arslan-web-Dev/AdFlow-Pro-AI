'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AntigravityBackground from '@/components/animations/antigravity-bg';
import BlobCursor from '@/components/animations/blob-cursor';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import FadeOnScroll from '@/components/animations/fade-on-scroll';
import MagnetButton from '@/components/animations/magnet-button';
import GlareHover from '@/components/animations/glare-hover';
import { Search, Filter, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Ad {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  tags: string[];
  budget: number;
  imageUrl?: string;
  user?: { name: string };
  createdAt: string;
}

export default function MarketplacePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAds();
  }, [filter]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/ads?status=published`);
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(search.toLowerCase()) ||
                         ad.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || ad.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', ...new Set(ads.map(ad => ad.category))];

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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BlobCursor />
      <AntigravityBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeOnScroll>
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Ad Marketplace</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Discover Amazing
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {' '}Ads
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Browse through our curated collection of published advertisements
              </p>
            </div>
          </FadeOnScroll>

          {/* Search and Filter */}
          <FadeOnScroll delay={0.2}>
            <GlassCard className="p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search ads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`px-4 py-3 rounded-xl transition-all ${
                        filter === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </FadeOnScroll>

          {/* Ads Grid */}
          {filteredAds.length === 0 ? (
            <FadeOnScroll delay={0.3}>
              <GlassCard className="p-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-2xl font-semibold mb-2">No ads found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </GlassCard>
            </FadeOnScroll>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map((ad, index) => (
                <FadeOnScroll key={ad._id} delay={0.3 + index * 0.05}>
                  <GlareHover>
                    <GlassCard className="p-6 h-full flex flex-col">
                      {ad.imageUrl && (
                        <div className="w-full h-48 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-purple-400/50" />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-3">
                        <StatusBadge status={ad.status} />
                        <span className="text-sm text-gray-400">{ad.category}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{ad.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{ad.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {ad.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-white/5 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="text-sm">
                          <span className="text-gray-400">Budget: </span>
                          <span className="text-white font-medium">${ad.budget}</span>
                        </div>
                        <MagnetButton>
                          <Button variant="primary" size="sm">
                            View Details
                          </Button>
                        </MagnetButton>
                      </div>
                    </GlassCard>
                  </GlareHover>
                </FadeOnScroll>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
