/**
 * FinSuite OS - Lumpsum Calculator
 */

import { calculateLumpsum, formatCurrency, formatIndianNumber } from '@/core/math';
import { askAI } from '@/core/puter';
import { SmartChart } from '@/components/charts/SmartChart';
import {
  createSmartInput,
  createResultCard,
  createAIInsight,
  updateAIInsight,
} from '@/components/ui/SmartInput';

interface State {
  principal: number;
  rate: number;
  years: number;
}

export function render(): HTMLElement {
  const state: State = {
    principal: 100000,
    rate: 12,
    years: 10,
  };

  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">💰 Lumpsum Calculator</h1>
      <p class="page-subtitle">Calculate one-time investment returns</p>
    </header>

    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;

  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;
  let chart: SmartChart | null = null;

  function update(): void {
    const result = calculateLumpsum(state.principal, state.rate, state.years);

    results.innerHTML = '';

    const stats = document.createElement('div');
    stats.className = 'stats-grid mb-6';
    stats.appendChild(createResultCard({ label: 'Principal Amount', value: formatCurrency(state.principal) }));
    stats.appendChild(createResultCard({ label: 'Total Value', value: formatCurrency(result.totalValue), accent: true }));
    stats.appendChild(createResultCard({ label: 'Wealth Gained', value: formatCurrency(result.wealthGained), subtext: `${((result.wealthGained / state.principal) * 100).toFixed(1)}% returns` }));
    results.appendChild(stats);

    const chartBox = document.createElement('div');
    chartBox.className = 'chart-container mb-6';
    const canvas = document.createElement('canvas');
    chartBox.appendChild(canvas);
    results.appendChild(chartBox);

    if (chart) chart.destroy();
    chart = new SmartChart(canvas);
    chart.render({
      type: 'area',
      labels: result.yearlyBreakdown.map((y) => `Year ${y.year}`),
      datasets: [
        { label: 'Value', data: result.yearlyBreakdown.map((y) => y.value), type: 'growth', fill: true },
        { label: 'Principal', data: result.yearlyBreakdown.map(() => state.principal), type: 'neutral', fill: false },
      ],
    });

    const aiBox = createAIInsight('', true);
    results.appendChild(aiBox);
    askAI(`I invested ₹${formatIndianNumber(state.principal)} as lumpsum for ${state.years} years at ${state.rate}%. It will grow to ₹${formatIndianNumber(result.totalValue)}. Give 2 short insights.`, 'advisor')
      .then((insight) => updateAIInsight(aiBox, insight))
      .catch(() => updateAIInsight(aiBox, 'AI unavailable'));
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Investment Parameters</h3>';
  inputs.appendChild(createSmartInput({ id: 'principal', label: 'Investment Amount', min: 10000, max: 10000000, value: state.principal, step: 10000, prefix: '₹', currency: true, onChange: (v) => { state.principal = v; update(); } }));

  const rate = document.createElement('div');
  rate.style.marginTop = 'var(--space-6)';
  rate.appendChild(createSmartInput({ id: 'rate', label: 'Expected Return', min: 1, max: 30, value: state.rate, step: 0.5, suffix: '%', onChange: (v) => { state.rate = v; update(); } }));
  inputs.appendChild(rate);

  const years = document.createElement('div');
  years.style.marginTop = 'var(--space-6)';
  years.appendChild(createSmartInput({ id: 'years', label: 'Investment Period', min: 1, max: 40, value: state.years, suffix: ' years', onChange: (v) => { state.years = v; update(); } }));
  inputs.appendChild(years);

  update();
  return container;
}
