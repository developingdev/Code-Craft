'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

const features = [
  'Next.js frontend with App Router',
  'Express backend with TypeScript',
  'PostgreSQL and Prisma ORM',
  'Shared contracts and validation',
  'Docker Compose for local infrastructure',
  'Deployment templates for Vercel and Railway'
];

type DashboardData = {
  status: string;
  projectsReady: number;
  deployTargets: number;
};

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    fetch(`${apiUrl}/dashboard`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => setData(payload))
      .catch(() => setData(null));
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm uppercase tracking-[0.25em] text-cyan-200">
          Loading interface...
        </p>
      </main>
    );
  }

  if (user) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_35%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute left-1/2 top-[-10%] h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 right-[-8%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <section className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">CodeCraft AI Studio</p>
            <h1 className="max-w-3xl bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-6xl">
              Build the future at the speed of thought.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              A neon-powered workspace for shipping products with a polished frontend, resilient backend, AI-ready integrations, and instant deployment paths.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="rounded-full bg-cyan-400 px-5 py-2.5 font-medium text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition duration-200 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]">
                Launch workspace
              </Link>
              <Link href="/signup" className="rounded-full border border-cyan-400/30 bg-slate-900/60 px-5 py-2.5 font-medium text-cyan-100 backdrop-blur-xl transition duration-200 hover:border-cyan-300 hover:text-white">
                Create account
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-900/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
            </div>
            <p className="text-sm text-slate-400">Live workspace status</p>
            <div className="mt-4 grid gap-4">
              <div className="rounded-2xl border border-cyan-400/10 bg-slate-950/70 p-4 transition hover:border-cyan-300/40">
                <p className="text-sm text-slate-400">Backend health</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">{data?.status ?? 'Checking...'}</p>
              </div>
              <div className="rounded-2xl border border-fuchsia-400/10 bg-slate-950/70 p-4 transition hover:border-fuchsia-300/40">
                <p className="text-sm text-slate-400">Projects ready</p>
                <p className="mt-2 text-2xl font-semibold text-fuchsia-200">{data?.projectsReady ?? 3}</p>
              </div>
              <div className="rounded-2xl border border-violet-400/10 bg-slate-950/70 p-4 transition hover:border-violet-300/40">
                <p className="text-sm text-slate-400">Deploy targets</p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">{data?.deployTargets ?? 2}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-200 shadow-[0_0_20px_rgba(8,15,30,0.4)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/30">
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
