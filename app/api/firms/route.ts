import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import {
  type FirmProfile,
  FirmProfileInput,
  createFirmProfile,
  validateFirmProfile,
} from '@/lib/firm-profiles';
import { firmStore } from '@/lib/firm-store';
import { rateLimiters } from '@/lib/rate-limit';

async function checkAuth(request: NextRequest): Promise<NextResponse | null> {
  const session = request.cookies.get('alecrae_session')?.value;
  if (!session || !(await verifySession(session))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

/**
 * GET /api/firms — List all firm profiles
 */
export async function GET(request: NextRequest) {
  const limited = rateLimiters.general(request);
  if (limited) return limited;

  const authError = await checkAuth(request);
  if (authError) return authError;

  const firms = Array.from(firmStore.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return NextResponse.json({ firms });
}

/**
 * POST /api/firms — Create a new firm profile
 */
export async function POST(request: NextRequest) {
  const postLimited = rateLimiters.general(request);
  if (postLimited) return postLimited;

  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as FirmProfileInput;
    const errors = validateFirmProfile(body);

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const firm = createFirmProfile(body);
    firmStore.set(firm.id, firm);

    return NextResponse.json({ firm }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create firm profile', code: 'CREATE_FIRM_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/firms — Update an existing firm profile
 * Expects { id, ...updates } in the request body
 */
export async function PUT(request: NextRequest) {
  const putLimited = rateLimiters.general(request);
  if (putLimited) return putLimited;

  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Firm ID is required' }, { status: 400 });
    }

    const existing = firmStore.get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    const errors = validateFirmProfile(updates);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const updated: FirmProfile = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    firmStore.set(id, updated);

    return NextResponse.json({ firm: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update firm profile', code: 'UPDATE_FIRM_ERROR' },
      { status: 500 }
    );
  }
}

