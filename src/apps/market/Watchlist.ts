/**
 * FinSuite OS - Watchlist
 */
import { kvStore } from '@/core/puter';
import { getTopCryptos } from '@/services/market';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">👀 Watchlist</h1>
      <p class="page-subtitle">Your saved favorites (synced to cloud)</p>
    </header>
    <div id="watchlist-content"><div class="skeleton" style="height: 200px;"></div></div>
  `;

  const contentEl = container.querySelector('#watchlist-content') as HTMLElement;

  // Load saved watchlist
  let watchlist: string[] = [];
  try {
    watchlist = (await kvStore.get<string[]>('watchlist')) || [];
  } catch {
    watchlist = [];
  }

  // Load crypto data
  let allCryptos: Awaited<ReturnType<typeof getTopCryptos>> = [];
  try {
    allCryptos = await getTopCryptos(100, 'inr');
  } catch {
    allCryptos = [];
  }

  async function renderWatchlist(): Promise<void> {
    const watchedCryptos = allCryptos.filter((c) => watchlist.includes(c.id));

    if (watchedCryptos.length === 0) {
      contentEl.innerHTML = `
        <div class="glass-card" style="padding: var(--space-8); text-align: center;">
          <div style="font-size: 48px; margin-bottom: var(--space-4);">📭</div>
          <h3 style="margin-bottom: var(--space-2);">No items in watchlist</h3>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">Add cryptocurrencies from the list below</p>
        </div>
      `;
    } else {
      contentEl.innerHTML = `
        <div class="grid grid--auto gap-4 mb-6">
          ${watchedCryptos.map((c) => `
            <div class="glass-card" style="padding: var(--space-4);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                  <img src="${c.image}" alt="${c.name}" style="width: 32px; height: 32px; border-radius: 50%;">
                  <div>
                    <div style="font-weight: 600;">${c.name}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">${c.symbol}</div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-family: var(--font-mono);">₹${c.current_price.toLocaleString('en-IN')}</div>
                  <div style="font-size: var(--text-sm); color: ${c.price_change_percentage_24h >= 0 ? 'var(--accent-growth)' : 'var(--accent-cost)'};">
                    ${c.price_change_percentage_24h >= 0 ? '▲' : '▼'} ${Math.abs(c.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>
              </div>
              <button class="btn btn--ghost btn--sm mt-3" data-remove="${c.id}" style="width: 100%;">Remove</button>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Add coins section
    const addSection = document.createElement('div');
    addSection.className = 'glass-card';
    addSection.style.padding = 'var(--space-6)';
    addSection.innerHTML = `
      <h3 style="margin-bottom: var(--space-4);">Add to Watchlist</h3>
      <div class="grid grid--auto gap-2" style="max-height: 300px; overflow-y: auto;">
        ${allCryptos.filter((c) => !watchlist.includes(c.id)).slice(0, 20).map((c) => `
          <button class="btn btn--secondary btn--sm" data-add="${c.id}" style="justify-content: flex-start; gap: var(--space-2);">
            <img src="${c.image}" alt="${c.name}" style="width: 16px; height: 16px; border-radius: 50%;">
            ${c.name}
          </button>
        `).join('')}
      </div>
    `;
    contentEl.appendChild(addSection);

    // Event handlers
    contentEl.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = (btn as HTMLElement).dataset.add!;
        if (!watchlist.includes(id)) {
          watchlist.push(id);
          await kvStore.set('watchlist', watchlist);
          window.showToast?.('Added to watchlist', 'success');
          renderWatchlist();
        }
      });
    });

    contentEl.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = (btn as HTMLElement).dataset.remove!;
        watchlist = watchlist.filter((w) => w !== id);
        await kvStore.set('watchlist', watchlist);
        window.showToast?.('Removed from watchlist', 'info');
        renderWatchlist();
      });
    });
  }

  await renderWatchlist();
  return container;
}
