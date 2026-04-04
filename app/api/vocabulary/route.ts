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
      vocabulary: [],
      notice: 'Database not configured. Vocabulary is stored locally.',
    });
  }

  try {
    const userId = await getOrCreateUser();

    const rows = await query(
      `SELECT id, term, created_at FROM vocabulary WHERE user_id = $1 ORDER BY term ASC`,
      [userId]
    );

    return NextResponse.json({ vocabulary: rows });
  } catch (error: any) {
    console.error('Fetch vocabulary error:', error);
    return NextResponse.json({ error: 'Failed to fetch vocabulary', code: 'FETCH_VOCABULARY_ERROR' }, { status: 500 });
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
    const { term } = await request.json();

    if (!term || typeof term !== 'string' || term.trim().length === 0) {
      return NextResponse.json({ error: 'term is required' }, { status: 400 });
    }

    const rows = await query(
      `INSERT INTO vocabulary (user_id, term) VALUES ($1, $2)
       ON CONFLICT (user_id, term) DO NOTHING
       RETURNING id, term, created_at`,
      [userId, term.trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Term already exists' }, { status: 409 });
    }

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Add vocabulary term error:', error);
    return NextResponse.json({ error: 'Failed to add term', code: 'ADD_TERM_ERROR' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const deleteRateLimited = rateLimiters.general(request);
  if (deleteRateLimited) return deleteRateLimited;

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
    const { term } = await request.json();

    if (!term || typeof term !== 'string') {
      return NextResponse.json({ error: 'term is required' }, { status: 400 });
    }

    const rows = await query(
      `DELETE FROM vocabulary WHERE user_id = $1 AND term = $2 RETURNING id`,
      [userId, term.trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete vocabulary term error:', error);
    return NextResponse.json({ error: 'Failed to delete term', code: 'DELETE_TERM_ERROR' }, { status: 500 });
  }
}
