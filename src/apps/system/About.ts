/**
 * FinSuite OS - About Page
 * Contact information for Google AdSense approval
 */

export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">ℹ️ About FinSuite OS</h1>
      <p class="page-subtitle">Your Free Financial Operating System</p>
    </header>

    <div style="max-width: 900px; margin: 0 auto;">
      <!-- Hero Section -->
      <div class="glass-card" style="padding: var(--space-8); text-align: center; margin-bottom: var(--space-6);">
        <div style="font-size: 64px; margin-bottom: var(--space-4);">💎</div>
        <h2 style="font-size: var(--text-3xl); margin-bottom: var(--space-4); background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          FinSuite OS
        </h2>
        <p style="color: var(--text-secondary); font-size: var(--text-lg); line-height: 1.8; max-width: 600px; margin: 0 auto;">
          A premium, free financial operating system featuring 40+ calculators, real-time market data,
          AI-powered insights, and beautiful glassmorphism design.
        </p>
      </div>

      <!-- Stats -->
      <div class="stats-grid" style="margin-bottom: var(--space-6);">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-value">40+</div>
          <div class="stat-label">Financial Calculators</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">100%</div>
          <div class="stat-label">Free to Use</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔒</div>
          <div class="stat-value">Local</div>
          <div class="stat-label">Data Privacy</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🇮🇳</div>
          <div class="stat-value">India</div>
          <div class="stat-label">Focused Tools</div>
        </div>
      </div>

      <!-- Features -->
      <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
        <h3 style="margin-bottom: var(--space-4); color: var(--accent-primary);">✨ Key Features</h3>
        <div class="grid grid--2" style="gap: var(--space-4);">
          <div style="padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-md);">
            <strong style="color: var(--accent-growth);">💎 Wealth Planning</strong>
            <p style="color: var(--text-tertiary); margin-top: var(--space-2); font-size: var(--text-sm);">
              SIP, Lumpsum, Goal Planning, FIRE Calculator, Step-Up SIP, SWP
            </p>
          </div>
          <div style="padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-md);">
            <strong style="color: var(--accent-neutral);">🏦 Banking Tools</strong>
            <p style="color: var(--text-tertiary); margin-top: var(--space-2); font-size: var(--text-sm);">
              EMI, FD, RD, PPF, SSY, NPS, P2P Lending calculators
            </p>
          </div>
          <div style="padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-md);">
            <strong style="color: var(--accent-warning);">📊 Market Data</strong>
            <p style="color: var(--text-tertiary); margin-top: var(--space-2); font-size: var(--text-sm);">
              Crypto dashboard, Stock watchlist, Gold tracker, Currency converter
            </p>
          </div>
          <div style="padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-md);">
            <strong style="color: var(--accent-secondary);">🤖 AI Insights</strong>
            <p style="color: var(--text-tertiary); margin-top: var(--space-2); font-size: var(--text-sm);">
              AI-powered financial chat assistant for personalized advice
            </p>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
        <h3 style="margin-bottom: var(--space-4); color: var(--accent-primary);">📬 Contact Us</h3>
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="font-size: 20px;">👤</span>
            <div>
              <div style="color: var(--text-tertiary); font-size: var(--text-sm);">Developer</div>
              <div style="color: var(--text-primary);">Chirag Singhal</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="font-size: 20px;">✉️</span>
            <div>
              <div style="color: var(--text-tertiary); font-size: var(--text-sm);">Email</div>
              <a href="mailto:chirag@chirag127.in" style="color: var(--accent-primary);">chirag@chirag127.in</a>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="font-size: 20px;">🌐</span>
            <div>
              <div style="color: var(--text-tertiary); font-size: var(--text-sm);">Website</div>
              <a href="https://chirag127.in" target="_blank" style="color: var(--accent-primary);">chirag127.in</a>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="font-size: 20px;">💻</span>
            <div>
              <div style="color: var(--text-tertiary); font-size: var(--text-sm);">GitHub</div>
              <a href="https://github.com/chirag127" target="_blank" style="color: var(--accent-primary);">github.com/chirag127</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Links -->
      <div class="glass-card" style="padding: var(--space-5); text-align: center;">
        <div style="display: flex; justify-content: center; gap: var(--space-6); flex-wrap: wrap;">
          <a href="/privacy-policy" onclick="event.preventDefault(); window.router.navigate('/privacy-policy')" style="color: var(--text-secondary); text-decoration: none;">
            🔒 Privacy Policy
          </a>
          <a href="/terms" onclick="event.preventDefault(); window.router.navigate('/terms')" style="color: var(--text-secondary); text-decoration: none;">
            📜 Terms of Service
          </a>
        </div>
        <p style="color: var(--text-tertiary); margin-top: var(--space-4); font-size: var(--text-sm);">
          © 2026 FinSuite OS. Made with ❤️ in India.
        </p>
      </div>
    </div>
  `;

  return container;
}
