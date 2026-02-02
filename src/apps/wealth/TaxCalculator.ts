/**
 * FinSuite OS - Tax Calculator (New vs Old Regime)
 */
import { createSmartInput } from '@/components/ui/SmartInput';
import { formatCurrency } from '@/core/math';

interface TaxResult { taxable: number; tax: number; cess: number; total: number; effectiveRate: number; }

function calcOldRegime(income: number, ded80C: number, ded80D: number, nps: number, hra: number): TaxResult {
  const std = 50000;
  const taxable = Math.max(0, income - std - ded80C - ded80D - nps - hra);
  let tax = 0;
  if (taxable > 1500000) tax = 187500 + (taxable - 1500000) * 0.3;
  else if (taxable > 1250000) tax = 125000 + (taxable - 1250000) * 0.25;
  else if (taxable > 1000000) tax = 100000 + (taxable - 1000000) * 0.3;
  else if (taxable > 500000) tax = (taxable - 500000) * 0.2;
  else if (taxable > 250000) tax = (taxable - 250000) * 0.05;
  const cess = tax * 0.04;
  return { taxable, tax, cess, total: tax + cess, effectiveRate: (tax + cess) / income * 100 };
}

function calcNewRegime(income: number): TaxResult {
  const std = 75000;
  const taxable = Math.max(0, income - std);
  let tax = 0;
  const slabs = [[300000, 0], [400000, 0.05], [700000, 0.1], [1000000, 0.15], [1200000, 0.2], [1500000, 0.25]];
  let remaining = taxable;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (remaining <= 0) break;
    const chunk = Math.min(remaining, (limit as number) - prev);
    tax += chunk * (rate as number);
    remaining -= chunk;
    prev = limit as number;
  }
  if (remaining > 0) tax += remaining * 0.3;
  // Rebate u/s 87A
  if (taxable <= 700000) tax = 0;
  const cess = tax * 0.04;
  return { taxable, tax, cess, total: tax + cess, effectiveRate: (tax + cess) / income * 100 };
}

export function render(): HTMLElement {
  const state = { income: 1500000, ded80C: 150000, ded80D: 25000, nps: 50000, hra: 0 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">🧾 Income Tax Calculator</h1><p class="page-subtitle">Compare Old vs New Regime (FY 2024-25)</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    const oldTax = calcOldRegime(state.income, state.ded80C, state.ded80D, state.nps, state.hra);
    const newTax = calcNewRegime(state.income);
    const better = newTax.total < oldTax.total ? 'New' : 'Old';
    const savings = Math.abs(newTax.total - oldTax.total);

    results.innerHTML = `
      <div class="glass-card" style="padding: var(--space-5); margin-bottom: var(--space-4); background: linear-gradient(135deg, rgba(52, 199, 89, 0.1), rgba(0, 212, 255, 0.1)); border-color: var(--accent-growth);">
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">Recommended Regime</div>
        <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--accent-growth);">${better} Regime</div>
        <div style="font-size: var(--text-sm); color: var(--text-tertiary);">Save ${formatCurrency(savings)}</div>
      </div>
      <div class="grid grid--2 mb-4">
        <div class="glass-card" style="padding: var(--space-4);">
          <div style="font-weight: 600; margin-bottom: var(--space-3);">Old Regime</div>
          <div style="font-size: var(--text-xl); font-family: var(--font-mono); color: var(--accent-cost);">${formatCurrency(oldTax.total)}</div>
          <div style="font-size: var(--text-xs); color: var(--text-tertiary);">Effective: ${oldTax.effectiveRate.toFixed(1)}%</div>
        </div>
        <div class="glass-card" style="padding: var(--space-4);">
          <div style="font-weight: 600; margin-bottom: var(--space-3);">New Regime</div>
          <div style="font-size: var(--text-xl); font-family: var(--font-mono); color: var(--accent-primary);">${formatCurrency(newTax.total)}</div>
          <div style="font-size: var(--text-xs); color: var(--text-tertiary);">Effective: ${newTax.effectiveRate.toFixed(1)}%</div>
        </div>
      </div>
    `;
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Income & Deductions</h3>';
  inputs.appendChild(createSmartInput({ id: 'income', label: 'Annual Income', min: 100000, max: 50000000, value: state.income, step: 50000, prefix: '₹', currency: true, onChange: (v) => { state.income = v; update(); } }));

  const note = document.createElement('div');
  note.style.cssText = 'margin-top: var(--space-6); font-size: var(--text-sm); color: var(--text-tertiary);';
  note.textContent = 'Deductions only apply to Old Regime:';
  inputs.appendChild(note);

  const d1 = document.createElement('div'); d1.style.marginTop = 'var(--space-4)';
  d1.appendChild(createSmartInput({ id: '80c', label: '80C (PPF, ELSS, etc.)', min: 0, max: 150000, value: state.ded80C, step: 10000, prefix: '₹', currency: true, onChange: (v) => { state.ded80C = v; update(); } }));
  inputs.appendChild(d1);

  const d2 = document.createElement('div'); d2.style.marginTop = 'var(--space-4)';
  d2.appendChild(createSmartInput({ id: '80d', label: '80D (Health Insurance)', min: 0, max: 100000, value: state.ded80D, step: 5000, prefix: '₹', currency: true, onChange: (v) => { state.ded80D = v; update(); } }));
  inputs.appendChild(d2);

  const d3 = document.createElement('div'); d3.style.marginTop = 'var(--space-4)';
  d3.appendChild(createSmartInput({ id: 'nps', label: '80CCD(1B) NPS', min: 0, max: 50000, value: state.nps, step: 5000, prefix: '₹', currency: true, onChange: (v) => { state.nps = v; update(); } }));
  inputs.appendChild(d3);

  update();
  return container;
}
