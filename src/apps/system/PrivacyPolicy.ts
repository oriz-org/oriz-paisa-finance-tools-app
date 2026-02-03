/**
 * FinSuite OS - Privacy Policy Page
 * Required for Google AdSense approval
 */

export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🔒 Privacy Policy</h1>
      <p class="page-subtitle">Last updated: February 2026</p>
    </header>

    <article class="glass-card" style="padding: var(--space-8); max-width: 800px; margin: 0 auto;">
      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">Introduction</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          FinSuite OS ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and safeguard your information when you use our financial calculator
          and planning tools at money.chirag127.in.
        </p>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">Information We Collect</h2>
        <h3 style="margin: var(--space-4) 0; color: var(--text-primary);">Data You Provide</h3>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li>Calculator inputs (investment amounts, rates, tenure) - stored locally only</li>
          <li>User preferences and settings - stored in your browser</li>
          <li>Cloud sync data (if enabled via Puter.js) - stored securely in your Puter cloud</li>
        </ul>

        <h3 style="margin: var(--space-4) 0; color: var(--text-primary);">Automatically Collected Data</h3>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li>Usage analytics (page views, feature usage)</li>
          <li>Device information (browser type, screen size)</li>
          <li>IP address (for analytics purposes)</li>
        </ul>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">How We Use Your Information</h2>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li>Provide and improve our financial calculation services</li>
          <li>Personalize your experience with saved preferences</li>
          <li>Display relevant advertisements via Google AdSense</li>
          <li>Analyze usage patterns to improve our tools</li>
        </ul>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">Third-Party Services</h2>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: var(--space-4);">
          We use the following third-party services:
        </p>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li><strong>Google AdSense</strong> - Displays advertisements (uses cookies for ad personalization)</li>
          <li><strong>Puter.js</strong> - Cloud storage for user preferences (optional)</li>
          <li><strong>CoinGecko API</strong> - Cryptocurrency price data</li>
          <li><strong>Google Fonts</strong> - Typography</li>
        </ul>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">Cookies & Advertising</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          We use cookies for functionality and advertising purposes. Google AdSense uses cookies to serve
          ads based on your visit to our site and other sites on the Internet. You may opt out of
          personalized advertising by visiting
          <a href="https://www.google.com/settings/ads" target="_blank" style="color: var(--accent-primary);">Google Ads Settings</a>.
        </p>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">Data Security</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          All calculator data is processed locally in your browser. We do not store your financial
          calculations on our servers. Cloud sync data (if enabled) is encrypted and stored securely
          in your personal Puter cloud account.
        </p>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">Your Rights</h2>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li>Access your stored data at any time</li>
          <li>Request deletion of your cloud-synced data</li>
          <li>Opt out of personalized advertising</li>
          <li>Clear local browser data at any time</li>
        </ul>
      </section>

      <section>
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">Contact Us</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          For any privacy-related questions, please contact us at:
          <a href="mailto:chirag@chirag127.in" style="color: var(--accent-primary);">chirag@chirag127.in</a>
        </p>
      </section>
    </article>
  `;

  return container;
}
