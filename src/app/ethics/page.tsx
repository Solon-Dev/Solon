export default function EthicsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#1e293b', padding: '1rem 2rem' }}>
        <a href="/" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none' }}>🛡️ Solon AI</a>
      </nav>
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          Ethics & Principles
        </h1>
        <p style={{ color: '#64748b', marginBottom: '3rem', fontSize: '1.05rem' }}>
          AI code review tools have real power over developer workflows. That comes with responsibility.
          These are the principles Solon AI is built on — not as marketing copy, but as technical commitments.
        </p>

        {[
          {
            title: '🔍 Transparency',
            body: 'Every review explains WHY something is flagged, not just THAT it is. Solon cites the exact file, line number, the violation, and the correct fix. No black box verdicts.'
          },
          {
            title: '🙋 Human Override',
            body: 'Solon surfaces issues. Humans make decisions. The tool posts a comment on your PR — it never auto-blocks a merge. Your team stays in control.'
          },
          {
            title: '🚫 No Surveillance',
            body: 'Review data is scoped to repositories, not individuals. Solon cannot be used to score, rank, or evaluate individual developers. There is no user_id in our reviews table — by design.'
          },
          {
            title: '⚖️ Bias Awareness',
            body: 'Your team defines the playbook rules, not an opaque algorithm with unknown training data. You decide what gets enforced. Solon enforces it consistently.'
          },
          {
            title: '📦 Data Minimalism',
            body: 'Solon only processes the git diff — the lines of code that actually changed. We never send full file contents, repository history, or unrelated code to any AI model.'
          }
        ].map(({ title, body }) => (
          <div key={title} style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{title}</h2>
            <p style={{ color: '#475569', lineHeight: '1.7', margin: 0 }}>{body}</p>
          </div>
        ))}

        <p style={{ marginTop: '3rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          Questions? <a href="mailto:support@solonreview.dev" style={{ color: '#2563eb' }}>support@solonreview.dev</a>
        </p>
      </main>
    </div>
  )
}
