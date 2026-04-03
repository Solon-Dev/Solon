'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout error: ' + (data.error || 'No URL returned'));
      }
    } catch (err) {
      alert('Checkout error: ' + String(err));
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Nav */}
      <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>🛡️ Solon AI</Link>
        {session ? (
          <Link href="/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard →</Link>
        ) : (
          <Link href="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Sign In</Link>
        )}
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
          Simple, Flat Pricing
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '3rem' }}>
          One plan. Unlimited reviews. No per-seat nonsense.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
          {/* Free Tier */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 8px rgba(0,0,0,0.07)', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Free</h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb', marginBottom: '1.5rem' }}>
              $0<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>/mo</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', color: '#475569', fontSize: '0.9rem', lineHeight: '2' }}>
              <li>✅ 5 reviews / month</li>
              <li>✅ All playbooks (accessibility, security, best practices)</li>
              <li>✅ 1 connected repo</li>
              <li>✅ Full review history</li>
              <li>✅ GitHub OAuth login</li>
            </ul>
            <Link
              href={session ? '/dashboard' : '/login'}
              style={{ display: 'block', textAlign: 'center', background: '#f1f5f9', color: '#475569', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
            >
              {session ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
          </div>

          {/* Pro Tier */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 24px rgba(37,99,235,0.15)',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#2563eb',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: '1rem',
                textTransform: 'uppercase',
              }}
            >
              Most Popular
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Pro</h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#60a5fa', marginBottom: '1.5rem' }}>
              $29<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/mo</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '2' }}>
              <li>✅ Unlimited reviews</li>
              <li>✅ Unlimited repos</li>
              <li>✅ All playbooks + custom rule editing</li>
              <li>✅ Full review history</li>
              <li>✅ Priority support</li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                background: '#2563eb',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Redirecting...' : 'Upgrade to Pro →'}
            </button>
          </div>
        </div>

        <p style={{ marginTop: '3rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          Cancel anytime. No contracts. Questions? Email{' '}
          <a href="mailto:support@solonreview.dev" style={{ color: '#2563eb' }}>support@solonreview.dev</a>
        </p>
      </main>
    </div>
  );
}
