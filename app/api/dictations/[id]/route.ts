import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, isDatabaseConfigured } from '@/lib/db';
import { getOrCreateUser } from '@/lib/get-user';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const limited = rateLimiters.general(request);
  if (limited) return limited;

  const authenticated = await getSession();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured. Dictation history is stored locally.' },
      { status: 404 }
    );
  }

  try {
    const userId = await getOrCreateUser();

    const rows = await query(
      `SELECT id, raw_text, enhanced_text, mode, audio_url, audio_duration, word_count, is_batch, created_at
       FROM dictations
       WHERE id = $1 AND user_id = $2`,
      [params.id, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Dictation not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Fetch dictation error:', error);
    return NextResponse.json({ error: 'Failed to fetch dictation', code: 'FETCH_DICTATION_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimited = rateLimiters.general(request);
  if (rateLimited) return rateLimited;

  const authenticated = await getSession();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured. Data stored locally.' },
      { status: 503 }
    );
  }

  try {
    const userId = await getOrCreateUser();

    const rows = await query(
      `DELETE FROM dictations WHERE id = $1 AND user_id = $2 RETURNING id`,
      [params.id, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Dictation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete dictation error:', error);
    return NextResponse.json({ error: 'Failed to delete dictation', code: 'DELETE_DICTATION_ERROR' }, { status: 500 });
  }
}
