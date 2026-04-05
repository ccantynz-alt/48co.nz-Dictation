import { NextRequest, NextResponse } from 'next/server';
import { query, isDatabaseConfigured } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-multi';
import { createPortalSession } from '@/lib/stripe';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const limited = rateLimiters.billing(request);
  if (limited) return limited;

  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured. Billing portal is unavailable.' },
      { status: 503 }
    );
  }

  try {
    // Look up Stripe customer ID
    const rows = await query(
      `SELECT stripe_customer_id FROM users WHERE id = $1`,
      [currentUser.id]
    );

    const stripeCustomerId = rows[0]?.stripe_customer_id as string | undefined;
    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please subscribe to a plan first.' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alecrae.app';

    const portalUrl = await createPortalSession({
      customerId: stripeCustomerId,
      returnUrl: `${baseUrl}/app`,
    });

    return NextResponse.json({ url: portalUrl });
  } catch (error: unknown) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Failed to create portal session', code: 'PORTAL_ERROR' }, { status: 500 });
  }
}
