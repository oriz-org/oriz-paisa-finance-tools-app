/**
 * FinSuite OS - FIRE Calculator
 * Financial Independence, Retire Early
 */

import { calculateFIRE, formatCurrency, formatIndianNumber } from '@/core/math';
import { askAI } from '@/core/puter';
import { SmartChart } from '@/components/charts/SmartChart';
import {
  createSmartInput,
  createResultCard,
  createAIInsight,
  updateAIInsight,
} from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { expenses: 50000, savings: 500000, monthly: 30000, rate: 10 };
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🔥 FIRE Calculator</h1>
      <p class="page-subtitle">Financial Independence, Retire Early</p>
    </header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;

  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;
  let chart: SmartChart | null = null;

  function update(): void {
    const result = calculateFIRE(state.expenses, state.savings, state.monthly, state.rate);
    results.innerHTML = '';

    const stats = document.createElement('div');
    stats.className = 'stats-grid mb-6';
    stats.appendChild(
      createResultCard({
        label: 'FIRE Target',
        value: formatCurrency(result.targetCorpus),
        subtext: '25x yearly expenses',
      })
    );
    stats.appendChild(
      createResultCard({ label: 'Years to FIRE', value: `${result.yearsToFIRE} yrs`, accent: true })
    );
    stats.appendChild(
      createResultCard({
        label: 'Safe Monthly Withdrawal',
        value: formatCurrency(result.monthlyWithdrawalSafe),
        subtext: '4% rule',
      })
    );
    results.appendChild(stats);

    const chartBox = document.createElement('div');
    chartBox.className = 'chart-container mb-6';
    const canvas = document.createElement('canvas');
    chartBox.appendChild(canvas);
    results.appendChild(chartBox);

    if (chart) chart.destroy();
    chart = new SmartChart(canvas);
    chart.render({
      type: 'area',
      labels: result.yearlyBreakdown.map((y) => `Yr ${y.year}`),
      datasets: [
        {
          label: 'Corpus',
          data: result.yearlyBreakdown.map((y) => y.corpus),
          type: 'growth',
          fill: true,
        },
        {
          label: 'Target',
          data: result.yearlyBreakdown.map(() => result.targetCorpus),
          type: 'primary',
          fill: false,
        },
      ],
    });

    const aiBox = createAIInsight('', true);
    results.appendChild(aiBox);
    askAI(
      `FIRE goal: ₹${formatIndianNumber(result.targetCorpus)} corpus. Current: ₹${formatIndianNumber(state.savings)}, saving ₹${formatIndianNumber(state.monthly)}/month. Will reach in ${result.yearsToFIRE} years. 2 tips to accelerate.`,
      'advisor'
    )
      .then((i) => updateAIInsight(aiBox, i))
      .catch(() => updateAIInsight(aiBox, 'AI unavailable'));
  }

  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Your Numbers</h3>';
  inputs.appendChild(
    createSmartInput({
      id: 'exp',
      label: 'Monthly Expenses',
      min: 10000,
      max: 500000,
      value: state.expenses,
      step: 5000,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.expenses = v;
        update();
      },
    })
  );

  const sav = document.createElement('div');
  sav.style.marginTop = 'var(--space-6)';
  sav.appendChild(
    createSmartInput({
      id: 'sav',
      label: 'Current Savings',
      min: 0,
      max: 50000000,
      value: state.savings,
      step: 100000,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.savings = v;
        update();
      },
    })
  );
  inputs.appendChild(sav);

  const mon = document.createElement('div');
  mon.style.marginTop = 'var(--space-6)';
  mon.appendChild(
    createSmartInput({
      id: 'mon',
      label: 'Monthly Savings',
      min: 5000,
      max: 500000,
      value: state.monthly,
      step: 5000,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.monthly = v;
        update();
      },
    })
  );
  inputs.appendChild(mon);

  const rate = document.createElement('div');
  rate.style.marginTop = 'var(--space-6)';
  rate.appendChild(
    createSmartInput({
      id: 'rate',
      label: 'Expected Return',
      min: 1,
      max: 100,
      value: state.rate,
      step: 0.5,
      suffix: '%',
      onChange: (v) => {
        state.rate = v;
        update();
      },
    })
  );
  inputs.appendChild(rate);

  update();
  return container;
}
