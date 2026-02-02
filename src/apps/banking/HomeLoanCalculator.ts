/**
 * FinSuite OS - Home Loan EMI Calculator
 */
import { calculateEMI, formatCurrency, formatIndianNumber } from '@/core/math';
import { askAI } from '@/core/puter';
import { SmartChart } from '@/components/charts/SmartChart';
import { createSmartInput, createResultCard, createAIInsight, updateAIInsight } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { principal: 5000000, rate: 8.5, tenure: 240 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">🏠 Home Loan EMI</h1><p class="page-subtitle">Calculate your home loan EMI & amortization</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;
  let chart: SmartChart | null = null;

  function update(): void {
    const result = calculateEMI(state.principal, state.rate, state.tenure);
    results.innerHTML = '';

    const stats = document.createElement('div'); stats.className = 'stats-grid mb-6';
    stats.appendChild(createResultCard({ label: 'Monthly EMI', value: formatCurrency(result.emi), accent: true }));
    stats.appendChild(createResultCard({ label: 'Total Interest', value: formatCurrency(result.totalInterest), subtext: `${result.interestPercent}% of total` }));
    stats.appendChild(createResultCard({ label: 'Total Payment', value: formatCurrency(result.totalPayment) }));
    results.appendChild(stats);

    // Pie chart for breakdown
    const chartBox = document.createElement('div'); chartBox.className = 'chart-container mb-6';
    const canvas = document.createElement('canvas'); chartBox.appendChild(canvas); results.appendChild(chartBox);
    if (chart) chart.destroy();
    chart = new SmartChart(canvas);
    chart.render({
      type: 'doughnut',
      labels: ['Principal', 'Interest'],
      datasets: [{ label: 'Amount', data: [state.principal, result.totalInterest] }],
      title: 'Principal vs Interest',
    });

    const aiBox = createAIInsight('', true);
    results.appendChild(aiBox);
    askAI(`Home loan: ₹${formatIndianNumber(state.principal)} at ${state.rate}% for ${state.tenure / 12} years. EMI: ₹${formatIndianNumber(result.emi)}. Interest: ₹${formatIndianNumber(result.totalInterest)}. Suggest prepayment strategy.`, 'strategist')
      .then((i) => updateAIInsight(aiBox, i)).catch(() => updateAIInsight(aiBox, 'AI unavailable'));
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Loan Details</h3>';
  inputs.appendChild(createSmartInput({ id: 'prin', label: 'Loan Amount', min: 100000, max: 100000000, value: state.principal, step: 100000, prefix: '₹', currency: true, onChange: (v) => { state.principal = v; update(); } }));
  const r = document.createElement('div'); r.style.marginTop = 'var(--space-6)';
  r.appendChild(createSmartInput({ id: 'rate', label: 'Interest Rate', min: 5, max: 20, value: state.rate, step: 0.1, suffix: '%', onChange: (v) => { state.rate = v; update(); } }));
  inputs.appendChild(r);
  const t = document.createElement('div'); t.style.marginTop = 'var(--space-6)';
  t.appendChild(createSmartInput({ id: 'tenure', label: 'Tenure (Months)', min: 12, max: 360, value: state.tenure, step: 12, suffix: ` mo (${state.tenure / 12} yrs)`, onChange: (v) => { state.tenure = v; update(); } }));
  inputs.appendChild(t);
  update();
  return container;
}
