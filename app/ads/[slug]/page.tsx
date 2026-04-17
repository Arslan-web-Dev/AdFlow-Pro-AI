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
import { MapPin, Calendar, Package, Clock, Star, Flag, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Ad {
  _id: string;
  title: string;
  description: string;
  status: string;
  categoryId: { name: string; slug: string };
  cityId: { name: string; slug: string };
  packageId: { name: string; durationDays: number; weight: number };
  tags: string[];
  expireAt: string;
  createdAt: string;
  user: { name: string };
}

interface Media {
  _id: string;
  sourceType: string;
  thumbnailUrl: string;
  validationStatus: string;
}

export default function AdDetailPage() {
  const params = useParams();
  const [ad, setAd] = useState<Ad | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchAd();
    }
  }, [params.slug]);

  const fetchAd = async () => {
    try {
      const response = await fetch(`/api/public/ads/${params.slug}`);
      const data = await response.json();
      if (response.ok) {
        setAd(data.ad);
        setMedia(data.media);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
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

  if (!ad) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ad not found</h2>
          <Link href="/explore">
            <Button>Browse Ads</Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysRemaining = ad.expireAt
    ? Math.max(0, Math.ceil((new Date(ad.expireAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

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

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Media Section */}
            <FadeOnScroll delay={0.1}>
              <GlassCard className="p-6">
                {media.length > 0 && media[0].thumbnailUrl ? (
                  <div className="aspect-video rounded-xl overflow-hidden mb-4">
                    <img
                      src={media[0].thumbnailUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4 flex items-center justify-center">
                    <Package className="w-16 h-16 text-purple-400/50" />
                  </div>
                )}
                
                {media.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {media.slice(1, 5).map((m) => (
                      <div key={m._id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                        <img
                          src={m.thumbnailUrl}
                          alt="Media thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </FadeOnScroll>

            {/* Ad Details */}
            <FadeOnScroll delay={0.2}>
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <StatusBadge status={ad.status} />
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Package className="w-4 h-4" />
                      <span>{ad.packageId.name}</span>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
                  <p className="text-gray-400 mb-6">{ad.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {ad.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{ad.cityId.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Posted {new Date(ad.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{daysRemaining} days remaining</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Star className="w-4 h-4" />
                      <span>Weight: {ad.packageId.weight}x</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="font-medium mb-2">Seller</h3>
                    <p className="text-gray-400">{ad.user?.name || 'Unknown'}</p>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4">Package Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{ad.packageId.durationDays} days listing duration</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Package weight: {ad.packageId.weight}x</span>
                    </li>
                  </ul>
                </GlassCard>
                
                <div className="flex gap-4">
                  <MagnetButton>
                    <Button variant="primary" className="flex-1">
                      Contact Seller
                    </Button>
                  </MagnetButton>
                  <Button variant="danger" className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </div>
            </FadeOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
