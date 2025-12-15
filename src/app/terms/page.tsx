import Link from 'next/link';
import styles from '../Home.module.css';

export default function TermsOfService() {
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
            Terms of Service - Solon AI
          </h1>
          
          <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '3rem'}}>
            Last Updated: November 27, 2025
          </p>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Acceptance of Terms</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              By installing Solon AI, you agree to these terms.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Service Description</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              Solon AI provides automated code review suggestions for GitHub pull requests using AI analysis.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Your Responsibilities</h2>
            <ol style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li style={{marginBottom: '0.75rem'}}>
                <strong>API Key:</strong> You must provide your own Anthropic API key
              </li>
              <li style={{marginBottom: '0.75rem'}}>
                <strong>Costs:</strong> You pay Anthropic directly for API usage (~$0.03 per review)
              </li>
              <li style={{marginBottom: '0.75rem'}}>
                <strong>Compliance:</strong> Use only on code you have rights to review
              </li>
              <li style={{marginBottom: '0.75rem'}}>
                <strong>Security:</strong> Keep your API key secure in GitHub Secrets
              </li>
            </ol>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Our Responsibilities</h2>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>Provide the service as described</li>
              <li>Maintain reasonable uptime and availability</li>
              <li>Protect your privacy (see our Privacy Policy)</li>
              <li>Provide support through listed channels</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Service Availability</h2>
            <p style={{color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem'}}>
              We provide Solon AI &quot;as is&quot; without warranties. While we strive for reliability, we cannot guarantee:
            </p>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>Uninterrupted service</li>
              <li>Error-free operation</li>
              <li>Specific uptime percentages</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>AI Analysis Disclaimer</h2>
            <p style={{color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem'}}>
              AI-generated code reviews are suggestions, not guarantees. You are responsible for:
            </p>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>Reviewing all AI suggestions before implementing them</li>
              <li>Verifying the accuracy of recommendations</li>
              <li>Testing all code changes thoroughly</li>
              <li>Final decisions about code quality and security</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Limitation of Liability</h2>
            <p style={{color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem'}}>
              Solon AI and its creators are not liable for:
            </p>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>Bugs or security issues in your code</li>
              <li>API costs from Anthropic</li>
              <li>Downtime or service interruptions</li>
              <li>Incorrect or incomplete AI suggestions</li>
              <li>Any damages resulting from use of the service</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Prohibited Uses</h2>
            <p style={{color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem'}}>
              You may not use Solon AI to:
            </p>
            <ul style={{color: '#475569', lineHeight: 1.8, paddingLeft: '1.5rem'}}>
              <li>Review code you don&apos;t have permission to access</li>
              <li>Violate any laws or regulations</li>
              <li>Reverse engineer or copy the service</li>
              <li>Abuse or overload the service</li>
              <li>Share or resell your access</li>
            </ul>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Pricing and Payments</h2>
            <div style={{marginBottom: '1.5rem'}}>
              <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b'}}>Free Tier</h3>
              <p style={{color: '#475569', lineHeight: 1.7}}>Core features are free. You only pay Anthropic for API usage.</p>
            </div>
            <div>
              <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b'}}>Pro Tier (Future)</h3>
              <p style={{color: '#475569', lineHeight: 1.7}}>Premium features may require a subscription. Pricing will be clearly displayed before purchase.</p>
            </div>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Termination</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              You may stop using Solon AI anytime by uninstalling the GitHub App. We may suspend or terminate access for violations of these terms.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Changes to Terms</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              We may update these terms. Continued use after changes constitutes acceptance. We&apos;ll notify users of material changes.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Open Source</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              Solon AI&apos;s code is open source. See our{' '}
              <a 
                href="https://github.com/DontaRuffin/solon-ai" 
                style={{color: '#2563eb', textDecoration: 'none'}}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub repository
              </a>
              {' '}for license details.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Governing Law</h2>
            <p style={{color: '#475569', lineHeight: 1.7}}>
              These terms are governed by the laws of the United States and the State of Pennsylvania.
            </p>
          </section>

          <section style={{marginBottom: '2.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b'}}>Support</h2>
            <p style={{color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem'}}>
              For technical support or questions:
            </p>
            <ul style={{listStyle: 'none', padding: 0, color: '#475569', lineHeight: 1.8}}>
              <li><strong>Email:</strong> <a href="mailto:donta.ruffin@gmail.com" style={{color: '#2563eb', textDecoration: 'none'}}>donta.ruffin@gmail.com</a></li>
              <li><strong>GitHub Issues:</strong> <a href="https://github.com/DontaRuffin/solon-ai/issues" style={{color: '#2563eb', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">https://github.com/DontaRuffin/solon-ai/issues</a></li>
            </ul>
          </section>

          <div style={{borderTop: '1px solid #e2e8f0', paddingTop: '2rem', marginTop: '3rem'}}>
            <p style={{fontSize: '0.875rem', color: '#64748b'}}>
              By using Solon AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
