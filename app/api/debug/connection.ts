/* cspell:disable */
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  const status = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ SET' : '✗ MISSING (env var: NEXT_PUBLIC_SUPABASE_URL)',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ SET' : '✗ MISSING (env var: NEXT_PUBLIC_SUPABASE_ANON_KEY)',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ SET' : '✗ MISSING (env var: SUPABASE_SERVICE_ROLE_KEY)',
    },
    jwt: {
      secret: process.env.JWT_SECRET ? '✓ SET' : '✗ MISSING',
    },
  };

  // Test Supabase connection
  let supabaseConnection = '✗ NOT CONFIGURED';
  let supabaseAdsTableExists = false;

  try {
    // Try to fetch 1 record to test connection
    const { data, error } = await supabaseAdmin
      .from('ads')
      .select('id')
      .limit(1);

    if (error) {
      supabaseConnection = `✗ ERROR: ${error.message}`;
    } else {
      supabaseConnection = '✓ CONNECTED';
      supabaseAdsTableExists = true;
    }
  } catch (error) {
    supabaseConnection = `✗ ERROR: ${(error as Error).message}`;
  }

  return NextResponse.json({
    ...status,
    supabase: {
      ...status.supabase,
      connection: supabaseConnection,
      adsTableExists: supabaseAdsTableExists,
    },
    recommendations: getRecommendations(status),
  });
}

function getRecommendations(status: any): string[] {
  const recommendations: string[] = [];

  // Supabase recommendations
  if (!status.supabase.url) {
    recommendations.push('CRITICAL: Add NEXT_PUBLIC_SUPABASE_URL to Vercel environment variables');
  }
  if (!status.supabase.anonKey) {
    recommendations.push('CRITICAL: Add NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel environment variables');
  }
  if (!status.supabase.serviceKey) {
    recommendations.push('CRITICAL: Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables');
  }

  if (!status.jwt.secret) {
    recommendations.push('WARNING: JWT_SECRET not set. Set it for production security');
  }

  if (recommendations.length === 0) {
    recommendations.push('✓ All systems configured correctly!');
  }

  return recommendations;
}
