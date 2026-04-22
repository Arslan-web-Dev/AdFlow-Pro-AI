'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import { MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Ad {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  cityId: { name: string; slug: string };
  packageId: { name: string };
  tags: string[];
  media: any[];
  expireAt: string;
}

export default function CategoryPage() {
  const params = useParams();
  const [ads, setAds] = useState<Ad[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchAds();
    }
  }, [params.slug]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/public/ads?category=${params.slug}`);
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads);
        // Get category name from first ad
        if (data.ads.length > 0) {
          setCategoryName(data.ads[0].categoryId?.name || 'Category');
        }
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-black text-white">
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
          <div>
            <Link href="/explore" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </Link>
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
            <p className="text-gray-400 mb-8">Browse ads in this category</p>
          </div>

          {ads.length === 0 ? (
            <div className="p-12 text-center">
              <GlassCard className="p-12 text-center">
                <h3 className="text-2xl font-semibold mb-2">No ads found</h3>
                <p className="text-gray-400">Check back later for new listings</p>
              </GlassCard>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad, index) => (
                <div key={ad._id}>
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
                      
                      <StatusBadge status={ad.status} />
                      
                      <h3 className="text-xl font-semibold mb-2 mt-3">{ad.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{ad.description}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{ad.cityId.name}</span>
                      </div>
                      
                      <div className="mt-auto">
                        <Link href={`/ads/${ad.slug}`}>
                          <Button variant="primary" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </GlassCard>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
