'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Clock, Star, CheckCircle } from 'lucide-react';

interface Package {
  _id: string;
  name: string;
  durationDays: number;
  weight: number;
  isFeatured: boolean;
  homepageVisibility: boolean;
  autoRefreshDays?: number;
  price: number;
  features: string[];
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      if (response.ok) {
        setPackages(data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPackageColor = (name: string) => {
    switch (name) {
      case 'Basic':
        return 'from-blue-500 to-cyan-500';
      case 'Standard':
        return 'from-purple-500 to-pink-500';
      case 'Premium':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AdFlow Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Pricing Packages</span>
            </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Choose Your
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {' '}Package
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Select the perfect package to maximize your ad visibility and reach
              </p>
            </div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg._id}>
                <div className={`p-6 h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${pkg.isFeatured ? 'border-2 border-yellow-500/50' : ''}`}>
                    {pkg.isFeatured && (
                      <div className="absolute top-4 right-4">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                    
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getPackageColor(pkg.name)} flex items-center justify-center mb-6`}>
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <div className="text-4xl font-bold mb-4">${pkg.price}</div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{pkg.durationDays} days listing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Star className="w-4 h-4" />
                        <span>Weight: {pkg.weight}x</span>
                      </div>
                      {pkg.homepageVisibility && (
                        <div className="flex items-center gap-2 text-sm text-yellow-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Homepage featured</span>
                        </div>
                      )}
                      {pkg.autoRefreshDays && (
                        <div className="flex items-center gap-2 text-sm text-blue-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Auto refresh every {pkg.autoRefreshDays} days</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-white/10 pt-4 mb-6">
                      <h4 className="font-medium mb-3">Features:</h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      pkg.isFeatured 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}>
                      Select Package
                    </button>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
