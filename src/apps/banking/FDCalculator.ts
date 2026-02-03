/**
 * FinSuite OS - FD Calculator
 */
import { calculateFD, formatCurrency } from '@/core/math';
import { createSmartInput, createResultCard, createSelect } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { principal: 100000, rate: 7, tenure: 12, freq: 4 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">🏦 FD Calculator</h1><p class="page-subtitle">Fixed Deposit maturity amount</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    const result = calculateFD(state.principal, state.rate, state.tenure, state.freq);
    results.innerHTML = '';
    const stats = document.createElement('div'); stats.className = 'stats-grid';
    stats.appendChild(createResultCard({ label: 'Maturity Amount', value: formatCurrency(result.maturityAmount), accent: true }));
    stats.appendChild(createResultCard({ label: 'Interest Earned', value: formatCurrency(result.totalInterest) }));
    stats.appendChild(createResultCard({ label: 'Effective Yield', value: `${result.effectiveYield}% p.a.` }));
    results.appendChild(stats);
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">FD Details</h3>';
  inputs.appendChild(createSmartInput({ id: 'prin', label: 'Deposit Amount', min: 1000, max: 10000000, value: state.principal, step: 10000, prefix: '₹', currency: true, onChange: (v) => { state.principal = v; update(); } }));
  const r = document.createElement('div'); r.style.marginTop = 'var(--space-6)';
  r.appendChild(createSmartInput({ id: 'rate', label: 'Interest Rate', min: 1, max: 50, value: state.rate, step: 0.1, suffix: '%', onChange: (v) => { state.rate = v; update(); } }));
  inputs.appendChild(r);
  const t = document.createElement('div'); t.style.marginTop = 'var(--space-6)';
  t.appendChild(createSmartInput({ id: 'tenure', label: 'Tenure (Months)', min: 1, max: 120, value: state.tenure, onChange: (v) => { state.tenure = v; update(); } }));
  inputs.appendChild(t);
  const f = document.createElement('div'); f.style.marginTop = 'var(--space-6)';
  f.appendChild(createSelect({ id: 'freq', label: 'Compounding Frequency', value: String(state.freq), options: [
    { value: '1', label: 'Yearly' }, { value: '2', label: 'Half-Yearly' }, { value: '4', label: 'Quarterly' }, { value: '12', label: 'Monthly' }
  ], onChange: (v) => { state.freq = parseInt(v); update(); } }));
  inputs.appendChild(f);
  update();
  return container;
}
