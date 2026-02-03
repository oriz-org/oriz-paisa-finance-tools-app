/**
 * FinSuite OS - Step-Up SIP Calculator
 */

import { calculateStepUpSIP, formatCurrency, formatIndianNumber } from '@/core/math';
import { askAI } from '@/core/puter';
import { SmartChart } from '@/components/charts/SmartChart';
import { createSmartInput, createResultCard, createAIInsight, updateAIInsight } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { monthly: 10000, stepUp: 10, rate: 12, years: 10 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">📊 Step-Up SIP Calculator</h1>
      <p class="page-subtitle">SIP with annual contribution increase</p>
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
    const result = calculateStepUpSIP(state.monthly, state.stepUp, state.rate, state.years);
    results.innerHTML = '';

    const stats = document.createElement('div');
    stats.className = 'stats-grid mb-6';
    stats.appendChild(createResultCard({ label: 'Total Invested', value: formatCurrency(result.investedAmount) }));
    stats.appendChild(createResultCard({ label: 'Expected Value', value: formatCurrency(result.totalValue), accent: true }));
    stats.appendChild(createResultCard({ label: 'Wealth Gained', value: formatCurrency(result.wealthGained) }));
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
      labels: result.yearlyBreakdown.map((y) => `Yr ${y.year}`),
      datasets: [
        { label: 'Value', data: result.yearlyBreakdown.map((y) => y.value), type: 'growth', fill: true },
        { label: 'Invested', data: result.yearlyBreakdown.map((y) => y.invested), type: 'neutral', fill: true },
      ],
    });

    const aiBox = createAIInsight('', true);
    results.appendChild(aiBox);
    askAI(`Step-up SIP: ₹${formatIndianNumber(state.monthly)}/month with ${state.stepUp}% annual increase for ${state.years} years at ${state.rate}%. Total: ₹${formatIndianNumber(result.totalValue)}. 2 insights.`, 'advisor')
      .then((i) => updateAIInsight(aiBox, i)).catch(() => updateAIInsight(aiBox, 'AI unavailable'));
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Parameters</h3>';
  inputs.appendChild(createSmartInput({ id: 'monthly', label: 'Starting Monthly SIP', min: 500, max: 100000, value: state.monthly, step: 500, prefix: '₹', currency: true, onChange: (v) => { state.monthly = v; update(); } }));

  const step = document.createElement('div'); step.style.marginTop = 'var(--space-6)';
  step.appendChild(createSmartInput({ id: 'stepup', label: 'Annual Step-Up', min: 0, max: 50, value: state.stepUp, suffix: '%', onChange: (v) => { state.stepUp = v; update(); } }));
  inputs.appendChild(step);

  const rate = document.createElement('div'); rate.style.marginTop = 'var(--space-6)';
  rate.appendChild(createSmartInput({ id: 'rate', label: 'Expected Return', min: 1, max: 100, value: state.rate, step: 0.5, suffix: '%', onChange: (v) => { state.rate = v; update(); } }));
  inputs.appendChild(rate);

  const years = document.createElement('div'); years.style.marginTop = 'var(--space-6)';
  years.appendChild(createSmartInput({ id: 'years', label: 'Period', min: 1, max: 40, value: state.years, suffix: ' years', onChange: (v) => { state.years = v; update(); } }));
  inputs.appendChild(years);

  update();
  return container;
}
