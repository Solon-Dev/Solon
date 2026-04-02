import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0' }}>
      <nav style={{
        background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
        padding: '1rem 2rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Link href="/" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
          🛡️ Solon AI
        </Link>
        <Link href="/" style={{
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
          color: '#a5b4fc', padding: '0.4rem 1rem', borderRadius: '0.4rem',
          textDecoration: 'none', fontSize: '0.85rem',
        }}>
          ← Back to Home
        </Link>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '3rem' }}>
          Last Updated: April 2, 2026
        </p>

        {[
          {
            title: 'Overview',
            content: `Solon AI is a Team Standards Enforcement Dashboard that helps development teams define and enforce coding standards automatically on every pull request. We take your privacy seriously and are transparent about what data we collect and how we use it.`,
          },
          {
            title: 'Data We Collect',
            content: `When you sign in and use Solon AI, we collect and store the following:

- GitHub profile information (name, email, avatar) obtained via GitHub OAuth
- Connected repository names and IDs (not your code)
- Playbook configurations you set for each repo
- PR review results — summaries, playbook violations, edge cases, and suggested tests
- Subscription and billing status (managed via Stripe)

We do not store your source code. Code diffs are sent to Anthropic's Claude API for analysis and are not retained by Solon AI after the review is complete.`,
          },
          {
            title: 'How It Works',
            content: `1. You sign in with GitHub OAuth — we receive your profile info and repo access
2. You connect repos through the Solon dashboard
3. When a PR opens on a connected repo, a webhook notifies Solon
4. The code diff is sent to Anthropic's Claude API for analysis
5. The review result is posted as a PR comment and saved to your Solon dashboard
6. Your code is not stored — only the review output is retained`,
          },
          {
            title: 'Third-Party Services',
            content: `• Anthropic Claude API — code diffs are sent for AI analysis. Subject to Anthropic's privacy policy.
- GitHub — OAuth authentication and webhook integration
- Neon (Postgres) — stores user accounts, repo connections, playbook configs, and review results
- Stripe — handles subscription billing. We do not store card details.
- Vercel — hosts the Solon AI application`,
          },
          {
            title: 'Data Security',
            content: `• All data is transmitted over HTTPS
- Database access is restricted and authenticated
- We do not sell or share your data with third parties
- Stripe handles all payment data — we never see your card number`,
          },
          {
            title: 'Data Retention',
            content: `• Your account data is retained while your account is active
- Review history is retained to power your dashboard
- You can request deletion of your account and associated data at any time by emailing us`,
          },
          {
            title: 'GDPR',
            content: `If you are in the EU or UK, you have the right to access, correct, or delete your personal data. Contact us at donta.ruffin@gmail.com to exercise these rights.`,
          },
          {
            title: 'Changes to This Policy',
            content: `We will update this page when our practices change. Continued use of Solon AI after changes constitutes acceptance.`,
          },
          {
            title: 'Contact',
            content: `Questions about this policy?\nEmail: donta.ruffin@gmail.com`,
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: '1.1rem', fontWeight: 700, color: '#a5b4fc',
              marginBottom: '0.75rem', paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(99,102,241,0.2)',
            }}>
              {section.title}
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
              {section.content}
            </p>
          </div>
        ))}

        <div style={{
          borderTop: '1px solid rgba(99,102,241,0.2)', paddingTop: '2rem',
          marginTop: '2rem',
        }}>
          <p style={{ color: '#475569', fontSize: '0.8rem', fontStyle: 'italic' }}>
            TL;DR: We store your account info, repo connections, playbook settings, and review results to power your dashboard. We never store your actual source code. We don't sell your data. Ever.
          </p>
        </div>
      </div>

      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem', textAlign: 'center',
      }}>
        <p style={{ color: '#334155', fontSize: '0.8rem' }}>
          © 2026 Solon AI · Built with Claude AI by Anthropic
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Link href="/privacy" style={{ color: '#475569', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: '#475569', fontSize: '0.8rem', textDecoration: 'none' }}>Terms</Link>
        </div>
      </footer>
    </div>
  )
}
