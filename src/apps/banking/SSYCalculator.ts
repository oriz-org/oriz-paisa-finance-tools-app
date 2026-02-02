/**
 * FinSuite OS - SSY Calculator
 */
import { calculateSSY, formatCurrency } from '@/core/math';
import { SmartChart } from '@/components/charts/SmartChart';
import { createSmartInput, createResultCard } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { yearly: 150000, rate: 8.2 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">👧 SSY Calculator</h1><p class="page-subtitle">Sukanya Samriddhi Yojana (21-year scheme)</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;
  let chart: SmartChart | null = null;

  function update(): void {
    const result = calculateSSY(state.yearly, state.rate, 15, 21);
    results.innerHTML = '';
    const stats = document.createElement('div'); stats.className = 'stats-grid mb-6';
    stats.appendChild(createResultCard({ label: 'Maturity Amount', value: formatCurrency(result.maturityAmount), accent: true, subtext: 'After 21 years' }));
    stats.appendChild(createResultCard({ label: 'Total Deposit', value: formatCurrency(result.totalDeposit), subtext: '15 years of deposits' }));
    stats.appendChild(createResultCard({ label: 'Interest Earned', value: formatCurrency(result.totalInterest) }));
    results.appendChild(stats);

    const chartBox = document.createElement('div'); chartBox.className = 'chart-container';
    const canvas = document.createElement('canvas'); chartBox.appendChild(canvas); results.appendChild(chartBox);
    if (chart) chart.destroy();
    chart = new SmartChart(canvas);
    chart.render({
      type: 'area',
      labels: result.yearlyBreakdown.map((y) => `Y${y.year}`),
      datasets: [
        { label: 'Balance', data: result.yearlyBreakdown.map((y) => y.balance), type: 'growth', fill: true },
        { label: 'Deposits', data: result.yearlyBreakdown.map((y) => y.deposit), type: 'neutral', fill: false },
      ],
    });
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">SSY Details</h3>';
  inputs.appendChild(createSmartInput({ id: 'yearly', label: 'Yearly Investment', min: 250, max: 150000, value: state.yearly, step: 5000, prefix: '₹', currency: true, onChange: (v) => { state.yearly = v; update(); } }));
  const r = document.createElement('div'); r.style.marginTop = 'var(--space-6)';
  r.appendChild(createSmartInput({ id: 'rate', label: 'Interest Rate (Current: 8.2%)', min: 5, max: 12, value: state.rate, step: 0.1, suffix: '%', onChange: (v) => { state.rate = v; update(); } }));
  inputs.appendChild(r);

  const info = document.createElement('div');
  info.className = 'glass-card mt-6';
  info.style.padding = 'var(--space-4)';
  info.innerHTML = `<div style="font-size: var(--text-sm); color: var(--text-secondary);">
    <strong>SSY Rules:</strong><br>
    • Deposit for 15 years, matures in 21 years<br>
    • Min ₹250/year, Max ₹1.5L/year<br>
    • Tax-free under Section 80C
  </div>`;
  inputs.appendChild(info);

  update();
  return container;
}
