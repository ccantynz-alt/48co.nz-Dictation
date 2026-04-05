import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db-schema';
import { isDatabaseConfigured } from '@/lib/db';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const limited = rateLimiters.auth(request);
  if (limited) return limited;

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'DATABASE_URL is not set. Please configure it before initialising the database.' },
      { status: 503 }
    );
  }

  try {
    const { password } = await request.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initializeDatabase();

    return NextResponse.json({ success: true, message: 'Database schema initialized' });
  } catch (error: unknown) {
    console.error('Database init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', code: 'DB_INIT_ERROR' },
      { status: 500 }
    );
  }
}
