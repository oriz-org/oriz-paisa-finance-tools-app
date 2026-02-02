/**
 * FinSuite OS - SWP Calculator
 */
import { calculateSWP, formatCurrency } from '@/core/math';
import { SmartChart } from '@/components/charts/SmartChart';
import { createSmartInput, createResultCard } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { corpus: 5000000, withdrawal: 30000, rate: 8 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">💸 SWP Calculator</h1><p class="page-subtitle">Systematic Withdrawal Plan</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;
  let chart: SmartChart | null = null;

  function update(): void {
    const result = calculateSWP(state.corpus, state.withdrawal, state.rate);
    results.innerHTML = '';
    const stats = document.createElement('div'); stats.className = 'stats-grid mb-6';
    stats.appendChild(createResultCard({ label: 'Duration', value: `${Math.floor(result.durationMonths / 12)} yrs ${result.durationMonths % 12} mo`, accent: true }));
    stats.appendChild(createResultCard({ label: 'Total Withdrawn', value: formatCurrency(result.totalWithdrawals) }));
    stats.appendChild(createResultCard({ label: 'Final Balance', value: formatCurrency(result.finalBalance) }));
    results.appendChild(stats);

    const chartBox = document.createElement('div'); chartBox.className = 'chart-container mb-6';
    const canvas = document.createElement('canvas'); chartBox.appendChild(canvas); results.appendChild(chartBox);
    if (chart) chart.destroy();
    chart = new SmartChart(canvas);
    const monthly = result.monthlyBreakdown.filter((_, i) => i % 12 === 0);
    chart.render({
      type: 'area',
      labels: monthly.map((m) => `Yr ${Math.floor(m.month / 12)}`),
      datasets: [{ label: 'Balance', data: monthly.map((m) => m.balance), type: 'growth', fill: true }],
    });
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">SWP Details</h3>';
  inputs.appendChild(createSmartInput({ id: 'corp', label: 'Investment Corpus', min: 100000, max: 100000000, value: state.corpus, step: 100000, prefix: '₹', currency: true, onChange: (v) => { state.corpus = v; update(); } }));
  const w = document.createElement('div'); w.style.marginTop = 'var(--space-6)';
  w.appendChild(createSmartInput({ id: 'with', label: 'Monthly Withdrawal', min: 1000, max: 500000, value: state.withdrawal, step: 1000, prefix: '₹', currency: true, onChange: (v) => { state.withdrawal = v; update(); } }));
  inputs.appendChild(w);
  const r = document.createElement('div'); r.style.marginTop = 'var(--space-6)';
  r.appendChild(createSmartInput({ id: 'rate', label: 'Expected Return', min: 1, max: 20, value: state.rate, step: 0.5, suffix: '%', onChange: (v) => { state.rate = v; update(); } }));
  inputs.appendChild(r);
  update();
  return container;
}
