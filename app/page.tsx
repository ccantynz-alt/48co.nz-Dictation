'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [mode, setMode] = useState<'email' | 'admin'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      router.push('/app');
    } catch {
      setError('Connection failed');
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      router.push('/app');
    } catch {
      setError('Connection failed');
      setLoading(false);
    }
  };

  return (
    <main className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink-50 tracking-tight mb-1">
            AlecRae <span className="text-gold-400">Voice</span>
          </h1>
          <p className="text-ink-400 text-sm">Professional dictation for legal &amp; accounting</p>
        </div>

        <div className="space-y-3 mb-6">
          <a
            href="/api/auth/sso/google"
            className="w-full flex items-center justify-center gap-3 bg-ink-900 border border-ink-700/50 hover:border-ink-600 rounded-xl px-4 py-3 text-ink-200 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </a>

          <a
            href="/api/auth/sso/microsoft"
            className="w-full flex items-center justify-center gap-3 bg-ink-900 border border-ink-700/50 hover:border-ink-600 rounded-xl px-4 py-3 text-ink-200 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="1" width="10" height="10" fill="#F25022" />
              <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
              <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
              <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
            </svg>
            Sign in with Microsoft
          </a>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-ink-700/50" />
          <span className="text-ink-500 text-xs uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-ink-700/50" />
        </div>

        <div className="flex gap-1 mb-5 bg-ink-900/50 rounded-lg p-1">
          <button
            type="button"
            onClick={() => { setMode('email'); setError(''); }}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${
              mode === 'email'
                ? 'bg-ink-800 text-ink-100'
                : 'text-ink-500 hover:text-ink-300'
            }`}
          >
            Email sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode('admin'); setError(''); }}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${
              mode === 'admin'
                ? 'bg-ink-800 text-ink-100'
                : 'text-ink-500 hover:text-ink-300'
            }`}
          >
            Quick admin access
          </button>
        </div>

        {mode === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoFocus
                autoComplete="email"
                className="w-full bg-ink-900 border border-ink-700/50 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-500 focus:border-gold-500/60 transition-colors text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full bg-ink-900 border border-ink-700/50 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-500 focus:border-gold-500/60 transition-colors text-sm"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-ink-700 disabled:text-ink-400 text-ink-950 font-medium py-3 rounded-xl transition-all text-sm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                autoFocus
                autoComplete="current-password"
                className="w-full bg-ink-900 border border-ink-700/50 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-500 focus:border-gold-500/60 transition-colors text-center text-lg tracking-wider"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-ink-700 disabled:text-ink-400 text-ink-950 font-medium py-3 rounded-xl transition-all text-sm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}

        <p className="text-ink-500 text-xs text-center mt-6">
          No account?{' '}
          <Link href="/register" className="text-gold-400 hover:text-gold-300 transition-colors">
            Create one
          </Link>
        </p>

        <p className="text-ink-600 text-xs text-center mt-6">
          Secured access · All data encrypted in transit
        </p>
      </div>
    </main>
  );
}
