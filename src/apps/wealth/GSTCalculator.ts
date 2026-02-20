/**
 * FinSuite OS - GST Calculator
 */
import { calculateGST, formatCurrency } from '@/core/math';
import {
  createSmartInput,
  createResultCard,
  createToggle,
  createSelect,
} from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { amount: 10000, rate: 18, inclusive: false };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">🏛️ GST Calculator</h1><p class="page-subtitle">Goods & Services Tax</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    const result = calculateGST(state.amount, state.rate, state.inclusive);
    results.innerHTML = '';
    const stats = document.createElement('div');
    stats.className = 'stats-grid';
    stats.appendChild(
      createResultCard({ label: 'Original Amount', value: formatCurrency(result.originalAmount) })
    );
    stats.appendChild(
      createResultCard({
        label: `GST @ ${state.rate}%`,
        value: formatCurrency(result.gstAmount),
        accent: true,
      })
    );
    stats.appendChild(
      createResultCard({ label: 'Total Amount', value: formatCurrency(result.totalAmount) })
    );
    results.appendChild(stats);

    const breakdown = document.createElement('div');
    breakdown.className = 'glass-card mt-6';
    breakdown.style.padding = 'var(--space-4)';
    const cgst = result.gstAmount / 2;
    const sgst = result.gstAmount / 2;
    breakdown.innerHTML = `
      <div style="font-weight: 600; margin-bottom: var(--space-3);">Tax Breakdown</div>
      <div class="flex justify-between mb-2"><span>CGST (${state.rate / 2}%)</span><span class="text-mono">${formatCurrency(cgst)}</span></div>
      <div class="flex justify-between"><span>SGST (${state.rate / 2}%)</span><span class="text-mono">${formatCurrency(sgst)}</span></div>
    `;
    results.appendChild(breakdown);
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">GST Details</h3>';
  inputs.appendChild(
    createSmartInput({
      id: 'amt',
      label: 'Amount',
      min: 100,
      max: 10000000,
      value: state.amount,
      step: 100,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.amount = v;
        update();
      },
    })
  );

  const r = document.createElement('div');
  r.style.marginTop = 'var(--space-6)';
  r.appendChild(
    createSelect({
      id: 'rate',
      label: 'GST Rate',
      value: String(state.rate),
      options: [
        { value: '5', label: '5%' },
        { value: '12', label: '12%' },
        { value: '18', label: '18%' },
        { value: '28', label: '28%' },
      ],
      onChange: (v) => {
        state.rate = parseInt(v);
        update();
      },
    })
  );
  inputs.appendChild(r);

  const t = document.createElement('div');
  t.style.marginTop = 'var(--space-6)';
  t.appendChild(
    createToggle({
      id: 'inc',
      label: 'GST Inclusive (Extract from total)',
      checked: state.inclusive,
      onChange: (v) => {
        state.inclusive = v;
        update();
      },
    })
  );
  inputs.appendChild(t);

  update();
  return container;
}
