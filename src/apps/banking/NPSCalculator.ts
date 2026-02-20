/**
 * FinSuite OS - NPS Calculator
 */
import { calculateNPS, formatCurrency } from '@/core/math';
import { SmartChart } from '@/components/charts/SmartChart';
import { createSmartInput, createResultCard } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { monthly: 5000, age: 30, rate: 10 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header"><h1 class="page-title">👴 NPS Calculator</h1><p class="page-subtitle">National Pension System</p></header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;
  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;
  let chart: SmartChart | null = null;

  function update(): void {
    const result = calculateNPS(state.monthly, state.age, 60, state.rate, 40, 6);
    results.innerHTML = '';
    const stats = document.createElement('div');
    stats.className = 'stats-grid mb-6';
    stats.appendChild(
      createResultCard({
        label: 'Total Corpus at 60',
        value: formatCurrency(result.totalCorpus),
        accent: true,
      })
    );
    stats.appendChild(
      createResultCard({ label: 'Lumpsum (60%)', value: formatCurrency(result.lumpsum) })
    );
    stats.appendChild(
      createResultCard({
        label: 'Monthly Pension',
        value: formatCurrency(result.monthlyPension),
        subtext: 'From 40% annuity',
      })
    );
    results.appendChild(stats);

    const chartBox = document.createElement('div');
    chartBox.className = 'chart-container';
    const canvas = document.createElement('canvas');
    chartBox.appendChild(canvas);
    results.appendChild(chartBox);
    if (chart) chart.destroy();
    chart = new SmartChart(canvas);
    chart.render({
      type: 'area',
      labels: result.yearlyBreakdown.map((y) => `Age ${state.age + y.year}`),
      datasets: [
        {
          label: 'Corpus',
          data: result.yearlyBreakdown.map((y) => y.corpus),
          type: 'growth',
          fill: true,
        },
        {
          label: 'Contributions',
          data: result.yearlyBreakdown.map((y) => y.contribution),
          type: 'neutral',
          fill: false,
        },
      ],
    });
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">NPS Details</h3>';
  inputs.appendChild(
    createSmartInput({
      id: 'mon',
      label: 'Monthly Contribution',
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
  const a = document.createElement('div');
  a.style.marginTop = 'var(--space-6)';
  a.appendChild(
    createSmartInput({
      id: 'age',
      label: 'Current Age',
      min: 18,
      max: 55,
      value: state.age,
      suffix: ' years',
      onChange: (v) => {
        state.age = v;
        update();
      },
    })
  );
  inputs.appendChild(a);
  const r = document.createElement('div');
  r.style.marginTop = 'var(--space-6)';
  r.appendChild(
    createSmartInput({
      id: 'rate',
      label: 'Expected Return',
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
  update();
  return container;
}
