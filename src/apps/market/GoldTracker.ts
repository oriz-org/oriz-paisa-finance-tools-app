/**
 * FinSuite OS - Gold Tracker
 */
import { getGoldPrice } from '@/services/market';
import { createSmartInput } from '@/components/ui/SmartInput';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🥇 Gold Tracker</h1>
      <p class="page-subtitle">Current Gold Prices & Calculator</p>
    </header>
    <div id="gold-content"><div class="skeleton" style="height: 300px;"></div></div>
  `;

  const contentEl = container.querySelector('#gold-content') as HTMLElement;

  try {
    const goldPrice = await getGoldPrice();
    const state = { grams: 10 };

    function renderContent(): void {
      contentEl.innerHTML = `
        <div class="stats-grid mb-6">
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #FFD700, #B8860B);">🥇</div>
            <div class="stat-value" style="color: var(--accent-gold);">₹${goldPrice.price_per_gram.toLocaleString('en-IN')}</div>
            <div class="stat-label">Per Gram (24K)</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #FFD700, #B8860B);">⚖️</div>
            <div class="stat-value" style="color: var(--accent-gold);">₹${goldPrice.price_per_10g.toLocaleString('en-IN')}</div>
            <div class="stat-label">Per 10 Grams</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #FFD700, #B8860B);">🪙</div>
            <div class="stat-value" style="color: var(--accent-gold);">₹${goldPrice.price_per_oz.toLocaleString('en-IN')}</div>
            <div class="stat-label">Per Troy Oz</div>
          </div>
        </div>

        <div class="glass-card" style="padding: var(--space-6);" id="calculator"></div>
      `;

      const calcEl = contentEl.querySelector('#calculator') as HTMLElement;
      calcEl.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Gold Value Calculator</h3>';

      const slider = createSmartInput({
        id: 'grams',
        label: 'Gold Weight',
        min: 1,
        max: 1000,
        value: state.grams,
        suffix: ' grams',
        onChange: (v) => {
          state.grams = v;
          updateResult();
        },
      });
      calcEl.appendChild(slider);

      const resultDiv = document.createElement('div');
      resultDiv.id = 'gold-result';
      resultDiv.className = 'mt-6';
      calcEl.appendChild(resultDiv);

      updateResult();
    }

    function updateResult(): void {
      const resultEl = contentEl.querySelector('#gold-result') as HTMLElement;
      const value = state.grams * goldPrice.price_per_gram;
      resultEl.innerHTML = `
        <div class="result-card" style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(184, 134, 11, 0.1));">
          <span class="result-label">Total Value</span>
          <span class="result-value" style="color: var(--accent-gold);">₹${value.toLocaleString('en-IN')}</span>
          <span class="result-subtext">${state.grams}g × ₹${goldPrice.price_per_gram}/g</span>
        </div>
      `;
    }

    renderContent();
  } catch {
    contentEl.innerHTML = '<div class="glass-card" style="padding: var(--space-6); text-align: center;">Failed to load gold prices</div>';
  }

  return container;
}
