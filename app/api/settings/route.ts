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
      custom_instructions: '',
      settings: {},
      notice: 'Database not configured. Settings are stored locally.',
    });
  }

  try {
    const userId = await getOrCreateUser();

    const rows = await query(
      `SELECT custom_instructions, settings FROM users WHERE id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      custom_instructions: rows[0].custom_instructions || '',
      settings: rows[0].settings || {},
    });
  } catch (error: any) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings', code: 'FETCH_SETTINGS_ERROR' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (body.custom_instructions !== undefined) {
      updates.push(`custom_instructions = $${paramIndex++}`);
      values.push(body.custom_instructions);
    }

    if (body.settings !== undefined) {
      updates.push(`settings = $${paramIndex++}`);
      values.push(JSON.stringify(body.settings));
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(userId);

    const rows = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING custom_instructions, settings`,
      values
    );

    return NextResponse.json({
      custom_instructions: rows[0].custom_instructions || '',
      settings: rows[0].settings || {},
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings', code: 'UPDATE_SETTINGS_ERROR' }, { status: 500 });
  }
}
