import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { ad_id, amount, method, transaction_ref, sender_name, screenshot_url } = body;

    // Check if transaction reference already exists
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('transaction_ref', transaction_ref)
      .single();
    
    if (existingPayment) {
      return NextResponse.json({ error: 'Transaction reference already exists' }, { status: 400 });
    }

    // Create payment record
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .insert({
        ad_id,
        amount,
        method,
        transaction_ref,
        sender_name,
        screenshot_url,
        status: 'pending',
        user_id: payload.userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Create payment error:', error);
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }

    // Update ad status to payment_submitted
    await supabaseAdmin
      .from('ads')
      .update({ status: 'payment_submitted' })
      .eq('id', ad_id);

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Submit payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const ad_id = searchParams.get('adId');

    // Build query
    let query = supabaseAdmin
      .from('payments')
      .select('*, ads(title, status)')
      .order('created_at', { ascending: false });
    
    // Clients can only see their own payments
    if (payload.role === 'user') {
      query = query.eq('user_id', payload.userId);
    } else if (ad_id) {
      query = query.eq('ad_id', ad_id);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data: payments, error } = await query;

    if (error) {
      console.error('Get payments error:', error);
      return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }

    return NextResponse.json({ payments: payments || [] });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
