/**
 * FinSuite OS - PPF Calculator
 */
import { calculatePPF, formatCurrency } from '@/core/math';
import { SmartChart } from '@/components/charts/SmartChart';
import { createSmartInput, createResultCard } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { yearly: 150000, rate: 7.1, years: 15 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">🏛️ PPF Calculator</h1><p class="page-subtitle">Public Provident Fund (15-year scheme)</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;
  let chart: SmartChart | null = null;

  function update(): void {
    const result = calculatePPF(state.yearly, state.rate, state.years);
    results.innerHTML = '';
    const stats = document.createElement('div'); stats.className = 'stats-grid mb-6';
    stats.appendChild(createResultCard({ label: 'Maturity Amount', value: formatCurrency(result.maturityAmount), accent: true }));
    stats.appendChild(createResultCard({ label: 'Total Deposit', value: formatCurrency(result.totalDeposit) }));
    stats.appendChild(createResultCard({ label: 'Interest Earned', value: formatCurrency(result.totalInterest) }));
    results.appendChild(stats);

    const chartBox = document.createElement('div'); chartBox.className = 'chart-container';
    const canvas = document.createElement('canvas'); chartBox.appendChild(canvas); results.appendChild(chartBox);
    if (chart) chart.destroy();
    chart = new SmartChart(canvas);
    chart.render({
      type: 'area',
      labels: result.yearlyBreakdown.map((y) => `Yr ${y.year}`),
      datasets: [{ label: 'Balance', data: result.yearlyBreakdown.map((y) => y.balance), type: 'growth', fill: true }],
    });
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">PPF Details</h3>';
  inputs.appendChild(createSmartInput({ id: 'yearly', label: 'Yearly Investment', min: 500, max: 150000, value: state.yearly, step: 5000, prefix: '₹', currency: true, onChange: (v) => { state.yearly = v; update(); } }));
  const r = document.createElement('div'); r.style.marginTop = 'var(--space-6)';
  r.appendChild(createSmartInput({ id: 'rate', label: 'Interest Rate (Current: 7.1%)', min: 5, max: 10, value: state.rate, step: 0.1, suffix: '%', onChange: (v) => { state.rate = v; update(); } }));
  inputs.appendChild(r);
  const y = document.createElement('div'); y.style.marginTop = 'var(--space-6)';
  y.appendChild(createSmartInput({ id: 'years', label: 'Duration', min: 15, max: 50, value: state.years, suffix: ' years', onChange: (v) => { state.years = v; update(); } }));
  inputs.appendChild(y);
  update();
  return container;
}
