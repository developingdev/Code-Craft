'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../auth-context';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, name, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Signup failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          <h1 className="text-2xl font-semibold mb-6">Sign up for CodeCraft</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500"
                placeholder="Your name"
              />
            </div>

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
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
