import Link from 'next/link';
import styles from '../Home.module.css';

export default function PrivacyPolicy() {
  return (
    <>
      <header>
        <nav className={styles.container} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Link href="/" className={styles.logo}>🛡️ Solon AI</Link>
          <Link href="/" className={styles.ctaButton}>Back to Home</Link>
        </nav>
      </header>

      <div style={{minHeight: '100vh', background: '#fff', padding: '80px 24px'}}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h1 style={{fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b'}}>
            Privacy Policy - Solon AI
          </h1>
          
          <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '3rem'}}>
            Last Updated: November 27, 2025
          </p>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Overview</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              Solon AI is a GitHub App that provides AI-powered code reviews. We are committed to protecting your privacy.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Data We Collect</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              <strong>None.</strong> Solon AI does not collect, store, or retain any user data.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>How It Works</h2>
            <ol style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>When you open a pull request, GitHub Actions triggers our service</li>
              <li>Your code diff is sent directly from your repository to Anthropic&apos;s API using <strong>your own API key</strong></li>
              <li>The AI analysis is returned and posted as a comment</li>
              <li><strong>No data passes through or is stored by Solon AI</strong></li>
            </ol>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Third-Party Services</h2>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li><strong>Anthropic Claude API:</strong> Code diffs are sent to Anthropic for analysis using your API key</li>
              <li><strong>GitHub:</strong> Standard GitHub App permissions for reading PRs and posting comments</li>
              <li><strong>Vercel:</strong> Hosts our API endpoint (stateless, no data storage)</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Your API Key</h2>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>Stored securely in <strong>your</strong> GitHub repository secrets</li>
              <li>Never transmitted to or accessible by Solon AI</li>
              <li>You maintain full control and can revoke anytime</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Data Security</h2>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>All communication uses HTTPS encryption</li>
              <li>No databases, no logs, no data retention</li>
              <li>Open source - audit our code yourself</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>GDPR Compliance</h2>
            <p style={{color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem'}}>
              We are GDPR compliant by design:
            </p>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>No personal data collected</li>
              <li>No data processing</li>
              <li>No data retention</li>
              <li>No cookies or tracking</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Your Rights</h2>
            <p style={{color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem'}}>
              You control all data:
            </p>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>Your code stays in your repository</li>
              <li>Your API key stays in your secrets</li>
              <li>Uninstall anytime with zero data to delete</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Changes to This Policy</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              We will update this page if our privacy practices change.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Contact</h2>
            <p style={{color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem'}}>
              For questions about this Privacy Policy or Solon AI:
            </p>
            <ul style={{listStyle: 'none', padding: 0, color: '#475569', lineHeight: 1.8}}>
              <li><strong>Email:</strong> <a href="mailto:donta.ruffin@gmail.com" style={{color: '#2563eb', textDecoration: 'none'}}>donta.ruffin@gmail.com</a></li>
              <li><strong>GitHub Issues:</strong> <a href="https://github.com/DontaRuffin/solon-ai/issues" style={{color: '#2563eb', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">https://github.com/DontaRuffin/solon-ai/issues</a></li>
            </ul>
          </section>

          <div style={{borderTop: '1px solid #e2e8f0', paddingTop: '2rem', marginTop: '3rem'}}>
            <p style={{fontSize: '0.875rem', color: '#64748b', fontStyle: 'italic'}}>
              <strong>TL;DR:</strong> We don&apos;t collect or store anything. Your code goes from your repo → Anthropic&apos;s API (using your key) → back to your repo as a comment. That&apos;s it.
            </p>
          </div>
        </div>
      </div>

      <footer>
        <div className={styles.container}>
          <p>&copy; 2025 Solon AI. Built with ❤️ using Claude AI by Anthropic</p>
          <p style={{marginTop: '0.5rem', fontSize: '0.875rem'}}>
            <Link href="/privacy" style={{marginRight: '1rem', color: '#2563eb'}}>Privacy Policy</Link>
            <span style={{marginRight: '1rem', color: '#cbd5e1'}}>•</span>
            <Link href="/terms" style={{color: '#2563eb'}}>Terms of Service</Link>
          </p>
        </div>
      </footer>
    </>
  );
}
