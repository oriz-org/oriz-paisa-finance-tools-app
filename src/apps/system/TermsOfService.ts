/**
 * FinSuite OS - Terms of Service Page
 * Required for Google AdSense approval
 */

export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">📜 Terms of Service</h1>
      <p class="page-subtitle">Last updated: February 2026</p>
    </header>

    <article class="glass-card" style="padding: var(--space-8); max-width: 800px; margin: 0 auto;">
      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">1. Acceptance of Terms</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          By accessing and using FinSuite OS (money.chirag127.in), you accept and agree to be bound by
          these Terms of Service. If you do not agree to these terms, please do not use our service.
        </p>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">2. Description of Service</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          FinSuite OS provides free financial calculators and planning tools including but not limited to:
        </p>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li>Investment calculators (SIP, Lumpsum, FIRE)</li>
          <li>Banking calculators (EMI, FD, RD, PPF)</li>
          <li>Market trackers (Crypto, Stocks, Gold)</li>
          <li>Tax planning tools</li>
          <li>AI-powered financial insights</li>
        </ul>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">3. Disclaimer</h2>
        <div style="background: rgba(255, 59, 48, 0.1); border: 1px solid rgba(255, 59, 48, 0.3); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
          <p style="color: var(--accent-cost); font-weight: 600; margin-bottom: var(--space-2);">⚠️ Important Disclaimer</p>
          <p style="color: var(--text-secondary); line-height: 1.8;">
            The calculators and tools provided are for <strong>informational and educational purposes only</strong>.
            They do not constitute financial, investment, tax, or legal advice. Always consult with a
            qualified financial advisor before making investment decisions.
          </p>
        </div>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li>Results are estimates based on inputs provided and may not reflect actual returns</li>
          <li>Past performance does not guarantee future results</li>
          <li>Market data may be delayed and is provided "as-is"</li>
          <li>We are not SEBI registered investment advisors</li>
        </ul>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">4. User Responsibilities</h2>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li>Provide accurate information for calculations</li>
          <li>Verify all results independently before making financial decisions</li>
          <li>Do not use the service for any illegal purposes</li>
          <li>Do not attempt to circumvent, disable, or interfere with the service</li>
        </ul>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">5. Intellectual Property</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          All content, design, and code of FinSuite OS is the property of the creator unless otherwise
          stated. You may not copy, modify, or distribute our content without permission.
        </p>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">6. Third-Party Services</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          Our service integrates with third-party APIs and services. We are not responsible for
          the availability, accuracy, or reliability of data from these services. This includes:
        </p>
        <ul style="color: var(--text-secondary); line-height: 2; padding-left: var(--space-6);">
          <li>CoinGecko (cryptocurrency data)</li>
          <li>Exchange rate APIs (currency conversion)</li>
          <li>News aggregation services</li>
        </ul>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">7. Limitation of Liability</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          FinSuite OS and its creator shall not be liable for any direct, indirect, incidental,
          special, or consequential damages resulting from the use or inability to use our service,
          including but not limited to financial losses based on calculator outputs.
        </p>
      </section>

      <section style="margin-bottom: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">8. Changes to Terms</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          We reserve the right to modify these terms at any time. Continued use of the service after
          changes constitutes acceptance of the new terms.
        </p>
      </section>

      <section>
        <h2 style="margin-bottom: var(--space-4); color: var(--accent-primary);">9. Contact</h2>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          For questions about these terms, contact:
          <a href="mailto:chirag@chirag127.in" style="color: var(--accent-primary);">chirag@chirag127.in</a>
        </p>
      </section>
    </article>
  `;

  return container;
}
