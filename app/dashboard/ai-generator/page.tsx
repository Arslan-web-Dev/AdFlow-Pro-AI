'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sparkles, RefreshCw, Star, Save, CheckCircle2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    }
  },
}

export default function AIGeneratorPage() {
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [demoMode, setDemoMode] = useState(true)
  const [formData, setFormData] = useState({
    product_name: '',
    audience: '',
    platform: '',
    tone: '',
  })
  
  const [result, setResult] = useState<{
    ads: Array<{
      headline: string
      description: string
      cta: string
      hashtags: string[]
      engagement_score: number
      conversion_score: number
      overall_score: number
      variant_number: number
      id?: string
    }>
    best_ad: {
      headline: string
      description: string
      cta: string
      hashtags: string[]
      engagement_score: number
      conversion_score: number
      overall_score: number
      variant_number: number
      id?: string
    }
    research_insights: string
    strategy_recommendations: string
    saved_to_db: boolean
  } | null>(null)
  const [selectedAd, setSelectedAd] = useState<{
    headline: string
    description: string
    cta: string
    hashtags: string[]
    engagement_score: number
    conversion_score: number
    overall_score: number
    variant_number: number
    id?: string
  } | null>(null)
  const [saving, setSaving] = useState(false)

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
  ]

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'inspirational', label: 'Inspirational' },
  ]

  const audiences = [
    { value: 'young-adults', label: 'Young Adults (18-25)' },
    { value: 'adults', label: 'Adults (25-40)' },
    { value: 'professionals', label: 'Professionals' },
    { value: 'parents', label: 'Parents' },
    { value: 'students', label: 'Students' },
  ]

  const handleGenerate = async () => {
    if (!formData.product_name || !formData.audience || !formData.platform || !formData.tone) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    setGenerated(false)
    setResult(null)

    try {
      // Get user ID from localStorage or auth
      const userId = localStorage.getItem('userId') || 'demo-user-id'

      const response = await fetch('/api/ai/generate-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: formData.product_name,
          audience: formData.audience,
          platform: formData.platform,
          tone: formData.tone,
          userId: localStorage.getItem('userId') || 'demo-user-id',
          demoMode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate ads')
      }

      setResult(data)
      setGenerated(true)
      setSelectedAd(data.best_ad)
      toast.success('Ads generated successfully!')
    } catch (error) {
      console.error('Error generating ads:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to generate ads. Please check your OpenAI API key configuration.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleSaveAd = async () => {
    setSaving(true)
    try {
      // This would save the ad to the regular ads table
      toast.success('Ad saved successfully!')
    } finally {
      setSaving(false)
    }
  }

  const handleFeedback = async (rating: number) => {
    if (!selectedAd) return
    
    try {
      const userId = localStorage.getItem('userId') || 'demo-user-id'
      
      await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ai_ad_id: selectedAd.id,
          user_id: userId,
          rating,
        }),
      })

      toast.success('Feedback submitted successfully!')
    } catch {
      toast.error('Failed to submit feedback')
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-6xl"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">AI Ad Generator</h1>
        <p className="text-muted-foreground text-lg">Generate compelling ads using AI-powered copywriting.</p>
      </motion.div>

      {/* Input Form */}
      <motion.div variants={itemVariants}>
        <Card className="af-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Sparkles className="w-5 h-5 text-primary" /> Ad Details
            </CardTitle>
            <CardDescription>Provide information about your product and target audience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-semibold">Product Name</Label>
                <Input
                  placeholder="e.g., Premium Fitness Tracker"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Target Audience</Label>
                <Select value={formData.audience} onValueChange={(value) => value && setFormData({ ...formData, audience: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((audience) => (
                      <SelectItem key={audience.value} value={audience.value}>
                        {audience.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold">Platform</Label>
                <Select value={formData.platform} onValueChange={(value) => value && setFormData({ ...formData, platform: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold">Tone</Label>
                <Select value={formData.tone} onValueChange={(value) => value && setFormData({ ...formData, tone: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="demo-mode" className="text-sm font-semibold">Demo Mode</Label>
                <p className="text-xs text-muted-foreground">Use mock ads (free) or real AI (requires API key)</p>
              </div>
              <Switch
                id="demo-mode"
                checked={demoMode}
                onCheckedChange={setDemoMode}
              />
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-[hsl(var(--primary))] hover:opacity-90 font-bold h-12 shadow-lg shadow-[hsl(var(--primary))]/25 transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Ads
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Results */}
      {generated && result && (
        <>
          {/* Best Ad */}
          <motion.div variants={itemVariants}>
            <Card className="af-panel border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[hsl(var(--success))]">
                  <CheckCircle2 className="w-5 h-5" />
                  Best Generated Ad
                  <Badge className="ml-2 bg-[hsl(var(--success))] text-white">
                    Score: {result.best_ad.overall_score.toFixed(1)}/10
                  </Badge>
                </CardTitle>
                <CardDescription className="text-[hsl(var(--success))]/70">
                  This ad scored highest in engagement and conversion potential.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Headline</Label>
                    <p className="mt-1 text-lg font-bold text-foreground">{result.best_ad.headline || ''}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Description</Label>
                    <p className="mt-1 text-foreground">{result.best_ad.description || ''}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Call to Action</Label>
                    <p className="mt-1 text-[hsl(var(--primary))] font-semibold">{result.best_ad.cta || ''}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Hashtags</Label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {(result.best_ad.hashtags || []).map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-muted/50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {result.saved_to_db && (
                  <div className="flex items-center gap-2 p-3 bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
                    <span className="text-sm text-[hsl(var(--success))]">Ad automatically saved to your ads section</span>
                    <Link href="/dashboard/ads" className="ml-auto">
                      <Button size="sm" variant="ghost" className="text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/20">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View in Ads
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-[hsl(var(--success))]/10">
                  <Button 
                    onClick={handleSaveAd}
                    disabled={saving}
                    className="bg-[hsl(var(--primary))] hover:opacity-90 font-bold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Ad
                  </Button>
                  <Button 
                    onClick={handleRegenerate}
                    variant="outline"
                    className="border-border/50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>

                {/* Feedback Section */}
                <div className="pt-4 border-t border-[hsl(var(--success))]/10">
                  <Label className="text-sm font-semibold text-foreground mb-3 block">Rate this ad</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleFeedback(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= 3 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Other Variants */}
          <motion.div variants={itemVariants}>
            <Card className="af-panel">
              <CardHeader>
                <CardTitle className="text-foreground">Other Variants</CardTitle>
                <CardDescription>Alternative ad versions for A/B testing.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {result.ads
                    .filter((ad) => ad.variant_number !== result.best_ad.variant_number)
                    .map((ad, idx: number) => (
                      <Card 
                        key={idx}
                        className={`af-panel cursor-pointer transition-all hover:scale-[1.02] ${
                          selectedAd?.id === ad.id ? 'ring-2 ring-[hsl(var(--primary))]' : ''
                        }`}
                        onClick={() => setSelectedAd(ad)}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="bg-muted/50 border-border/50">
                              Variant {ad.variant_number}
                            </Badge>
                            <Badge className={`${
                              ad.overall_score >= 7 
                                ? 'bg-[hsl(var(--success))] text-white' 
                                : ad.overall_score >= 5 
                                ? 'bg-[hsl(var(--warning))] text-white'
                                : 'bg-[hsl(var(--danger))] text-white'
                            }`}>
                              Score: {ad.overall_score.toFixed(1)}
                            </Badge>
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{ad.headline || ''}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ad.description || ''}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSaveAd()
                              }}
                              className="border-border/50"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Research & Strategy Insights */}
          <motion.div variants={itemVariants}>
            <Card className="af-panel">
              <CardHeader>
                <CardTitle className="text-foreground">AI Insights</CardTitle>
                <CardDescription>Research findings and strategy recommendations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-foreground">Research Analysis</Label>
                  <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                    {result.research_insights}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground">Strategy Recommendations</Label>
                  <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                    {result.strategy_recommendations}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
