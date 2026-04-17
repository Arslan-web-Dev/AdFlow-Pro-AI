import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Payment from '@/lib/models/Payment';
import Ad from '@/lib/models/Ad';
import { submitPaymentProof } from '@/lib/utils/ad-workflow';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { adId, amount, method, transactionRef, senderName, screenshotUrl } = body;

    // Check if transaction reference already exists
    const existingPayment = await Payment.findOne({ transactionRef });
    if (existingPayment) {
      return NextResponse.json({ error: 'Transaction reference already exists' }, { status: 400 });
    }

    // Create payment record
    const payment = await Payment.create({
      adId,
      amount,
      method,
      transactionRef,
      senderName,
      screenshotUrl,
      status: 'pending',
    });

    // Update ad status to payment_submitted
    await submitPaymentProof(adId, payload.userId, payload.role);

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Submit payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const adId = searchParams.get('adId');

    const query: any = {};
    
    // Clients can only see their own payments
    if (payload.role === 'client') {
      const ads = await Ad.find({ userId: payload.userId });
      const adIds = ads.map(ad => ad._id.toString());
      query.adId = { $in: adIds };
    } else if (adId) {
      query.adId = adId;
    }
    
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .populate('adId', 'title status');

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
