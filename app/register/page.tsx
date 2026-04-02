'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firmName, setFirmName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          firmName: firmName.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'Registration failed');
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
    <main className="min-h-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink-50 tracking-tight mb-1">
            AlecRae <span className="text-gold-400">Voice</span>
          </h1>
          <p className="text-ink-400 text-sm">Create your professional account</p>
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
          <span className="text-ink-500 text-xs uppercase tracking-wider">or register with email</span>
          <div className="flex-1 h-px bg-ink-700/50" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-ink-400 text-xs mb-1.5 ml-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              autoComplete="name"
              className="w-full bg-ink-900 border border-ink-700/50 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-500 focus:border-gold-500/60 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-ink-400 text-xs mb-1.5 ml-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@firm.com"
              autoComplete="email"
              className="w-full bg-ink-900 border border-ink-700/50 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-500 focus:border-gold-500/60 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-ink-400 text-xs mb-1.5 ml-1">Firm name <span className="text-ink-600">(optional)</span></label>
            <input
              type="text"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              placeholder="Smith & Associates LLP"
              autoComplete="organization"
              className="w-full bg-ink-900 border border-ink-700/50 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-500 focus:border-gold-500/60 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-ink-400 text-xs mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="w-full bg-ink-900 border border-ink-700/50 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-500 focus:border-gold-500/60 transition-colors text-sm"
            />
            {password.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= strength.score ? strength.color : 'bg-ink-800'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-ink-400">{strength.label}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-ink-400 text-xs mb-1.5 ml-1">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              className="w-full bg-ink-900 border border-ink-700/50 rounded-xl px-4 py-3 text-ink-100 placeholder:text-ink-500 focus:border-gold-500/60 transition-colors text-sm"
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-red-400 text-xs mt-1 ml-1">Passwords do not match</p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-ink-600 bg-ink-900 text-gold-500 focus:ring-gold-500/30 focus:ring-offset-0"
            />
            <span className="text-ink-400 text-xs leading-relaxed">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          {error && (
            <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !acceptedTerms}
            className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-ink-700 disabled:text-ink-400 text-ink-950 font-medium py-3 rounded-xl transition-all text-sm"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-ink-500 text-xs text-center mt-6">
          Already have an account?{' '}
          <Link href="/" className="text-gold-400 hover:text-gold-300 transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-ink-600 text-xs text-center mt-6">
          Secured access · All data encrypted in transit
        </p>
      </div>
    </main>
  );
}
