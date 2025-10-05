export default function Home() {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #ffffff;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        header {
          padding: 20px 0;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          z-index: 100;
        }
        
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #2563eb;
        }
        
        .cta-button {
          background: #2563eb;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          display: inline-block;
        }
        
        .cta-button:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .cta-button-secondary {
          background: transparent;
          color: #2563eb;
          border: 2px solid #2563eb;
        }
        
        .cta-button-secondary:hover {
          background: #eff6ff;
          transform: translateY(-1px);
        }
        
        .hero {
          padding: 80px 0 60px;
          text-align: center;
        }
        
        .hero h1 {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 24px;
          line-height: 1.1;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero p {
          font-size: 20px;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto 40px;
        }
        
        .hero-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .badge {
          display: inline-block;
          background: #eff6ff;
          color: #2563eb;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .screenshot {
          background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
          padding: 60px 0;
        }
        
        .screenshot-container {
          max-width: 900px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .screenshot img {
          width: 100%;
          display: block;
        }
        
        .features {
          padding: 80px 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .section-header h2 {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .section-header p {
          font-size: 18px;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }
        
        .feature-card {
          text-align: center;
          padding: 32px;
        }
        
        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
        }
        
        .feature-card h3 {
          font-size: 22px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .feature-card p {
          color: #6b7280;
          line-height: 1.7;
        }
        
        .pricing {
          background: #f9fafb;
          padding: 80px 0;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .pricing-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 40px 32px;
          text-align: center;
          transition: all 0.3s;
        }
        
        .pricing-card:hover {
          border-color: #2563eb;
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
        }
        
        .pricing-card.featured {
          border-color: #2563eb;
          position: relative;
          box-shadow: 0 8px 30px rgba(37, 99, 235, 0.2);
        }
        
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .pricing-card h3 {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .pricing-card .price {
          font-size: 48px;
          font-weight: 800;
          color: #2563eb;
          margin: 20px 0;
        }
        
        .pricing-card .price span {
          font-size: 18px;
          color: #6b7280;
          font-weight: 400;
        }
        
        .pricing-card ul {
          list-style: none;
          margin: 24px 0;
          text-align: left;
        }
        
        .pricing-card li {
          padding: 12px 0;
          display: flex;
          align-items: start;
          gap: 12px;
        }
        
        .pricing-card li::before {
          content: "✓";
          color: #2563eb;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .final-cta {
          padding: 80px 0;
          text-align: center;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
        }
        
        .final-cta h2 {
          font-size: 40px;
          margin-bottom: 20px;
        }
        
        .final-cta p {
          font-size: 20px;
          margin-bottom: 32px;
          opacity: 0.9;
        }
        
        .final-cta .cta-button {
          background: white;
          color: #2563eb;
        }
        
        .final-cta .cta-button:hover {
          background: #f9fafb;
        }
        
        footer {
          padding: 40px 0;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
        }
        
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 36px;
          }
          
          .hero p {
            font-size: 18px;
          }
          
          .section-header h2 {
            font-size: 32px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header>
        <nav className="container">
          <div className="logo">🛡️ Solon AI</div>
          <a href="https://github.com/marketplace" className="cta-button">Install on GitHub</a>
        </nav>
      </header>

      <section className="hero">
        <div className="container">
          <div className="badge">JavaScript & TypeScript Support</div>
          <h1>AI Code Reviews in Seconds</h1>
          <p>Automate code quality checks on every pull request. Catch bugs, identify edge cases, and generate unit tests instantly.</p>
          <div className="hero-buttons">
            <a href="https://github.com/marketplace" className="cta-button">Start Free</a>
            <a href="#pricing" className="cta-button cta-button-secondary">View Pricing</a>
          </div>
        </div>
      </section>

      <section className="screenshot">
        <div className="container">
          <div className="screenshot-container">
            <img src="https://via.placeholder.com/900x600/f3f4f6/2563eb?text=Solon+AI+Review+Screenshot" alt="Solon AI in action" />
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Ship Better Code, Faster</h2>
            <p>Intelligent analysis powered by Claude AI, designed specifically for development teams</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Automated Bug Detection</h3>
              <p>Identifies logic errors, edge cases, and potential runtime issues before they reach production.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Feedback</h3>
              <p>Reviews appear within seconds of opening a pull request. No more waiting for human reviewers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧪</div>
              <h3>Smart Test Generation</h3>
              <p>Automatically generates comprehensive Jest unit tests covering both happy paths and edge cases.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Security First</h3>
              <p>No code storage. Analysis happens in real-time with immediate deletion after processing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Zero Configuration</h3>
              <p>Install from GitHub Marketplace and start receiving reviews immediately. Works with existing workflows.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Consistent Quality</h3>
              <p>AI doesn&apos;t have bad days. Get thorough, objective feedback on every single pull request.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="price">$0<span>/month</span></div>
              <ul>
                <li>50 PR reviews per month</li>
                <li>JavaScript & TypeScript</li>
                <li>Automated bug detection</li>
                <li>Edge case identification</li>
                <li>Unit test suggestions</li>
                <li>Community support</li>
              </ul>
              <a href="https://github.com/marketplace" className="cta-button cta-button-secondary">Get Started</a>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">$9<span>/month</span></div>
              <ul>
                <li>Unlimited PR reviews</li>
                <li>JavaScript & TypeScript</li>
                <li>Priority analysis</li>
                <li>Advanced test generation</li>
                <li>Detailed analytics</li>
                <li>Email support</li>
              </ul>
              <a href="https://github.com/marketplace" className="cta-button">Start Pro Trial</a>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <h2>Ready to Elevate Your Code Quality?</h2>
          <p>Join developers who are shipping better code with AI-powered reviews</p>
          <a href="https://github.com/marketplace" className="cta-button">Install Solon AI Free</a>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2025 Solon AI. Built for developers, by developers.</p>
        </div>
      </footer>
    </>
  );
}
