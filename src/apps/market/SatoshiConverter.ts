/**
 * FinSuite OS - Satoshi Converter
 */
import { getBitcoinPrice } from '@/services/market';
import { createSmartInput, createResultCard } from '@/components/ui/SmartInput';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">⚡ Satoshi Converter</h1>
      <p class="page-subtitle">Convert between Fiat and Satoshis</p>
    </header>
    <div class="calculator-layout">
      <div class="glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div id="results"></div>
    </div>
  `;

  const inputsEl = container.querySelector('#inputs') as HTMLElement;
  const resultsEl = container.querySelector('#results') as HTMLElement;

  let btcPrice = 0;
  try {
    btcPrice = await getBitcoinPrice('inr');
  } catch {
    btcPrice = 8500000; // Fallback
  }

  const state = { inr: 10000 };
  const SATS_PER_BTC = 100000000;

  function update(): void {
    const btc = state.inr / btcPrice;
    const sats = btc * SATS_PER_BTC;

    resultsEl.innerHTML = '';
    const stats = document.createElement('div');
    stats.className = 'stats-grid';
    stats.appendChild(createResultCard({ label: 'Bitcoin (BTC)', value: btc.toFixed(8) }));
    stats.appendChild(
      createResultCard({
        label: 'Satoshis (sats)',
        value: Math.round(sats).toLocaleString('en-IN'),
        accent: true,
      })
    );
    stats.appendChild(
      createResultCard({
        label: 'Current BTC Price',
        value: `₹${btcPrice.toLocaleString('en-IN')}`,
      })
    );
    resultsEl.appendChild(stats);

    const info = document.createElement('div');
    info.className = 'glass-card mt-6';
    info.style.padding = 'var(--space-4)';
    info.innerHTML = `
      <div style="font-size: var(--text-sm); color: var(--text-secondary);">
        <strong>Quick Reference:</strong><br>
        1 BTC = 100,000,000 sats<br>
        1 sat = ${(btcPrice / SATS_PER_BTC).toFixed(6)} INR
      </div>
    `;
    resultsEl.appendChild(info);
  }

  inputsEl.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Enter Amount</h3>';
  inputsEl.appendChild(
    createSmartInput({
      id: 'inr',
      label: 'Amount in INR',
      min: 100,
      max: 10000000,
      value: state.inr,
      step: 1000,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.inr = v;
        update();
      },
    })
  );

  update();
  return container;
}
