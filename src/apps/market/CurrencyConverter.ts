/**
 * FinSuite OS - Currency Converter
 */
import { convertCurrency, getAvailableCurrencies } from '@/services/market';
import { createNumberInput, createSelect } from '@/components/ui/SmartInput';

export async function render(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">💱 Currency Converter</h1>
      <p class="page-subtitle">Real-time exchange rates from Frankfurter API</p>
    </header>
    <div class="glass-card" style="padding: var(--space-6);" id="converter">
      <div class="skeleton" style="height: 200px;"></div>
    </div>
  `;

  const converterEl = container.querySelector('#converter') as HTMLElement;

  try {
    const currencies = await getAvailableCurrencies();
    const currencyOptions = Object.entries(currencies).map(([code, name]) => ({
      value: code,
      label: `${code} - ${name}`,
    }));

    const state = { amount: 1000, from: 'INR', to: 'USD', result: 0 };

    async function update(): Promise<void> {
      const resultEl = converterEl.querySelector('#result') as HTMLElement;
      if (resultEl) resultEl.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div>';
      state.result = await convertCurrency(state.amount, state.from, state.to);
      if (resultEl)
        resultEl.innerHTML = `
        <div style="font-size: var(--text-4xl); font-family: var(--font-mono); font-weight: 700; color: var(--accent-primary);">
          ${state.result.toLocaleString('en-IN', { maximumFractionDigits: 4 })} ${state.to}
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-tertiary); margin-top: var(--space-2);">
          1 ${state.from} = ${(state.result / state.amount).toFixed(6)} ${state.to}
        </div>
      `;
    }

    converterEl.innerHTML = `
      <div class="grid grid--3 gap-4 mb-6" id="inputs"></div>
      <div id="result" style="text-align: center; padding: var(--space-6);"></div>
    `;

    const inputsEl = converterEl.querySelector('#inputs') as HTMLElement;

    inputsEl.appendChild(
      createNumberInput({
        id: 'amount',
        label: 'Amount',
        value: state.amount,
        onChange: (v) => {
          state.amount = v;
          update();
        },
      })
    );
    inputsEl.appendChild(
      createSelect({
        id: 'from',
        label: 'From',
        value: state.from,
        options: currencyOptions,
        onChange: (v) => {
          state.from = v;
          update();
        },
      })
    );
    inputsEl.appendChild(
      createSelect({
        id: 'to',
        label: 'To',
        value: state.to,
        options: currencyOptions,
        onChange: (v) => {
          state.to = v;
          update();
        },
      })
    );

    await update();
  } catch {
    converterEl.innerHTML =
      '<p style="color: var(--text-secondary); text-align: center;">Failed to load currencies</p>';
  }

  return container;
}
