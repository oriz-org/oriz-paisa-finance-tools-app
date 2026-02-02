/**
 * FinSuite OS - Goal Planner
 */
import { calculateGoal, formatCurrency } from '@/core/math';
import { createSmartInput, createResultCard } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { goal: 1000000, years: 5, rate: 12, inflation: 6 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">🎯 Goal Planner</h1><p class="page-subtitle">How much to save for your goal?</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    const result = calculateGoal(state.goal, state.years, state.rate, state.inflation);
    results.innerHTML = '';
    const stats = document.createElement('div'); stats.className = 'stats-grid';
    stats.appendChild(createResultCard({ label: 'Inflation Adjusted Goal', value: formatCurrency(result.inflationAdjustedGoal), subtext: 'Future value of your goal' }));
    stats.appendChild(createResultCard({ label: 'Required Monthly SIP', value: formatCurrency(result.requiredMonthlySIP), accent: true }));
    stats.appendChild(createResultCard({ label: 'Or Lumpsum Today', value: formatCurrency(result.requiredLumpsum) }));
    results.appendChild(stats);
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Your Goal</h3>';
  inputs.appendChild(createSmartInput({ id: 'goal', label: 'Goal Amount (Today)', min: 10000, max: 100000000, value: state.goal, step: 50000, prefix: '₹', currency: true, onChange: (v) => { state.goal = v; update(); } }));
  const y = document.createElement('div'); y.style.marginTop = 'var(--space-6)';
  y.appendChild(createSmartInput({ id: 'years', label: 'Time to Goal', min: 1, max: 30, value: state.years, suffix: ' years', onChange: (v) => { state.years = v; update(); } }));
  inputs.appendChild(y);
  const r = document.createElement('div'); r.style.marginTop = 'var(--space-6)';
  r.appendChild(createSmartInput({ id: 'rate', label: 'Expected Return', min: 1, max: 25, value: state.rate, step: 0.5, suffix: '%', onChange: (v) => { state.rate = v; update(); } }));
  inputs.appendChild(r);
  const i = document.createElement('div'); i.style.marginTop = 'var(--space-6)';
  i.appendChild(createSmartInput({ id: 'inf', label: 'Inflation Rate', min: 0, max: 15, value: state.inflation, step: 0.5, suffix: '%', onChange: (v) => { state.inflation = v; update(); } }));
  inputs.appendChild(i);
  update();
  return container;
}
