/**
 * FinSuite OS - Speed Test
 */
import { runSpeedTest } from '@/services/utility';

export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">⚡ Speed Test</h1>
      <p class="page-subtitle">Test your internet connection</p>
    </header>
    <div class="glass-card" style="padding: var(--space-8); text-align: center;" id="speed-test">
      <div style="font-size: 64px; margin-bottom: var(--space-6);">🌐</div>
      <button class="btn btn--primary btn--lg" id="start-test">Start Speed Test</button>
    </div>
  `;

  const testEl = container.querySelector('#speed-test') as HTMLElement;
  const startBtn = container.querySelector('#start-test') as HTMLButtonElement;

  startBtn.addEventListener('click', async () => {
    testEl.innerHTML = `
      <div class="spinner" style="margin: 0 auto var(--space-6);"></div>
      <div style="color: var(--text-secondary);">Testing your connection...</div>
    `;

    try {
      const result = await runSpeedTest();

      testEl.innerHTML = `
        <div class="stats-grid mb-6">
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--gradient-success);">⬇️</div>
            <div class="stat-value" style="color: var(--accent-growth);">${result.downloadMbps}</div>
            <div class="stat-label">Download (Mbps)</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--gradient-accent);">⬆️</div>
            <div class="stat-value" style="color: var(--accent-primary);">${result.uploadMbps}</div>
            <div class="stat-label">Upload (Mbps)</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">📶</div>
            <div class="stat-value">${result.pingMs}</div>
            <div class="stat-label">Ping (ms)</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #7c3aed, #6d28d9);">📊</div>
            <div class="stat-value">${result.jitterMs}</div>
            <div class="stat-label">Jitter (ms)</div>
          </div>
        </div>
        <button class="btn btn--secondary" id="retest">🔄 Test Again</button>
      `;

      testEl.querySelector('#retest')?.addEventListener('click', () => {
        location.reload();
      });
    } catch {
      testEl.innerHTML = `
        <div style="color: var(--accent-cost); margin-bottom: var(--space-4);">Test failed</div>
        <button class="btn btn--primary" onclick="location.reload()">Try Again</button>
      `;
    }
  });

  return container;
}
