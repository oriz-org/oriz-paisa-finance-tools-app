/**
 * FinSuite OS - RD Calculator
 */
import { calculateRD, formatCurrency } from '@/core/math';
import { createSmartInput, createResultCard } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { monthly: 5000, rate: 7, tenure: 24 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">📅 RD Calculator</h1><p class="page-subtitle">Recurring Deposit maturity</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    const result = calculateRD(state.monthly, state.rate, state.tenure);
    results.innerHTML = '';
    const stats = document.createElement('div');
    stats.className = 'stats-grid';
    stats.appendChild(
      createResultCard({
        label: 'Maturity Amount',
        value: formatCurrency(result.maturityAmount),
        accent: true,
      })
    );
    stats.appendChild(
      createResultCard({ label: 'Total Deposit', value: formatCurrency(result.totalDeposit) })
    );
    stats.appendChild(
      createResultCard({ label: 'Interest Earned', value: formatCurrency(result.totalInterest) })
    );
    results.appendChild(stats);
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">RD Details</h3>';
  inputs.appendChild(
    createSmartInput({
      id: 'mon',
      label: 'Monthly Deposit',
      min: 500,
      max: 100000,
      value: state.monthly,
      step: 500,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.monthly = v;
        update();
      },
    })
  );
  const r = document.createElement('div');
  r.style.marginTop = 'var(--space-6)';
  r.appendChild(
    createSmartInput({
      id: 'rate',
      label: 'Interest Rate',
      min: 1,
      max: 50,
      value: state.rate,
      step: 0.1,
      suffix: '%',
      onChange: (v) => {
        state.rate = v;
        update();
      },
    })
  );
  inputs.appendChild(r);
  const t = document.createElement('div');
  t.style.marginTop = 'var(--space-6)';
  t.appendChild(
    createSmartInput({
      id: 'tenure',
      label: 'Tenure (Months)',
      min: 6,
      max: 120,
      value: state.tenure,
      onChange: (v) => {
        state.tenure = v;
        update();
      },
    })
  );
  inputs.appendChild(t);
  update();
  return container;
}
