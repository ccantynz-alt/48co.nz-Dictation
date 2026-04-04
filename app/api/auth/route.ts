import { NextRequest, NextResponse } from 'next/server';
import { createSession, validatePassword } from '@/lib/auth';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const limited = rateLimiters.auth(request);
  if (limited) return limited;

  try {
    const { password } = await request.json();

    if (!validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await createSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set('alecrae_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', code: 'AUTH_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('alecrae_session');
    return response;
  } catch (error: unknown) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed', code: 'LOGOUT_ERROR' },
      { status: 500 }
    );
  }
}
