import { supabaseAdmin } from '../supabase/client';
import { generateAdContent, generateMultipleAds, GeneratedAd } from './openai';

export async function createAIGeneratedAd(userId: string, topic: string) {
  try {
    // Generate ad content using AI
    const generatedAd = await generateAdContent(topic);

    // Generate slug from title
    const slug = generatedAd.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();

    // Create the ad in Supabase
    const { data: ad, error } = await supabaseAdmin
      .from('ads')
      .insert({
        title: generatedAd.title,
        description: generatedAd.description,
        slug,
        user_id: userId,
        package_id: 'default',
        category_id: 'default',
        city_id: 'default',
        status: 'draft',
        tags: generatedAd.tags || [],
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, ad };
  } catch (error) {
    console.error('AI ad generation error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function generateDailyAdsForUser(userId: string, topics: string[] = []) {
  try {
    // If no topics provided, generate suggestions based on user's previous ads
    if (topics.length === 0) {
      const { data: userAds } = await supabaseAdmin
        .from('ads')
        .select('category_id')
        .eq('user_id', userId)
        .limit(5);
      
      const categories = [...new Set(userAds?.map(ad => ad.category_id) || [])];
      
      if (categories.length > 0) {
        topics.push(categories[0]);
      } else {
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
    // Get all client users
    const { data: clients, error } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('role', 'user')
      .eq('is_active', true);

    if (error) throw error;
    
    const results = [];
    for (const client of clients || []) {
      const result = await generateDailyAdsForUser(client.id, topics);
      results.push({
        userId: client.id,
        email: client.email,
        ...result,
      });
    }

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
