import { NextResponse } from 'next/server';
import { addToWaitlist, checkWaitlistStatus } from '@/services/waitlistService';

type WaitlistRequest = {
  email: string;
  plan?: string;
  interest?: string;
  subscribedAt?: string;
};

export async function POST(request: Request) {
  try {
    const { email, plan = 'pro', interest = 'creator', subscribedAt } = await request.json() as WaitlistRequest;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!subscribedAt) {
      return NextResponse.json(
        { error: 'Subscription timestamp is required' },
        { status: 400 }
      );
    }

    const result = await addToWaitlist({
      email,
      plan,
      interest,
      subscribedAt
    });

    if (!result.success) {
      if (result.message === 'already_exists') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist!' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: result.message || 'Failed to add to waitlist' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const status = await checkWaitlistStatus(email);
    
    return NextResponse.json({
      exists: status.exists,
      email: status.email,
      plan: status.plan,
      interest: status.interest,
      subscribedAt: status.subscribedAt,
      createdAt: status.createdAt,
      updatedAt: status.updatedAt
    });
  } catch (error) {
    console.error('Waitlist check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
