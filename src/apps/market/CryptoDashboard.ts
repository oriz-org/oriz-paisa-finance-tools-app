/**
 * FinSuite OS - Crypto Dashboard
 */
import { getTopCryptos, type CryptoPrice } from '@/services/market';


export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">₿ Crypto Dashboard</h1>
      <p class="page-subtitle">Live Top 50 Cryptocurrencies by Market Cap</p>
    </header>
    <div id="crypto-list"><div class="skeleton" style="height: 400px;"></div></div>
  `;

  const listEl = container.querySelector('#crypto-list') as HTMLElement;

  try {
    const cryptos = await getTopCryptos(50, 'inr');
    listEl.innerHTML = renderCryptoList(cryptos);
  } catch {
    listEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center; color: var(--text-secondary);">Failed to load crypto data</div>';
  }

  return container;
}

function renderCryptoList(cryptos: CryptoPrice[]): string {
  return `
    <div class="glass-card" style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm);">
        <thead>
          <tr style="border-bottom: 1px solid var(--glass-border);">
            <th style="padding: var(--space-3); text-align: left;">#</th>
            <th style="padding: var(--space-3); text-align: left;">Coin</th>
            <th style="padding: var(--space-3); text-align: right;">Price</th>
            <th style="padding: var(--space-3); text-align: right;">24h %</th>
            <th style="padding: var(--space-3); text-align: right;">Market Cap</th>
            <th style="padding: var(--space-3); text-align: right;">Volume</th>
          </tr>
        </thead>
        <tbody>
          ${cryptos.map((c) => `
            <tr style="border-bottom: 1px solid var(--glass-border);">
              <td style="padding: var(--space-3);">${c.market_cap_rank}</td>
              <td style="padding: var(--space-3);">
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                  <img src="${c.image}" alt="${c.name}" style="width: 24px; height: 24px; border-radius: 50%;">
                  <span style="font-weight: 600;">${c.name}</span>
                  <span style="color: var(--text-tertiary); text-transform: uppercase;">${c.symbol}</span>
                </div>
              </td>
              <td style="padding: var(--space-3); text-align: right; font-family: var(--font-mono);">₹${c.current_price.toLocaleString('en-IN')}</td>
              <td style="padding: var(--space-3); text-align: right; font-family: var(--font-mono); color: ${c.price_change_percentage_24h >= 0 ? 'var(--accent-growth)' : 'var(--accent-cost)'};">
                ${c.price_change_percentage_24h >= 0 ? '▲' : '▼'} ${Math.abs(c.price_change_percentage_24h).toFixed(2)}%
              </td>
              <td style="padding: var(--space-3); text-align: right; font-family: var(--font-mono);">₹${formatLargeNumber(c.market_cap)}</td>
              <td style="padding: var(--space-3); text-align: right; font-family: var(--font-mono);">₹${formatLargeNumber(c.total_volume)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <p style="margin-top: var(--space-4); font-size: var(--text-xs); color: var(--text-tertiary); text-align: center;">Data from CoinGecko API • Prices in INR</p>
  `;
}

function formatLargeNumber(num: number): string {
  if (num >= 10000000000000) return `${(num / 10000000000000).toFixed(1)}T`;
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  return num.toLocaleString('en-IN');
}
