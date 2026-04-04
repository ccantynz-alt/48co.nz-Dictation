import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, isDatabaseConfigured } from '@/lib/db';
import { getOrCreateUser } from '@/lib/get-user';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const limited = rateLimiters.general(request);
  if (limited) return limited;

  const authenticated = await getSession();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      dictations: [],
      total: 0,
      limit: 50,
      offset: 0,
      notice: 'Database not configured. Dictation history is stored locally.',
    });
  }

  try {
    const userId = await getOrCreateUser();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    const rows = await query(
      `SELECT id, raw_text, enhanced_text, mode, audio_duration, word_count, is_batch, created_at
       FROM dictations
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM dictations WHERE user_id = $1`,
      [userId]
    );

    return NextResponse.json({
      dictations: rows,
      total: parseInt(countResult[0].total as string),
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Fetch dictations error:', error);
    return NextResponse.json({ error: 'Failed to fetch dictations', code: 'FETCH_DICTATIONS_ERROR' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const body = await request.json();

    const { raw_text, enhanced_text, mode, audio_url, audio_duration, word_count } = body;

    if (!raw_text || !mode) {
      return NextResponse.json({ error: 'raw_text and mode are required' }, { status: 400 });
    }

    const rows = await query(
      `INSERT INTO dictations (user_id, raw_text, enhanced_text, mode, audio_url, audio_duration, word_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, raw_text, enhanced_text, mode, audio_duration, word_count, created_at`,
      [userId, raw_text, enhanced_text || null, mode, audio_url || null, audio_duration || null, word_count || null]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Save dictation error:', error);
    return NextResponse.json({ error: 'Failed to save dictation', code: 'SAVE_DICTATION_ERROR' }, { status: 500 });
  }
}
