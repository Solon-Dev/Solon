import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch recent reviews across all connected repos
  let recentReviews: {
    id: number;
    pr_number: number;
    pr_title: string;
    status: string;
    created_at: string;
    repo_name: string;
    repo_id: number;
  }[] = [];

  let connectedRepoCount = 0;

  try {
    const githubId = session.user.githubId;

    const reposResult = await db<{ id: number }>(
      `SELECT r.id FROM repos r
       JOIN users u ON u.id = r.user_id
       WHERE u.github_id = $1 AND r.is_active = true`,
      [githubId]
    );
    connectedRepoCount = reposResult.length;

    if (reposResult.length > 0) {
      const repoIds = reposResult.map((r) => r.id);
      const placeholders = repoIds.map((_: number, i: number) => `$${i + 1}`).join(',');

      const reviewsResult = await db(
        `SELECT rv.id, rv.pr_number, rv.pr_title, rv.status, rv.created_at,
                r.name AS repo_name, r.id AS repo_id
         FROM reviews rv
         JOIN repos r ON r.id = rv.repo_id
         WHERE rv.repo_id IN (${placeholders})
         ORDER BY rv.created_at DESC
         LIMIT 10`,
        repoIds
      );
      recentReviews = reviewsResult as typeof recentReviews;
    }
  } catch (err) {
    console.error('Dashboard DB error:', err);
  }

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
      {/* Top Nav */}
      <nav
        style={{
          background: '#1e293b',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>🛡️ Solon AI</span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/dashboard/repos" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>
            Repos
          </Link>
          <Link href="/pricing" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>
            Upgrade
          </Link>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {session.user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? 'User'}
                width={28}
                height={28}
                style={{ borderRadius: '50%', verticalAlign: 'middle', marginRight: '0.5rem' }}
              />
            )}
            {session.user.name}
          </span>
          <SignOutButton />
        </div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Welcome back, {session.user.name?.split(' ')[0]}
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>{connectedRepoCount}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Connected Repos</div>
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#16a34a' }}>{recentReviews.length}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Recent Reviews</div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div
          style={{
            background: '#fff',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
              Recent Reviews
            </h2>
            <Link
              href="/dashboard/repos"
              style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}
            >
              Manage Repos →
            </Link>
          </div>

          {recentReviews.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
              <p style={{ fontWeight: 500, color: '#64748b' }}>No reviews yet</p>
              <p style={{ fontSize: '0.875rem' }}>
                Connect a repo and open a PR to see your first review here.
              </p>
              <Link
                href="/dashboard/repos"
                style={{
                  display: 'inline-block',
                  marginTop: '1rem',
                  background: '#2563eb',
                  color: '#fff',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                Connect a Repo
              </Link>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {recentReviews.map((review) => (
                <li
                  key={review.id}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                >
                  <Link
                    href={`/dashboard/reviews/${review.id}`}
                    style={{ display: 'block', padding: '1rem 1.5rem', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                          #{review.pr_number} {review.pr_title || 'Untitled PR'}
                        </span>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                          {review.repo_name}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <span
                          style={{
                            color: statusColor[review.status] ?? '#64748b',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                          }}
                        >
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
