/**
 * FinSuite OS - Inflation Calculator
 */
import { calculateInflation, calculatePresentValue, formatCurrency } from '@/core/math';
import { createSmartInput, createResultCard, createToggle } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { amount: 100000, rate: 6, years: 10, reverse: false };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">📈 Inflation Calculator</h1><p class="page-subtitle">Purchasing power over time</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    results.innerHTML = '';
    if (state.reverse) {
      const present = calculatePresentValue(state.amount, state.rate, state.years);
      const stats = document.createElement('div');
      stats.className = 'stats-grid';
      stats.appendChild(
        createResultCard({
          label: `Future Value (in ${state.years} yrs)`,
          value: formatCurrency(state.amount),
        })
      );
      stats.appendChild(
        createResultCard({ label: "Today's Value", value: formatCurrency(present), accent: true })
      );
      stats.appendChild(
        createResultCard({
          label: 'Loss in Value',
          value: formatCurrency(state.amount - present),
          subtext: `${(((state.amount - present) / state.amount) * 100).toFixed(1)}% decrease`,
        })
      );
      results.appendChild(stats);
    } else {
      const future = calculateInflation(state.amount, state.rate, state.years);
      const stats = document.createElement('div');
      stats.className = 'stats-grid';
      stats.appendChild(
        createResultCard({ label: "Today's Amount", value: formatCurrency(state.amount) })
      );
      stats.appendChild(
        createResultCard({
          label: `Future Cost (in ${state.years} yrs)`,
          value: formatCurrency(future),
          accent: true,
        })
      );
      stats.appendChild(
        createResultCard({
          label: 'Increase',
          value: formatCurrency(future - state.amount),
          subtext: `${(((future - state.amount) / state.amount) * 100).toFixed(1)}% increase`,
        })
      );
      results.appendChild(stats);
    }
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Calculate Inflation Impact</h3>';
  inputs.appendChild(
    createSmartInput({
      id: 'amt',
      label: 'Amount',
      min: 1000,
      max: 100000000,
      value: state.amount,
      step: 10000,
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
    createSmartInput({
      id: 'rate',
      label: 'Inflation Rate',
      min: 1,
      max: 50,
      value: state.rate,
      step: 0.5,
      suffix: '%',
      onChange: (v) => {
        state.rate = v;
        update();
      },
    })
  );
  inputs.appendChild(r);
  const y = document.createElement('div');
  y.style.marginTop = 'var(--space-6)';
  y.appendChild(
    createSmartInput({
      id: 'years',
      label: 'Time Period',
      min: 1,
      max: 50,
      value: state.years,
      suffix: ' years',
      onChange: (v) => {
        state.years = v;
        update();
      },
    })
  );
  inputs.appendChild(y);
  const t = document.createElement('div');
  t.style.marginTop = 'var(--space-6)';
  t.appendChild(
    createToggle({
      id: 'rev',
      label: 'Reverse (Future → Today)',
      checked: state.reverse,
      onChange: (v) => {
        state.reverse = v;
        update();
      },
    })
  );
  inputs.appendChild(t);
  update();
  return container;
}
