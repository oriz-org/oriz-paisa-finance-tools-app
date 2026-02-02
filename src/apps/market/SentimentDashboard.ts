/**
 * FinSuite OS - Market Sentiment (WSB)
 */
import { getWSBSentiment, type StockSentiment } from '@/services/market';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">📊 Market Sentiment</h1>
      <p class="page-subtitle">WallStreetBets Reddit Trending Stocks</p>
    </header>
    <div id="sentiment-list"><div class="skeleton" style="height: 300px;"></div></div>
  `;

  const listEl = container.querySelector('#sentiment-list') as HTMLElement;

  try {
    const sentiment = await getWSBSentiment();
    listEl.innerHTML = sentiment.length > 0 ? renderSentiment(sentiment) : '<div class="glass-card" style="padding: var(--space-6); text-align: center;">No sentiment data available</div>';
  } catch {
    listEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center; color: var(--text-secondary);">Failed to load sentiment data</div>';
  }

  return container;
}

function renderSentiment(data: StockSentiment[]): string {
  return `
    <div class="grid grid--auto gap-4">
      ${data.slice(0, 20).map((s) => `
        <div class="glass-card" style="padding: var(--space-5);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
            <span style="font-size: var(--text-xl); font-weight: 700; font-family: var(--font-mono);">${s.ticker}</span>
            <span style="
              padding: var(--space-1) var(--space-3);
              border-radius: var(--radius-full);
              font-size: var(--text-xs);
              font-weight: 600;
              background: ${s.sentiment === 'Bullish' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 59, 48, 0.2)'};
              color: ${s.sentiment === 'Bullish' ? 'var(--accent-growth)' : 'var(--accent-cost)'};
            ">${s.sentiment === 'Bullish' ? '🐂' : '🐻'} ${s.sentiment}</span>
          </div>
          <div style="font-size: var(--text-sm); color: var(--text-secondary);">
            ${s.no_of_comments} comments • Score: ${(s.sentiment_score * 100).toFixed(0)}%
          </div>
          <div style="margin-top: var(--space-2); height: 4px; background: var(--glass-bg); border-radius: 2px; overflow: hidden;">
            <div style="
              height: 100%;
              width: ${Math.abs(s.sentiment_score) * 100}%;
              background: ${s.sentiment === 'Bullish' ? 'var(--accent-growth)' : 'var(--accent-cost)'};
            "></div>
          </div>
        </div>
      `).join('')}
    </div>
    <p style="margin-top: var(--space-4); font-size: var(--text-xs); color: var(--text-tertiary); text-align: center;">Data from TradeSentie API (WSB Reddit)</p>
  `;
}
