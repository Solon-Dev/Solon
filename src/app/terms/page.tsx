import Link from 'next/link';

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '3rem' }}>
          Last Updated: April 2, 2026
        </p>

        {[
          {
            title: 'Acceptance of Terms',
            content: `By creating an account or using Solon AI, you agree to these Terms of Service. If you do not agree, do not use the service.`,
          },
          {
            title: 'What Solon AI Is',
            content: `Solon AI is a Team Standards Enforcement Dashboard. It connects to your GitHub repositories via webhook, reviews pull requests against your configured playbook rules using AI, and surfaces results in a dashboard and as PR comments. It is not a general-purpose code review tool, security scanner, or bug detector.`,
          },
          {
            title: 'Accounts',
            content: `• You sign in using GitHub OAuth — you are responsible for your GitHub account security
- One account per person or team
- You must be 18 or older to use Solon AI
- We reserve the right to suspend accounts that violate these terms`,
          },
          {
            title: 'Pricing and Billing',
            content: `• Free tier: 5 reviews per month, 1 connected repo
- Pro tier: $29/month flat — unlimited reviews, unlimited repos
- Billing is handled by Stripe. You can cancel anytime from your account settings.
- No refunds for partial months, but you keep access until the end of your billing period
- We reserve the right to change pricing with 30 days notice`,
          },
          {
            title: 'Your Responsibilities',
            content: `• Only connect repos you have permission to access
- Do not use Solon AI to review code you do not own or have rights to
- Do not attempt to reverse engineer, copy, or resell the service
- Do not abuse the service in ways that degrade performance for other users`,
          },
          {
            title: 'AI Review Disclaimer',
            content: `Solon AI uses Anthropic's Claude API to generate review feedback. Reviews are suggestions, not guarantees. You are responsible for:

- Reviewing all AI feedback before acting on it
- Verifying the accuracy of recommendations
- All final decisions about code quality, security, and production readiness

AI-generated reviews can be wrong. Do not rely on them as your only quality gate.`,
          },
          {
            title: 'Data and Privacy',
            content: `Your use of Solon AI is governed by our Privacy Policy at solonreview.dev/privacy. We store review results and account information. We do not store your source code.`,
          },
          {
            title: 'Service Availability',
            content: `We aim for high availability but do not guarantee uptime. We are not liable for:

- Service interruptions or downtime
- Incorrect or incomplete AI review suggestions
- Any damages resulting from use of the service`,
          },
          {
            title: 'Intellectual Property',
            content: `Solon AI, its dashboard, playbook system, and branding are proprietary. You may not copy, fork, or redistribute the product without permission.`,
          },
          {
            title: 'Termination',
            content: `You can cancel your account at any time. We may terminate accounts that violate these terms. On termination, your data will be deleted within 30 days upon request.`,
          },
          {
            title: 'Changes to Terms',
            content: `We may update these terms. Continued use after changes constitutes acceptance. We will notify users of material changes via email.`,
          },
          {
            title: 'Governing Law',
            content: `These terms are governed by the laws of the United States and the State of Pennsylvania.`,
          },
          {
            title: 'Contact',
            content: `Questions about these terms?\nEmail: donta.ruffin@gmail.com`,
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
