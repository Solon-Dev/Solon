import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';

interface Props {
  params: Promise<{ reviewId: string }>;
}

export default async function ReviewDetailPage({ params }: Props) {
  const { reviewId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.githubId) redirect('/login');

  // Verify this review belongs to a repo owned by the current user
  const reviewResult = await db(
    `SELECT rv.id, rv.pr_number, rv.pr_title, rv.summary, rv.playbook_results,
            rv.edge_cases, rv.unit_tests, rv.status, rv.created_at,
            r.name AS repo_name, r.id AS repo_id, r.full_name AS repo_full_name
     FROM reviews rv
     JOIN repos r ON r.id = rv.repo_id
     JOIN users u ON u.id = r.user_id
     WHERE rv.id = $1 AND u.github_id = $2`,
    [reviewId, session.user.githubId]
  );

  if (reviewResult.length === 0) notFound();

  const review = reviewResult[0] as {
    id: number;
    pr_number: number;
    pr_title: string;
    summary: string;
    playbook_results: string | null;
    edge_cases: string[] | null;
    unit_tests: string | null;
    status: string;
    created_at: string;
    repo_name: string;
    repo_id: number;
    repo_full_name: string;
  };

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

  let edgeCases: string[] = [];
  try {
    edgeCases = typeof review.edge_cases === 'string'
      ? JSON.parse(review.edge_cases)
      : review.edge_cases ?? [];
  } catch { /* ignore */ }

  let unitTests: { filePath?: string; code?: string } = {};
  try {
    unitTests = typeof review.unit_tests === 'string'
      ? JSON.parse(review.unit_tests)
      : {};
  } catch { /* ignore */ }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>🛡️ Solon AI</Link>
        <Link href={`/dashboard/repos/${review.repo_id}`} style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← {review.repo_name}
        </Link>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              PR #{review.pr_number}
            </h1>
            <span
              style={{
                color: statusColor[review.status] ?? '#64748b',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: '#f1f5f9',
                padding: '0.25rem 0.6rem',
                borderRadius: '0.4rem',
              }}
            >
              {statusLabel[review.status] ?? review.status}
            </span>
          </div>
          <p style={{ color: '#64748b', margin: 0 }}>
            {review.pr_title || 'Untitled PR'} · {review.repo_full_name} · {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Summary */}
        <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>Summary</h2>
          <p style={{ color: '#475569', lineHeight: '1.7', margin: 0 }}>{review.summary}</p>
        </div>

        {/* Playbook Results */}
        {review.playbook_results && (
          <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>🎯 Team Standards Check</h2>
            <div
              style={{ color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
              dangerouslySetInnerHTML={{ __html: String(review.playbook_results).replace(/\n/g, '<br/>') }}
            />
          </div>
        )}

        {/* Edge Cases */}
        {edgeCases.length > 0 && (
          <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>⚠️ Edge Cases</h2>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', lineHeight: '1.8' }}>
              {edgeCases.map((ec, i) => <li key={i}>{ec}</li>)}
            </ul>
          </div>
        )}

        {/* Unit Tests */}
        {unitTests.code && (
          <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>🧪 Suggested Unit Tests</h2>
            {unitTests.filePath && (
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{unitTests.filePath}</p>
            )}
            <pre style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: '0.5rem', padding: '1.25rem', overflow: 'auto', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
              <code>{unitTests.code}</code>
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
