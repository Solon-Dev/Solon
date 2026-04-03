'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

interface GitHubRepo {
  github_repo_id: string;
  name: string;
  full_name: string;
  private: boolean;
}

interface ConnectedRepo {
  github_repo_id: string;
  id: number;
}

export default function ReposPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [connectedRepos, setConnectedRepos] = useState<ConnectedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    async function fetchData() {
      try {
        // Single call to our API proxy — gets both connected repos and GitHub repos
        const res = await fetch('/api/repos?list=github');
        const data = await res.json();
        setConnectedRepos(data.repos ?? []);
        setGithubRepos(data.githubRepos ?? []);
      } catch (err) {
        setError('Failed to load repos. Please refresh the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [status]);

  const isConnected = (repoId: string) =>
    connectedRepos.some((r) => r.github_repo_id === repoId);

async function toggleRepo(repo: GitHubRepo) {
    setSaving(repo.github_repo_id);
    setError(null);
    try {
      const res = await fetch('/api/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          github_repo_id: repo.github_repo_id,
          name: repo.name,
          full_name: repo.full_name,
          connect: !isConnected(repo.github_repo_id),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error ?? 'Failed to update repo');
      }

      const data = await res.json();
      setConnectedRepos(data.repos ?? []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update repo connection. Try again.');
      }
      console.error(err);
    } finally {
      setSaving(null);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ color: '#64748b' }}>Loading repos...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: '#fff', fontWeight: 700,
          fontSize: '1.1rem', textDecoration: 'none' }}>🛡️ Solon AI</Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none',
            fontSize: '0.9rem' }}>Dashboard</Link>
          <Link href="/pricing" style={{ color: '#cbd5e1', textDecoration: 'none',
            fontSize: '0.9rem' }}>Upgrade</Link>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {session?.user?.name}
          </span>
          <SignOutButton />
        </div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a',
          marginBottom: '0.25rem' }}>Connected Repos</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Toggle repos on to enable Solon reviews for their pull requests.
        </p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#dc2626',
            marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '0.75rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {githubRepos.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
              <p style={{ fontWeight: 500, color: '#64748b' }}>No repositories found</p>
              <p style={{ fontSize: '0.875rem' }}>
                Make sure you granted repo access when signing in.
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {githubRepos.map((repo) => {
                const connected = isConnected(repo.github_repo_id);
                const isSaving = saving === repo.github_repo_id;
                const connectedRepo = connectedRepos.find(
                  (r) => r.github_repo_id === repo.github_repo_id
                );

                return (
                  <li
                    key={repo.github_repo_id}
                    style={{ borderBottom: '1px solid #f1f5f9', padding: '1rem 1.5rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                        {repo.name}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        {repo.full_name} {repo.private ? '🔒' : '🌐'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {connected && connectedRepo && (
                        <Link
                          href={`/dashboard/repos/${connectedRepo.id}`}
                          style={{ fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none' }}
                        >
                          View Reviews →
                        </Link>
                      )}
                      <button
                        onClick={() => toggleRepo(repo)}
                        disabled={isSaving}
                        style={{
                          background: connected ? '#f1f5f9' : '#2563eb',
                          color: connected ? '#475569' : '#fff',
                          border: 'none',
                          borderRadius: '0.5rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: isSaving ? 'not-allowed' : 'pointer',
                          opacity: isSaving ? 0.6 : 1,
                          minWidth: '90px',
                        }}
                      >
                        {isSaving ? '...' : connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
