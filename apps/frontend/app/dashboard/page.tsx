'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth-context';

type Project = {
  id: string;
  title: string;
  description: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function DashboardPage() {
  const { user, token, logout, isLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  async function fetchProjects() {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle) return;

    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle, description: '' })
      });

      if (res.ok) {
        const data = await res.json();
        setProjects([...projects, data.project]);
        setNewTitle('');
      }
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setCreating(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
            <p className="text-slate-400">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-900"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <p className="text-slate-400">No projects yet. Create your first one below.</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg border border-slate-800 bg-slate-900/70 hover:border-slate-600">
                    <h3 className="font-medium">{project.title}</h3>
                    {project.description && <p className="text-sm text-slate-400 mt-1">{project.description}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">New Project</h3>
            <form onSubmit={createProject} className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Project title"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm"
              />
              <button
                type="submit"
                disabled={creating || !newTitle}
                className="w-full py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium text-sm hover:bg-cyan-400 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
