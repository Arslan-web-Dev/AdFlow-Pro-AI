import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/client';
import { canEditAd, canDeleteAd, hasPermission, UserRole } from '@/lib/auth/rbac';

// GET single ad by ID
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
    const { data: ad, error } = await supabaseAdmin
      .from('ads')
      .select('*, users(name, email, avatar)')
      .eq('id', id)
      .single();

    if (error || !ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check permission - users can only view their own ads
    if (payload.role === 'user' && ad.user_id !== payload.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ ad });
  } catch (error) {
    console.error('Get ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update ad
export async function PUT(
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
    
    // Get ad from Supabase
    const { data: ad, error: fetchError } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check edit permission
    if (!canEditAd(payload.role as UserRole, ad.user_id, payload.userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Can only edit draft or rejected ads
    if (ad.status !== 'draft' && ad.status !== 'rejected') {
      return NextResponse.json(
        { error: 'Can only edit draft or rejected ads' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, category_id, city_id, tags } = body;

    // Build update data
    const updateData: any = {};
    if (title) {
      updateData.title = title;
      // Regenerate slug if title changed
      updateData.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();
    }
    if (description) updateData.description = description;
    if (category_id) updateData.category_id = category_id;
    if (city_id) updateData.city_id = city_id;
    if (tags) updateData.tags = tags;

    const { data: updatedAd, error } = await supabaseAdmin
      .from('ads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 });
    }

    return NextResponse.json({ ad: updatedAd });
  } catch (error) {
    console.error('Update ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE ad
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
    
    // Get ad from Supabase
    const { data: ad, error: fetchError } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check delete permission
    if (!canDeleteAd(payload.role as UserRole, ad.user_id, payload.userId)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Can only delete draft or rejected ads
    if (ad.status !== 'draft' && ad.status !== 'rejected') {
      return NextResponse.json(
        { error: 'Can only delete draft or rejected ads' },
        { status: 400 }
      );
    }

    // Delete ad
    const { error } = await supabaseAdmin
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
