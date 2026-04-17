'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AntigravityBackground from '@/components/animations/antigravity-bg';
import BlobCursor from '@/components/animations/blob-cursor';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import FadeOnScroll from '@/components/animations/fade-on-scroll';
import MagnetButton from '@/components/animations/magnet-button';
import GlareHover from '@/components/animations/glare-hover';
import { MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Ad {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  categoryId: { name: string; slug: string };
  packageId: { name: string };
  tags: string[];
  media: any[];
  expireAt: string;
}

export default function CityPage() {
  const params = useParams();
  const [ads, setAds] = useState<Ad[]>([]);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchAds();
    }
  }, [params.slug]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/public/ads?city=${params.slug}`);
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads);
        // Get city name from first ad
        if (data.ads.length > 0) {
          setCityName(data.ads[0].cityId?.name || 'City');
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
            <Link href="/explore" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </Link>
          </FadeOnScroll>

          <FadeOnScroll delay={0.1}>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-purple-400" />
              <h1 className="text-4xl font-bold">{cityName}</h1>
            </div>
            <p className="text-gray-400 mb-8">Browse ads in this city</p>
          </FadeOnScroll>

          {ads.length === 0 ? (
            <FadeOnScroll delay={0.2}>
              <GlassCard className="p-12 text-center">
                <h3 className="text-2xl font-semibold mb-2">No ads found</h3>
                <p className="text-gray-400">Check back later for new listings</p>
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
                      
                      <StatusBadge status={ad.status} />
                      
                      <h3 className="text-xl font-semibold mb-2 mt-3">{ad.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{ad.description}</p>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        {ad.categoryId.name}
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
        </div>
      </div>
    </div>
  );
}
