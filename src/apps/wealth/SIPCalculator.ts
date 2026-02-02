/**
 * FinSuite OS - SIP Calculator
 * The "Gold Standard" template for all calculators
 */

import { calculateSIP, formatCurrency, formatIndianNumber } from '@/core/math';
import { askAI } from '@/core/puter';
import { SmartChart } from '@/components/charts/SmartChart';
import {
  createSmartInput,
  createResultCard,
  createAIInsight,
  updateAIInsight,
} from '@/components/ui/SmartInput';

interface SIPState {
  monthly: number;
  rate: number;
  years: number;
}

export function render(): HTMLElement {
  // Initial state
  const state: SIPState = {
    monthly: 10000,
    rate: 12,
    years: 10,
  };

  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">📈 SIP Calculator</h1>
      <p class="page-subtitle">Calculate your Systematic Investment Plan returns with real-time updates</p>
    </header>

    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs-container">
        <!-- Inputs will be rendered here -->
      </div>

      <div class="calculator-results">
        <div class="stats-grid mb-6" id="stats-grid">
          <!-- Stats will be injected here -->
        </div>

        <div class="chart-container mb-6">
          <canvas id="sip-chart"></canvas>
        </div>

        <div id="ai-insight-container"></div>
      </div>
    </div>
  `;

  const inputsContainer = container.querySelector('#inputs-container') as HTMLElement;
  const statsGrid = container.querySelector('#stats-grid') as HTMLElement;
  const chartCanvas = container.querySelector('#sip-chart') as HTMLCanvasElement;
  const aiContainer = container.querySelector('#ai-insight-container') as HTMLElement;

  // Chart instance
  const chart = new SmartChart(chartCanvas);

  // Initial AI Box
  const aiBox = createAIInsight('', true);
  aiContainer.appendChild(aiBox);

  // Render function
  function update(): void {
    const result = calculateSIP(state.monthly, state.rate, state.years);

    // Update Stats
    statsGrid.innerHTML = '';
    statsGrid.appendChild(
      createResultCard({
        label: 'Total Investment',
        value: formatCurrency(result.investedAmount),
        subtext: `${state.monthly.toLocaleString('en-IN')}/month × ${state.years * 12} months`,
      })
    );
    statsGrid.appendChild(
      createResultCard({
        label: 'Expected Returns',
        value: formatCurrency(result.totalValue),
        accent: true,
      })
    );
    statsGrid.appendChild(
      createResultCard({
        label: 'Wealth Gained',
        value: formatCurrency(result.wealthGained),
        subtext: `${((result.wealthGained / result.investedAmount) * 100).toFixed(1)}% returns`,
      })
    );

    // Update Chart
    const labels = result.yearlyBreakdown.map((y) => `Year ${y.year}`);
    const invested = result.yearlyBreakdown.map((y) => y.invested);
    const values = result.yearlyBreakdown.map((y) => y.value);

    chart.render({
      type: 'area',
      labels,
      datasets: [
        { label: 'Total Value', data: values, type: 'growth', fill: true },
        { label: 'Amount Invested', data: invested, type: 'neutral', fill: true },
      ],
      title: 'Investment Growth Over Time',
    });

    // Debounced AI Update
    updateAI(result);
  }

  // Debounce AI requests
  let aiTimeout: any;
  function updateAI(result: ReturnType<typeof calculateSIP>): void {
    clearTimeout(aiTimeout);
    updateAIInsight(aiBox, '<div class="spinner"></div>'); // Show loading state

    aiTimeout = setTimeout(() => {
      getAIInsight(result);
    }, 1000); // Wait for user to stop adjusting
  }

  async function getAIInsight(result: ReturnType<typeof calculateSIP>): Promise<void> {
    try {
        // Only ask if meaningful change? For now just ask.
        const prompt = `I am investing ₹${formatIndianNumber(state.monthly)} monthly in SIP for ${state.years} years at ${state.rate}% expected returns. My total investment will be ₹${formatIndianNumber(result.investedAmount)} and expected value is ₹${formatIndianNumber(result.totalValue)}. Give me 2 short insights about this plan.`;
        const insight = await askAI(prompt, 'advisor');
        updateAIInsight(aiBox, insight);
    } catch {
        updateAIInsight(aiBox, 'AI insights unavailable.');
    }
  }

  // Create inputs
  inputsContainer.innerHTML = '<h3 style="margin-bottom: var(--space-4); color: var(--text-primary);">Investment Parameters</h3>';

  // Monthly investment slider
  inputsContainer.appendChild(
    createSmartInput({
      id: 'sip-monthly',
      label: 'Monthly Investment',
      min: 500,
      max: 100000,
      value: state.monthly,
      step: 500,
      prefix: '₹',
      currency: true,
      onChange: (value) => {
        state.monthly = value;
        update();
      },
    })
  );

  // Expected return slider
  const rateContainer = document.createElement('div');
  rateContainer.style.marginTop = 'var(--space-6)';
  rateContainer.appendChild(
    createSmartInput({
      id: 'sip-rate',
      label: 'Expected Return Rate',
      min: 1,
      max: 30,
      value: state.rate,
      step: 0.5,
      suffix: '%',
      onChange: (value) => {
        state.rate = value;
        update();
      },
    })
  );
  inputsContainer.appendChild(rateContainer);

  // Investment period slider
  const yearsContainer = document.createElement('div');
  yearsContainer.style.marginTop = 'var(--space-6)';
  yearsContainer.appendChild(
    createSmartInput({
      id: 'sip-years',
      label: 'Investment Period',
      min: 1,
      max: 40,
      value: state.years,
      step: 1,
      suffix: ' years',
      onChange: (value) => {
        state.years = value;
        update();
      },
    })
  );
  inputsContainer.appendChild(yearsContainer);

  // Action buttons
  const actions = document.createElement('div');
  actions.className = 'flex gap-4 mt-6';
  actions.innerHTML = `
    <button class="btn btn--primary flex-1" id="save-plan">
      ☁️ Save Plan
    </button>
    <button class="btn btn--secondary flex-1" id="compare">
      ⚖️ Compare
    </button>
  `;
  inputsContainer.appendChild(actions);

  // Save plan handler
  actions.querySelector('#save-plan')?.addEventListener('click', async () => {
    const { saveToCloud } = await import('@/core/puter');
    const result = calculateSIP(state.monthly, state.rate, state.years);
    const success = await saveToCloud(`sip-plan-${Date.now()}.json`, {
      type: 'sip',
      params: state,
      result,
      createdAt: new Date().toISOString(),
    });

    if (success) {
      window.showToast?.('Plan saved to cloud!', 'success');
    } else {
      window.showToast?.('Failed to save plan', 'error');
    }
  });

  // Initial render - defer to ensure DOM might be ready
  setTimeout(() => update(), 100);

  return container;
}
