import { NextRequest, NextResponse } from 'next/server'
import { generateAdsWorkflow, AdGenerationInput } from '@/lib/crewai/workflow'
import { 
  saveAIGeneratedAd, 
  saveGenerationHistory, 
  getSuccessfulPatterns 
} from '@/lib/supabase/ai-ads'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { product_name, audience, platform, tone, userId } = body

    // Validate required fields
    if (!product_name || !audience || !platform || !tone || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: product_name, audience, platform, tone, userId' },
        { status: 400 }
      )
    }

    // Get historical patterns for learning
    const historicalContext = await getSuccessfulPatterns()

    // Prepare input for workflow
    const input: AdGenerationInput = {
      product_name,
      audience,
      platform,
      tone,
      userId,
      historicalContext: historicalContext || undefined
    }

    // Generate ads using AI workflow
    const result = await generateAdsWorkflow(input)

    // Save all generated ads to database
    const savedAds = await Promise.all(
      result.ads.map(async (ad) => {
        const adToSave = {
          user_id: userId,
          product_name,
          audience,
          platform,
          tone,
          headline: ad.headline,
          description: ad.description,
          cta: ad.cta,
          hashtags: ad.hashtags,
          engagement_score: ad.engagement_score,
          conversion_score: ad.conversion_score,
          overall_score: ad.overall_score,
          generation_method: 'openai',
          prompt_used: JSON.stringify(input),
          variant_number: ad.variant_number,
          is_best_variant: ad.overall_score === result.best_ad.overall_score,
          status: 'generated'
        }
        return await saveAIGeneratedAd(adToSave)
      })
    )

    // Save generation history for learning
    await saveGenerationHistory({
      user_id: userId,
      product_category: product_name,
      target_audience: audience,
      platform_used: platform,
      tone_used: tone,
      average_rating: result.best_ad.overall_score,
      usage_count: 1,
      successful_patterns: JSON.parse(historicalContext || '{}')
    })

    return NextResponse.json({
      ads: savedAds,
      best_ad: result.best_ad,
      saved_to_db: true,
      research_insights: result.research_insights,
      strategy_recommendations: result.strategy_recommendations
    })

  } catch (error) {
    console.error('Error in generate-ad API:', error)
    return NextResponse.json(
      { error: 'Failed to generate ads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
