/**
 * FinSuite OS - Crypto News
 */
import { getCryptoNews } from '@/services/news';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🪙 Crypto News</h1>
      <p class="page-subtitle">Trending cryptocurrencies and market updates</p>
    </header>
    <div id="crypto-news"><div class="skeleton" style="height: 300px;"></div></div>
  `;

  const newsEl = container.querySelector('#crypto-news') as HTMLElement;

  try {
    const news = await getCryptoNews();
    newsEl.innerHTML = news.length > 0 ? `
      <div class="grid grid--auto gap-4">
        ${news.map((n) => `
          <a href="${n.url}" target="_blank" class="glass-card" style="padding: var(--space-5); text-decoration: none;">
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-2);">${n.title}</div>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-3);">${n.description}</p>
            <div style="font-size: var(--text-xs); color: var(--accent-primary);">${n.source}</div>
          </a>
        `).join('')}
      </div>
    ` : '<p style="color: var(--text-secondary); text-align: center;">No crypto news available</p>';
  } catch {
    newsEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Failed to load crypto news</div>';
  }

  return container;
}
