import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';
import { hasPermission, UserRole } from '@/lib/auth/rbac';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('*, ads(title, status, user_id)')
      .eq('id', id)
      .single();

    if (error || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check permission
    if (payload.role === 'user') {
      // Users can only view their own payments
      if (payment.ads?.user_id !== payload.userId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check permission - only admin can verify payments
    if (!hasPermission(payload.role as UserRole, 'canVerifyPayments')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { status, rejection_reason } = body;

    const { id } = await params;
    
    // Get payment
    const { data: payment, error: fetchError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Update payment
    const updateData: any = {
      status,
      verified_by: payload.userId,
      verified_at: new Date().toISOString(),
    };
    if (rejection_reason) {
      updateData.rejection_reason = rejection_reason;
    }

    const { data: updatedPayment, error } = await supabaseAdmin
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
    }

    // If payment is verified, update ad status to paid/pending_review
    if (status === 'verified') {
      await supabaseAdmin
        .from('ads')
        .update({ status: 'pending_review' })
        .eq('id', payment.ad_id);
    }

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Update payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
