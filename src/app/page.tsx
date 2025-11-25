"use client"
import styles from './Home.module.css';

export default function Home() {
  return (
    <>
      <header>
        <nav className={styles.container}>
          <div className={styles.logo}>🛡️ Solon AI</div>
          <a href="https://github.com/apps/solon-ai" className={styles.ctaButton}>Install on GitHub</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>Free Forever with BYOK</div>
          <h1>AI Code Reviews in 30 Seconds</h1>
          <p>Automate code quality checks on every pull request. Catch bugs, identify edge cases, enforce team standards, and generate unit tests instantly. Pay only for what you use.</p>
          <div className={styles.heroButtons}>
            <a href="https://github.com/apps/solon-ai" className={styles.ctaButton}>Install Free</a>
            <a href="#pricing" className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}>See Pricing</a>
          </div>
          <p style={{marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8}}>
            ~$0.03 per review • No monthly fees • No vendor lock-in
          </p>
        </div>
      </section>

      <section className={styles.screenshot}>
        <div className={styles.container}>
          <div className={styles.screenshotContainer}>
            <img src="https://via.placeholder.com/900x600/f3f4f6/2563eb?text=Solon+AI+Review+Screenshot" alt="Solon AI in action" />
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Ship Better Code, Faster</h2>
            <p>Intelligent analysis powered by Claude AI, designed for JavaScript & TypeScript teams</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>Automated Bug Detection</h3>
              <p>Identifies logic errors, edge cases, and potential runtime issues before they reach production.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Instant Feedback</h3>
              <p>Reviews appear within 30 seconds of opening a pull request. No more waiting days for human reviewers.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧪</div>
              <h3>Smart Test Generation</h3>
              <p>Automatically generates comprehensive unit tests covering both happy paths and edge cases.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📋</div>
              <h3>Team Playbooks</h3>
              <p>Enforce custom standards with configurable playbooks. Includes presets for accessibility, security, and best practices with 23+ rules.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Your Key, Your Control</h3>
              <p>Use your own Anthropic API key. Your code stays private. You control costs. Uninstall anytime.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>3-Minute Setup</h3>
              <p>Get your free Anthropic API key, add to repo secrets, install Solon AI. Start getting reviews immediately.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Consistent Quality</h3>
              <p>AI doesn&apos;t have bad days. Get thorough, objective feedback on every single pull request.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pricing} id="pricing">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Transparent Pricing - Pay Only For What You Use</h2>
            <p>No monthly subscriptions. No hidden fees. You control your costs.</p>
          </div>
          <div className={styles.pricingGrid}>
            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <div className={styles.popularBadge}>Recommended</div>
              <h3>Free (BYOK)</h3>
              <div className={styles.price}>~$0.03<span>/review</span></div>
              <p style={{fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.8}}>
                You pay Anthropic directly
              </p>
              <ul>
                <li><strong>Unlimited</strong> PR reviews</li>
                <li>JavaScript & TypeScript support</li>
                <li>Automated bug detection</li>
                <li>Edge case identification</li>
                <li>Unit test generation</li>
                <li><strong>Team Playbooks</strong> for standards enforcement</li>
                <li>Get <strong>$5 free credit</strong> from Anthropic (~80 reviews)</li>
                <li>No monthly fees</li>
                <li>No vendor lock-in</li>
              </ul>
              <a href="https://github.com/apps/solon-ai" className={styles.ctaButton}>Install Free</a>
              <div style={{marginTop: '1rem', fontSize: '0.75rem', opacity: 0.7}}>
                Typical costs: 50 PRs/mo = $2-3 | 200 PRs/mo = $10-12
              </div>
            </div>
          </div>
          
          <div style={{marginTop: '3rem', textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '0.5rem'}}>
            <h3 style={{marginBottom: '1rem'}}>How BYOK Works</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem'}}>
              <div>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>1️⃣</div>
                <h4>Get API Key</h4>
                <p style={{fontSize: '0.875rem', opacity: 0.8}}>Sign up at console.anthropic.com and get your free API key with $5 credit</p>
              </div>
              <div>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>2️⃣</div>
                <h4>Add to Repo</h4>
                <p style={{fontSize: '0.875rem', opacity: 0.8}}>Store your API key in GitHub repository secrets (stays private)</p>
              </div>
              <div>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>3️⃣</div>
                <h4>Install & Go</h4>
                <p style={{fontSize: '0.875rem', opacity: 0.8}}>Install Solon AI and start getting reviews on every PR</p>
              </div>
            </div>
          </div>

          <div style={{marginTop: '2rem', textAlign: 'center'}}>
            <p style={{fontSize: '0.875rem', opacity: 0.8}}>
              <strong>Why BYOK?</strong> You control costs, maintain privacy, and avoid vendor lock-in. 
              Pay only for what you use - no monthly subscriptions or commitments.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>Ready to Speed Up Your Code Reviews?</h2>
          <p>Join developers shipping better code with AI-powered reviews • Setup takes 3 minutes</p>
          <a href="https://github.com/apps/solon-ai" className={styles.ctaButton}>Install Solon AI Free</a>
          <p style={{marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8}}>
            Get $5 free credit from Anthropic • ~80 free code reviews to start
          </p>
        </div>
      </section>

      <footer>
        <div className={styles.container}>
          <p>&copy; 2025 Solon AI. Built with ❤️ using Claude AI by Anthropic</p>
          <p style={{marginTop: '0.5rem', fontSize: '0.875rem'}}>
            <a href="https://github.com/Solon-Dev/Solon/blob/main/PRIVACY.md" style={{marginRight: '1rem'}}>Privacy Policy</a>
            <a href="https://github.com/Solon-Dev/Solon/blob/main/TERMS.md">Terms of Service</a>
          </p>
        </div>
      </footer>
    </>
  );
}
