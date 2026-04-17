import connectDB from '../db/mongodb';
import Ad from '../models/Ad';
import User from '../models/User';
import Log from '../models/Log';
import { generateAdContent, generateMultipleAds, GeneratedAd } from './openai';
import { syncAdToSupabase } from '../supabase/sync';

export async function createAIGeneratedAd(userId: string, topic: string) {
  try {
    await connectDB();

    // Generate ad content using AI
    const generatedAd = await generateAdContent(topic);

    // Generate slug from title
    const slug = generatedAd.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();

    // Create the ad in database with required fields
    const ad = await Ad.create({
      title: generatedAd.title,
      description: generatedAd.description,
      slug,
      userId,
      packageId: 'default', // Will need to be updated by user
      categoryId: 'default', // Will need to be updated by user
      cityId: 'default', // Will need to be updated by user
      status: 'draft',
      tags: generatedAd.tags || [],
    });

    // Log the AI generation
    await Log.create({
      level: 'info',
      action: 'ai_ad_generated',
      userId,
      adId: ad._id.toString(),
      details: { topic },
    });

    // Sync to Supabase
    await syncAdToSupabase(ad._id.toString());

    return { success: true, ad };
  } catch (error) {
    console.error('AI ad generation error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function generateDailyAdsForUser(userId: string, topics: string[] = []) {
  try {
    await connectDB();

    // If no topics provided, generate suggestions based on user's previous ads
    if (topics.length === 0) {
      const userAds = await Ad.find({ userId }).limit(5);
      const categories = [...new Set(userAds.map(ad => ad.categoryId))];
      
      if (categories.length > 0) {
        // Generate topics based on most common category
        topics.push(categories[0]);
      } else {
        // Default topics for new users
        topics = ['Technology', 'Health & Wellness', 'Business Services'];
      }
    }

    const results = [];
    for (const topic of topics) {
      const result = await createAIGeneratedAd(userId, topic);
      results.push(result);
    }

    return { success: true, results };
  } catch (error) {
    console.error('Daily ads generation error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function generateAdsForAllClients(topics: string[] = []) {
  try {
    await connectDB();

    // Get all client users
    const clients = await User.find({ role: 'client', isActive: true });
    
    const results = [];
    for (const client of clients) {
      const result = await generateDailyAdsForUser(client._id.toString(), topics);
      results.push({
        userId: client._id.toString(),
        email: client.email,
        ...result,
      });
    }

    // Log the batch generation
    await Log.create({
      level: 'info',
      action: 'ai_ad_generated',
      details: { 
        totalClients: clients.length,
        results: results.map(r => ({ userId: r.userId, success: r.success })),
      },
    });

    return { success: true, results };
  } catch (error) {
    console.error('Batch ads generation error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getAdSuggestions(category: string) {
  try {
    const { generateAdSuggestions } = await import('./openai');
    const suggestions = await generateAdSuggestions(category);
    return { success: true, suggestions };
  } catch (error) {
    console.error('Ad suggestions error:', error);
    return { success: false, error: (error as Error).message };
  }
}
