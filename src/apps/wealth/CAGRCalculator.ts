/**
 * FinSuite OS - CAGR Calculator
 */
import { calculateCAGR } from '@/core/math';
import { createSmartInput, createResultCard } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { initial: 100000, final: 200000, years: 5 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">📉 CAGR Calculator</h1><p class="page-subtitle">Compound Annual Growth Rate</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    const cagr = calculateCAGR(state.initial, state.final, state.years);
    results.innerHTML = '';
    const stats = document.createElement('div');
    stats.className = 'stats-grid';
    stats.appendChild(
      createResultCard({
        label: 'CAGR',
        value: `${cagr}%`,
        accent: true,
        subtext: 'Annualized Return',
      })
    );
    stats.appendChild(
      createResultCard({
        label: 'Total Growth',
        value: `${(((state.final - state.initial) / state.initial) * 100).toFixed(1)}%`,
      })
    );
    results.appendChild(stats);
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Values</h3>';
  inputs.appendChild(
    createSmartInput({
      id: 'init',
      label: 'Initial Value',
      min: 1000,
      max: 10000000,
      value: state.initial,
      step: 10000,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.initial = v;
        update();
      },
    })
  );
  const f = document.createElement('div');
  f.style.marginTop = 'var(--space-6)';
  f.appendChild(
    createSmartInput({
      id: 'final',
      label: 'Final Value',
      min: 1000,
      max: 100000000,
      value: state.final,
      step: 10000,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.final = v;
        update();
      },
    })
  );
  inputs.appendChild(f);
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
  update();
  return container;
}
