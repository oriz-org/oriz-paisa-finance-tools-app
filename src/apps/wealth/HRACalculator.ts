/**
 * FinSuite OS - HRA Calculator
 */
import { calculateHRA, formatCurrency } from '@/core/math';
import { createSmartInput, createResultCard, createToggle } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { basic: 50000, hra: 20000, rent: 25000, metro: true };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">🏠 HRA Calculator</h1><p class="page-subtitle">House Rent Allowance exemption</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    const result = calculateHRA(state.basic, state.hra, state.rent, state.metro);
    results.innerHTML = '';
    const stats = document.createElement('div'); stats.className = 'stats-grid';
    stats.appendChild(createResultCard({ label: 'HRA Received', value: formatCurrency(result.hraReceived), subtext: 'Per year' }));
    stats.appendChild(createResultCard({ label: 'Exempt HRA', value: formatCurrency(result.exemptHRA), accent: true, subtext: result.method }));
    stats.appendChild(createResultCard({ label: 'Taxable HRA', value: formatCurrency(result.taxableHRA) }));
    results.appendChild(stats);
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Salary Components</h3>';
  inputs.appendChild(createSmartInput({ id: 'basic', label: 'Basic Salary (Monthly)', min: 10000, max: 500000, value: state.basic, step: 5000, prefix: '₹', currency: true, onChange: (v) => { state.basic = v; update(); } }));
  const h = document.createElement('div'); h.style.marginTop = 'var(--space-6)';
  h.appendChild(createSmartInput({ id: 'hra', label: 'HRA Received (Monthly)', min: 0, max: 200000, value: state.hra, step: 1000, prefix: '₹', currency: true, onChange: (v) => { state.hra = v; update(); } }));
  inputs.appendChild(h);
  const r = document.createElement('div'); r.style.marginTop = 'var(--space-6)';
  r.appendChild(createSmartInput({ id: 'rent', label: 'Rent Paid (Monthly)', min: 0, max: 200000, value: state.rent, step: 1000, prefix: '₹', currency: true, onChange: (v) => { state.rent = v; update(); } }));
  inputs.appendChild(r);
  const m = document.createElement('div'); m.style.marginTop = 'var(--space-6)';
  m.appendChild(createToggle({ id: 'metro', label: 'Metro City (Delhi, Mumbai, Chennai, Kolkata)', checked: state.metro, onChange: (v) => { state.metro = v; update(); } }));
  inputs.appendChild(m);
  update();
  return container;
}
