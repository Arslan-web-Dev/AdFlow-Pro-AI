'use client';

import { useEffect, useState } from 'react';
import AntigravityBackground from '@/components/animations/antigravity-bg';
import BlobCursor from '@/components/animations/blob-cursor';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import FadeOnScroll from '@/components/animations/fade-on-scroll';
import MagnetButton from '@/components/animations/magnet-button';
import GlareHover from '@/components/animations/glare-hover';
import { Search, Filter, MapPin, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Ad {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  categoryId: { name: string; slug: string };
  cityId: { name: string; slug: string };
  packageId: { name: string; durationDays: number; weight: number };
  tags: string[];
  media: any[];
  expireAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface City {
  _id: string;
  name: string;
  slug: string;
}

export default function ExplorePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sort, setSort] = useState('rank');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedCity, sort, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedCity && { city: selectedCity }),
        sort,
        page: page.toString(),
      });

      const response = await fetch(`/api/public/ads?${params}`);
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCities();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      if (response.ok) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BlobCursor />
      <AntigravityBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AdFlow Pro
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Explore Ads</h1>
              <p className="text-gray-400">Browse through our curated collection of advertisements</p>
            </div>
          </FadeOnScroll>

          {/* Search and Filters */}
          <FadeOnScroll delay={0.1}>
            <GlassCard className="p-6 mb-8">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
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
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  <option value="rank">Rank Score</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <Button type="submit">Search</Button>
              </form>
            </GlassCard>
          </FadeOnScroll>

          {/* Ads Grid */}
          {ads.length === 0 ? (
            <FadeOnScroll delay={0.2}>
              <GlassCard className="p-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-2xl font-semibold mb-2">No ads found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </GlassCard>
            </FadeOnScroll>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad, index) => (
                <FadeOnScroll key={ad._id} delay={0.2 + index * 0.05}>
                  <GlareHover>
                    <GlassCard className="p-6 h-full flex flex-col">
                      {ad.media && ad.media.length > 0 && ad.media[0].thumbnailUrl && (
                        <div className="w-full h-48 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4 overflow-hidden">
                          <img
                            src={ad.media[0].thumbnailUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-3">
                        <StatusBadge status={ad.status} />
                        <span className="text-xs text-gray-400">{ad.packageId.name}</span>
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
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{ad.cityId.name}</span>
                        </div>
                        <span>{ad.categoryId.name}</span>
                      </div>
                      
                      <div className="mt-auto">
                        <MagnetButton>
                          <Link href={`/ads/${ad.slug}`}>
                            <Button variant="primary" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </MagnetButton>
                      </div>
                    </GlassCard>
                  </GlareHover>
                </FadeOnScroll>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <FadeOnScroll delay={0.3}>
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </FadeOnScroll>
          )}
        </div>
      </div>
    </div>
  );
}
