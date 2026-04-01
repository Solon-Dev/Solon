import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: '#0a0f1e', color: '#e2e8f0', minHeight: '100vh' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link { color: #94a3b8; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #e2e8f0; }
        .btn-primary { background: #6366f1; color: white; padding: 0.75rem 1.75rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: background 0.2s, transform 0.15s; display: inline-block; }
        .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); }
        .btn-secondary { background: transparent; color: #94a3b8; padding: 0.75rem 1.75rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem; border: 1px solid #1e293b; transition: border-color 0.2s, color 0.2s; display: inline-block; }
        .btn-secondary:hover { border-color: #6366f1; color: #e2e8f0; }
        .feature-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 1.75rem; transition: border-color 0.2s, transform 0.2s; }
        .feature-card:hover { border-color: #6366f1; transform: translateY(-2px); }
        .step-number { width: 36px; height: 36px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; color: white; flex-shrink: 0; }
        .rule-tag { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 0.35rem 0.75rem; font-size: 0.78rem; color: #94a3b8; font-family: 'DM Mono', monospace; }
        .rule-tag.active { background: #1e1b4b; border-color: #6366f1; color: #a5b4fc; }
        .pricing-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 2rem; }
        .pricing-card.featured { background: #1e1b4b; border-color: #6366f1; }
        .check-item { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.9rem; color: #cbd5e1; margin-bottom: 0.75rem; }
        .check-icon { color: #6366f1; font-size: 1rem; margin-top: 1px; flex-shrink: 0; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-headline { font-size: 2.5rem !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10, 15, 30, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e293b',
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🛡️</span>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9' }}>Solon AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <Link href="/privacy" className="nav-link">Privacy</Link>
          <Link href="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            Sign In →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '7rem 2rem 5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#1e1b4b', border: '1px solid #6366f1',
            borderRadius: '100px', padding: '0.4rem 1rem',
            fontSize: '0.8rem', color: '#a5b4fc', marginBottom: '2rem', fontWeight: 500,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}></span>
            Team Standards Dashboard — live March 2026
          </div>

          <h1 className="hero-headline" style={{
            fontSize: '3.75rem', fontWeight: 700, lineHeight: 1.1,
            color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: '1.5rem',
          }}>
            Your team&apos;s coding
            <span style={{ color: '#6366f1' }}> standards,</span>
            <br />enforced automatically.
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            Define the rules your team actually cares about. Solon enforces them on every PR
            and tracks compliance across all your repos — no config files, no arguments in code review.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '0.95rem' }}>
              Start free — sign in with GitHub
            </Link>
            <a href="#how-it-works" className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '0.95rem' }}>
              See how it works
            </a>
          </div>
          <p style={{ color: '#475569', fontSize: '0.825rem', marginTop: '1.25rem' }}>
            Free tier included · $29/month for unlimited · No credit card to start
          </p>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div style={{
          marginTop: '5rem', background: '#0f172a',
          border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            background: '#1e293b', padding: '0.75rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            borderBottom: '1px solid #334155',
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
            <div style={{ marginLeft: '1rem', background: '#0f172a', borderRadius: '6px', padding: '0.25rem 1rem', fontSize: '0.75rem', color: '#64748b' }}>
              solonreview.dev/dashboard
            </div>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem' }}>
            <div style={{ borderRight: '1px solid #1e293b', paddingRight: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</div>
              {['Dashboard', 'Repos', 'Playbooks', 'Reviews', 'Billing'].map((item, i) => (
                <div key={item} style={{
                  padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem',
                  color: i === 0 ? '#e2e8f0' : '#64748b',
                  background: i === 0 ? '#1e293b' : 'transparent',
                  marginBottom: '0.25rem',
                }}>
                  {item}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Connected Repos', value: '4', color: '#6366f1' },
                  { label: 'Reviews This Month', value: '23', color: '#22c55e' },
                  { label: 'Standards Pass Rate', value: '91%', color: '#f59e0b' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>Recent Reviews</div>
                {[
                  { pr: '#42 Add user authentication', repo: 'api-service', status: '✅ Pass', color: '#22c55e' },
                  { pr: '#41 Fix payment webhook', repo: 'api-service', status: '⚠️ Warning', color: '#f59e0b' },
                  { pr: '#18 Update dashboard UI', repo: 'frontend', status: '🚫 Fail', color: '#ef4444' },
                ].map(review => (
                  <div key={review.pr} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.6rem 0', borderBottom: '1px solid #334155', fontSize: '0.8rem',
                  }}>
                    <div>
                      <div style={{ color: '#e2e8f0' }}>{review.pr}</div>
                      <div style={{ color: '#475569', fontSize: '0.72rem' }}>{review.repo}</div>
                    </div>
                    <div style={{ color: review.color, fontWeight: 600, fontSize: '0.78rem' }}>{review.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Everything your team needs
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            Built for teams that care about consistency, not just catching bugs.
          </p>
        </div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {[
            { icon: '📋', title: 'Visual Playbook Editor', desc: 'Toggle rules on and off without touching a config file. Your team lead sets the standards, Solon enforces them.' },
            { icon: '🔍', title: 'Standards Enforcement', desc: 'Accessibility (WCAG), Security, and Best Practices rules run on every PR. 23 built-in rules, more coming.' },
            { icon: '📊', title: 'Review History Dashboard', desc: 'See every PR reviewed across all your connected repos. Track compliance trends over time.' },
            { icon: '⚡', title: 'Instant PR Comments', desc: 'Reviews post directly to your GitHub PR within 30 seconds of opening. No workflow changes needed.' },
            { icon: '🔒', title: 'BYOK — Your Key', desc: 'Bring your own Anthropic API key. Your code never leaves your control. ~$0.03 per review.' },
            { icon: '🧪', title: 'Unit Test Generation', desc: 'Automatically generates unit tests covering happy paths and edge cases for every PR reviewed.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: '1.75rem', marginBottom: '0.875rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLAYBOOK DEMO */}
      <section style={{ background: '#0f172a', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', padding: '5rem 2rem' }}>
        <div className="hero-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Team Playbooks</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Your rules. Not someone else&apos;s linter config.
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Every team has standards that matter to them — the DRY rule your senior dev keeps mentioning,
              the error handling pattern you documented six months ago, the accessibility checks that keep
              slipping through. Solon enforces them automatically on every PR.
            </p>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Toggle rules on or off per repo. Set severity levels. No YAML files, no linter plugins,
              no onboarding docs. Just pick your rules and go.
            </p>
          </div>
          <div style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '1.25rem' }}>Playbooks — api-service repo</div>
            {[
              { name: 'Security', rules: ['No hardcoded secrets', 'SQL injection prevention', 'XSS protection', 'Auth checks'], enabled: true },
              { name: 'Accessibility', rules: ['Alt text required', 'Keyboard navigation', 'Form labels', 'Color contrast'], enabled: true },
              { name: 'Best Practices', rules: ['No console.log', 'Error handling', 'DRY principle', 'TypeScript types'], enabled: false },
            ].map(playbook => (
              <div key={playbook.name} style={{ marginBottom: '1.25rem', background: '#0f172a', borderRadius: '8px', padding: '1rem', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{playbook.name}</span>
                  <div style={{ width: '36px', height: '20px', borderRadius: '100px', background: playbook.enabled ? '#6366f1' : '#334155', position: 'relative' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: playbook.enabled ? '19px' : '3px' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {playbook.rules.map(rule => (
                    <span key={rule} className={`rule-tag${playbook.enabled ? ' active' : ''}`}>{rule}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Up and running in minutes
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>No config files. No DevOps. Just connect and go.</p>
        </div>
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { n: '1', title: 'Sign in with GitHub', desc: 'One click. We use GitHub OAuth — no new passwords.' },
            { n: '2', title: 'Connect your repos', desc: 'Select which repos Solon monitors. Toggle on in one click.' },
            { n: '3', title: 'Configure your playbooks', desc: 'Pick the standards that matter to your team. Toggle rules on or off.' },
            { n: '4', title: 'Open a PR', desc: 'Solon reviews it automatically and posts results to your dashboard and PR.' },
          ].map(step => (
            <div key={step.n} style={{ textAlign: 'center' }}>
              <div className="step-number" style={{ margin: '0 auto 1rem' }}>{step.n}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.5rem' }}>{step.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Simple, flat pricing
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>One plan. Unlimited reviews. No per-seat nonsense.</p>
          </div>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="pricing-card">
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>Free</div>
              <div style={{ fontSize: '2.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>$0</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.75rem' }}>5 reviews / month</div>
              <div className="check-item"><span className="check-icon">✦</span>1 connected repo</div>
              <div className="check-item"><span className="check-icon">✦</span>All 3 playbooks (23 rules)</div>
              <div className="check-item"><span className="check-icon">✦</span>Full review history</div>
              <div className="check-item"><span className="check-icon">✦</span>GitHub OAuth login</div>
              <div className="check-item"><span className="check-icon">✦</span>Dashboard access</div>
              <Link href="/login" className="btn-secondary" style={{ display: 'block', textAlign: 'center', marginTop: '1.75rem' }}>
                Get started free
              </Link>
            </div>
            <div className="pricing-card featured">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#a5b4fc' }}>Pro</div>
                <div style={{ background: '#6366f1', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>MOST POPULAR</div>
              </div>
              <div style={{ fontSize: '2.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>$29</div>
              <div style={{ fontSize: '0.85rem', color: '#6366f1', marginBottom: '1.75rem' }}>per month · flat rate</div>
              <div className="check-item"><span className="check-icon">✦</span>Unlimited reviews</div>
              <div className="check-item"><span className="check-icon">✦</span>Unlimited repos</div>
              <div className="check-item"><span className="check-icon">✦</span>All playbooks + custom rule editing</div>
              <div className="check-item"><span className="check-icon">✦</span>Full review history + trends</div>
              <div className="check-item"><span className="check-icon">✦</span>Priority support</div>
              <Link href="/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1.75rem' }}>
                Upgrade to Pro →
              </Link>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.825rem', marginTop: '1.5rem' }}>
            Cancel anytime. No contracts. Questions? Email{' '}
            <a href="mailto:support@solonreview.dev" style={{ color: '#6366f1', textDecoration: 'none' }}>support@solonreview.dev</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
          Stop fighting about standards in code review.
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 2.5rem' }}>
          Set your team&apos;s rules once. Solon enforces them on every PR, automatically, without anyone having to say anything.
        </p>
        <Link href="/login" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
          Start free — sign in with GitHub
        </Link>
        <p style={{ color: '#334155', fontSize: '0.825rem', marginTop: '1rem' }}>Free tier included · No credit card required</p>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #1e293b', padding: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🛡️</span>
          <span style={{ color: '#475569', fontSize: '0.875rem' }}>© 2026 Solon AI. Built with Claude AI by Anthropic.</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/privacy" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service</Link>
          <a href="mailto:support@solonreview.dev" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Support</a>
        </div>
      </footer>

    </div>
  )
}
