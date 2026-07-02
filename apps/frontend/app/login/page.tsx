'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@codecraft.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          <h1 className="text-2xl font-semibold mb-6">Login to CodeCraft</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500"
                placeholder="••••••"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400">
            No account?{' '}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </p>

          <p className="mt-4 text-xs text-slate-500 text-center">
            Demo: demo@codecraft.com / password123
          </p>
        </div>
      </div>
    </main>
  );
}
