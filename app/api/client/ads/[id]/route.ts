import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';
import { hasPermission, UserRole } from '@/lib/auth/rbac';

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

    const body = await request.json();
    const { action, ...updateData } = body;

    const { id } = await params;
    
    // Check if ad exists and belongs to user
    const { data: ad, error: fetchError } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check ownership
    if (ad.user_id !== payload.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Can only edit draft ads
    if (ad.status !== 'draft' && !hasPermission(payload.role as UserRole, 'canEditOwnAds')) {
      return NextResponse.json({ error: 'Cannot edit published ads' }, { status: 400 });
    }

    // Update ad
    const { data: updatedAd, error: updateError } = await supabaseAdmin
      .from('ads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 });
    }

    // If action is submit, update status to pending_review
    if (action === 'submit') {
      await supabaseAdmin
        .from('ads')
        .update({ status: 'pending_review', submitted_at: new Date().toISOString() })
        .eq('id', id);
    }

    return NextResponse.json({ success: true, ad: updatedAd });
  } catch (error) {
    console.error('Update ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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
    
    // Check if ad exists and belongs to user
    const { data: ad, error: fetchError } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check ownership or admin permission
    if (ad.user_id !== payload.userId && !hasPermission(payload.role as UserRole, 'canDeleteOwnAds')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete ad
    const { error: deleteError } = await supabaseAdmin
      .from('ads')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
