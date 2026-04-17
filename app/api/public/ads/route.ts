import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Ad from '@/lib/models/Ad';
import Category from '@/lib/models/Category';
import City from '@/lib/models/City';
import Package from '@/lib/models/Package';
import AdMedia from '@/lib/models/AdMedia';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'rank';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query - only show published and non-expired ads
    const query: any = {
      status: 'published',
      expireAt: { $gt: new Date() },
    };

    if (category) {
      query.categoryId = category;
    }

    if (city) {
      query.cityId = city;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort logic
    let sortOption: any = {};
    if (sort === 'rank') {
      sortOption = { rankScore: -1, createdAt: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const ads = await Ad.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name')
      .populate('categoryId', 'name slug')
      .populate('cityId', 'name slug')
      .populate('packageId', 'name durationDays weight');

    const total = await Ad.countDocuments(query);

    // Get media for each ad
    const adIds = ads.map(ad => ad._id.toString());
    const mediaMap = await AdMedia.find({ adId: { $in: adIds } });
    const mediaByAdId: Record<string, any[]> = {};
    mediaMap.forEach(m => {
      if (!mediaByAdId[m.adId]) {
        mediaByAdId[m.adId] = [];
      }
      mediaByAdId[m.adId].push(m);
    });

    const adsWithMedia = ads.map(ad => ({
      ...ad.toObject(),
      media: mediaByAdId[ad._id.toString()] || [],
    }));

    return NextResponse.json({
      ads: adsWithMedia,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get public ads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
