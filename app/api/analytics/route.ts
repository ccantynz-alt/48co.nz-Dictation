import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, isDatabaseConfigured } from '@/lib/db';
import { getOrCreateUser } from '@/lib/get-user';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const limited = rateLimiters.general(request);
  if (limited) return limited;

  const authenticated = await getSession();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured. Analytics events are not being recorded.' },
      { status: 503 }
    );
  }

  try {
    const userId = await getOrCreateUser();
    const { action, metadata } = await request.json();

    if (!action || typeof action !== 'string') {
      return NextResponse.json({ error: 'action is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO usage_logs (user_id, action, metadata) VALUES ($1, $2, $3)`,
      [userId, action, JSON.stringify(metadata || {})]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Analytics log error:', error);
    return NextResponse.json({ error: 'Failed to log event', code: 'ANALYTICS_LOG_ERROR' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const rateLimited = rateLimiters.admin(request);
  if (rateLimited) return rateLimited;

  const authenticated = await getSession();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      period_days: 30,
      total_dictations: 0,
      total_words: 0,
      dictations_by_mode: [],
      actions: [],
      notice: 'Database not configured. Analytics data is unavailable.',
    });
  }

  try {
    const userId = await getOrCreateUser();

    // Verify admin role
    const userRows = await query(`SELECT role FROM users WHERE id = $1`, [userId]);
    if (userRows.length === 0 || userRows[0].role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(parseInt(searchParams.get('days') || '30'), 365);

    const totalDictations = await query(
      `SELECT COUNT(*) as count FROM dictations WHERE created_at > NOW() - INTERVAL '1 day' * $1`,
      [days]
    );

    const byMode = await query(
      `SELECT mode, COUNT(*) as count FROM dictations
       WHERE created_at > NOW() - INTERVAL '1 day' * $1
       GROUP BY mode ORDER BY count DESC`,
      [days]
    );

    const recentActions = await query(
      `SELECT action, COUNT(*) as count FROM usage_logs
       WHERE created_at > NOW() - INTERVAL '1 day' * $1
       GROUP BY action ORDER BY count DESC`,
      [days]
    );

    const totalWords = await query(
      `SELECT COALESCE(SUM(word_count), 0) as total FROM dictations
       WHERE created_at > NOW() - INTERVAL '1 day' * $1`,
      [days]
    );

    return NextResponse.json({
      period_days: days,
      total_dictations: parseInt(totalDictations[0].count as string),
      total_words: parseInt(totalWords[0].total as string),
      dictations_by_mode: byMode,
      actions: recentActions,
    });
  } catch (error: any) {
    console.error('Fetch analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics', code: 'FETCH_ANALYTICS_ERROR' }, { status: 500 });
  }
}
