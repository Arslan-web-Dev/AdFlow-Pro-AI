'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Eye, 
  Tag, 
  Share2, 
  Flag,
  MessageCircle,
  Phone,
  Mail,
  Package,
  Clock
} from 'lucide-react';
import Button from '@/components/ui/button';
import GlareCard from '@/components/animations/GlareCard';
import TopNavbar from '@/components/layout/TopNavbar';

interface Ad {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  city: string;
  status: string;
  media: { url: string; type: string }[];
  tags: string[];
  views: number;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  isAIGenerated?: boolean;
}

export default function AdDetailPage() {
  const params = useParams();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchAd();
  }, [params.slug]);

  const fetchAd = async () => {
    try {
      const res = await fetch(`/api/public/ads/${params.slug}`);
      if (!res.ok) throw new Error('Ad not found');
      const data = await res.json();
      setAd(data.ad);
    } catch (err) {
      setError('Failed to load ad details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <TopNavbar />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-[var(--surface)] rounded-2xl" />
            <div className="h-8 bg-[var(--surface)] rounded w-1/2" />
            <div className="h-4 bg-[var(--surface)] rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <TopNavbar />
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Ad Not Found</h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            This listing may have expired or been removed.
          </p>
          <Link href="/marketplace">
            <Button className="mt-6 button-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <TopNavbar />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link 
            href="/marketplace"
            className="flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <GlareCard>
                <div className="relative aspect-video bg-[var(--surface)] rounded-2xl overflow-hidden">
                  {ad.media[selectedImage] ? (
                    <Image
                      src={ad.media[selectedImage].url}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
                      <Package className="w-16 h-16" />
                    </div>
                  )}
                  {ad.isAIGenerated && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium">
                      AI Generated
                    </div>
                  )}
                </div>
              </GlareCard>

              {/* Thumbnail Gallery */}
              {ad.media.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {ad.media.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-[var(--primary-color)]' 
                          : 'border-transparent hover:border-[var(--border-color)]'
                      }`}
                    >
                      <Image
                        src={media.url}
                        alt={`${ad.title} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Ad Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[var(--primary-color)] text-sm font-medium uppercase tracking-wider">
                      {ad.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-2">
                      {ad.title}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
                      <Share2 className="w-5 h-5 text-[var(--muted-foreground)]" />
                    </button>
                    <button className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
                      <Flag className="w-5 h-5 text-[var(--muted-foreground)]" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-[var(--primary-color)]">
                    {ad.currency} {ad.price.toLocaleString()}
                  </span>
                  {ad.expiresAt && (
                    <span className="text-sm text-[var(--muted-foreground)]">
                      Valid until {new Date(ad.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)] mb-6">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {ad.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted {new Date(ad.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {ad.views} views
                  </span>
                </div>

                {/* Description */}
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                    Description
                  </h3>
                  <p className="text-[var(--muted-foreground)] whitespace-pre-line leading-relaxed">
                    {ad.description}
                  </p>
                </div>

                {/* Tags */}
                {ad.tags.length > 0 && (
                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {ad.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[var(--surface)] rounded-full text-sm text-[var(--muted-foreground)]"
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Contact & Actions */}
            <div className="space-y-6">
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 sticky top-24"
              >
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Contact Seller
                </h3>

                {ad.contactInfo?.email && (
                  <a
                    href={`mailto:${ad.contactInfo.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors mb-3"
                  >
                    <Mail className="w-5 h-5 text-[var(--primary-color)]" />
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Email</p>
                      <p className="text-[var(--foreground)] font-medium">{ad.contactInfo.email}</p>
                    </div>
                  </a>
                )}

                {ad.contactInfo?.phone && (
                  <a
                    href={`tel:${ad.contactInfo.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <Phone className="w-5 h-5 text-[var(--primary-color)]" />
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Phone</p>
                      <p className="text-[var(--foreground)] font-medium">{ad.contactInfo.phone}</p>
                    </div>
                  </a>
                )}

                <Button className="w-full mt-4 button-primary">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </motion.div>

              {/* Safety Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                  Safety Tips
                </h3>
                <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Meet in public places during daytime
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Verify the item before payment
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Never share financial information
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
