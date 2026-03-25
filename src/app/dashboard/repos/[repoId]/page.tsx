import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import Link from 'next/link';

interface Props {
  params: Promise<{ repoId: string }>;
}

export default async function RepoDetailPage({ params }: Props) {
  const { repoId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.githubId) redirect('/login');

  // Verify this repo belongs to the current user
  const repoResult = await db(
    `SELECT r.id, r.name, r.full_name
     FROM repos r
     JOIN users u ON u.id = r.user_id
     WHERE r.id = $1 AND u.github_id = $2`,
    [repoId, session.user.githubId]
  );

  if (repoResult.length === 0) notFound();

  const repo = repoResult[0] as { id: number; name: string; full_name: string };

  // Fetch reviews for this repo
  const reviews = await db(
    `SELECT id, pr_number, pr_title, status, created_at
     FROM reviews
     WHERE repo_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [repo.id]
  ) as { id: number; pr_number: number; pr_title: string; status: string; created_at: string }[];

  const statusColor: Record<string, string> = {
    pass: '#16a34a',
    fail: '#dc2626',
    warning: '#d97706',
    pending: '#64748b',
  };

  const statusLabel: Record<string, string> = {
    pass: '✅ Pass',
    fail: '🚫 Fail',
    warning: '⚠️ Warning',
    pending: '⏳ Pending',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>🛡️ Solon AI</Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/dashboard/repos" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>← Repos</Link>
          <Link href="/pricing" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Upgrade</Link>
        </div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
            {repo.name}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{repo.full_name}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <Link
            href={`/dashboard/repos/${repo.id}/playbooks`}
            style={{
              background: '#2563eb',
              color: '#fff',
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Configure Playbooks
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
              Review History
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
              <p style={{ fontWeight: 500, color: '#64748b' }}>No reviews yet</p>
              <p style={{ fontSize: '0.875rem' }}>
                Open a PR on <strong>{repo.full_name}</strong> to trigger your first Solon review.
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {reviews.map((review) => (
                <li key={review.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Link
                    href={`/dashboard/reviews/${review.id}`}
                    style={{ display: 'block', padding: '1rem 1.5rem', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                          #{review.pr_number} {review.pr_title || 'Untitled PR'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <span style={{ color: statusColor[review.status] ?? '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>
                          {statusLabel[review.status] ?? review.status}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
