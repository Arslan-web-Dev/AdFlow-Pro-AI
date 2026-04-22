'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  Search,
  Filter,
  Sparkles,
  ArrowLeft,
  MapPin,
  Tag,
  Eye,
  Heart,
  ChevronDown,
} from 'lucide-react';

// ThemeSwitcher removed temporarily for build fix
// const ThemeSwitcher = dynamic(() => import('@/components/theme/ThemeSwitcher'), { ssr: false });

interface Ad {
  _id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  category: string;
  city: string;
  price: number;
  currency: string;
  tags: string[];
  media: { url: string; type: string }[];
  views: number;
  createdAt: string;
}

const categories = [
  'All', 'Electronics', 'Vehicles', 'Real Estate', 'Jobs', 'Services', 
  'Fashion', 'Home & Garden', 'Sports', 'Books', 'Other'
];

export default function MarketplacePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    filterAds();
  }, [ads, selectedCategory, searchQuery, priceRange]);

  const fetchAds = async () => {
    try {
      setError(null);
      const response = await fetch('/api/public/ads?status=published&limit=50');
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || `API Error: ${response.status}`;
        console.error('API Error:', errorMsg, data.details);
        setError(errorMsg);
        setAds([]);
      } else {
        console.log('✓ API Response successful:', data);
        console.log('✓ Ads count:', data.ads?.length);
        setAds(data.ads || []);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch ads';
      console.error('Error fetching ads:', errorMsg);
      setError(`Connection error: ${errorMsg}`);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAds = () => {
    let filtered = [...ads];
    console.log('filterAds called, ads count:', ads.length);

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(ad => ad.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(query) ||
        ad.description.toLowerCase().includes(query) ||
        ad.city.toLowerCase().includes(query) ||
        ad.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(ad => {
        if (priceRange === 'low') return ad.price < 100;
        if (priceRange === 'mid') return ad.price >= 100 && ad.price < 1000;
        if (priceRange === 'high') return ad.price >= 1000;
        return true;
      });
    }

    setFilteredAds(filtered);
    console.log('Filtered ads count:', filtered.length);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-card border-b border-[var(--border)] rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Back</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-gradient)] flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-bold text-[var(--text-primary)] hidden sm:block">AdFlow</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                {/* ThemeSwitcher removed temporarily */}
              </div>
              <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search ads by title, description, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.slice(0, 5).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-[var(--primary-color)] text-white'
                        : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border)]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button className="px-3 py-2.5 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border)]">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Marketplace</h1>
            <p className="text-[var(--text-secondary)] mt-1">
              {filteredAds.length} {filteredAds.length === 1 ? 'ad' : 'ads'} found
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-2 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
            {(['all', 'low', 'mid', 'high'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setPriceRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  priceRange === range
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {range === 'all' && 'Any Price'}
                {range === 'low' && '< $100'}
                {range === 'mid' && '$100 - $1K'}
                {range === 'high' && '> $1K'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="skeleton w-full h-48" />
                <div className="p-4 space-y-3">
                  <div className="skeleton w-3/4 h-5" />
                  <div className="skeleton w-1/2 h-4" />
                  <div className="flex justify-between pt-2">
                    <div className="skeleton w-16 h-4" />
                    <div className="skeleton w-12 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <Search className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Unable to Load Ads</h2>
            <p className="text-[var(--text-secondary)] mb-2">
              {error}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              If this persists, the database may not be configured. Check the deployment settings.
            </p>
            <button
              onClick={fetchAds}
              className="btn-primary mt-6"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAds.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--surface)] flex items-center justify-center">
              <Search className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">No ads found</h2>
            <p className="text-[var(--text-secondary)]">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setPriceRange('all');
              }}
              className="btn-primary mt-6"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Ads Grid */}
        {!loading && !error && filteredAds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAds.map((ad) => (
              <div key={ad._id}>
                <Link href={`/ads/${ad.slug}`}>
                  <div className="glass-card overflow-hidden group cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {ad.media && ad.media.length > 0 ? (
                        <Image
                          src={ad.media[0].url}
                          alt={ad.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--surface)] flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-[var(--text-muted)]" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-info text-xs">
                          {ad.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button className="p-2 rounded-full bg-black/50 text-white hover:bg-[var(--accent-error)] transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--primary-color)] transition-colors">
                        {ad.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1 flex-1">
                        {ad.description}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-2">
                        <MapPin className="w-3 h-3" />
                        {ad.city}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                        <span className="text-lg font-bold text-[var(--primary-color)]">
                          {ad.currency} {ad.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <Eye className="w-3 h-3" />
                          {ad.views}
                        </div>
                      </div>

                      {ad.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {ad.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded bg-[var(--surface)] text-[var(--text-muted)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
