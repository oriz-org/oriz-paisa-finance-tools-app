/**
 * FinSuite OS - Password Generator
 */
import { generatePassword, calculatePasswordStrength } from '@/services/utility';
import { createSmartInput, createToggle } from '@/components/ui/SmartInput';

export function render(): HTMLElement {
  const state = { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, password: '' };
  state.password = generatePassword(state);

  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🔐 Password Generator</h1>
      <p class="page-subtitle">Generate secure passwords</p>
    </header>
    <div class="calculator-layout">
      <div class="glass-card" style="padding: var(--space-6);" id="options"></div>
      <div id="result"></div>
    </div>
  `;

  const optionsEl = container.querySelector('#options') as HTMLElement;
  const resultEl = container.querySelector('#result') as HTMLElement;

  function update(): void {
    state.password = generatePassword(state);
    const strength = calculatePasswordStrength(state.password);

    resultEl.innerHTML = `
      <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
        <div style="font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--space-2);">Generated Password</div>
        <div style="
          font-family: var(--font-mono);
          font-size: var(--text-xl);
          word-break: break-all;
          padding: var(--space-4);
          background: var(--glass-bg);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
        " id="password-display">${state.password}</div>
        <div style="display: flex; gap: var(--space-3);">
          <button class="btn btn--primary flex-1" id="copy-btn">📋 Copy</button>
          <button class="btn btn--secondary flex-1" id="regenerate-btn">🔄 Regenerate</button>
        </div>
      </div>

      <div class="glass-card" style="padding: var(--space-5);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
          <span>Password Strength</span>
          <span style="color: ${strength.color}; font-weight: 600;">${strength.label}</span>
        </div>
        <div style="height: 8px; background: var(--glass-bg); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${(strength.score / 7) * 100}%; background: ${strength.color}; transition: all 0.3s;"></div>
        </div>
      </div>
    `;

    resultEl.querySelector('#copy-btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(state.password);
      window.showToast?.('Copied to clipboard!', 'success');
    });

    resultEl.querySelector('#regenerate-btn')?.addEventListener('click', update);
  }

  optionsEl.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Options</h3>';

  optionsEl.appendChild(createSmartInput({
    id: 'length',
    label: 'Password Length',
    min: 8,
    max: 64,
    value: state.length,
    onChange: (v) => { state.length = v; update(); },
  }));

  const toggles = document.createElement('div');
  toggles.style.marginTop = 'var(--space-6)';
  toggles.appendChild(createToggle({ id: 'upper', label: 'Uppercase (A-Z)', checked: state.uppercase, onChange: (v) => { state.uppercase = v; update(); } }));
  toggles.appendChild(createToggle({ id: 'lower', label: 'Lowercase (a-z)', checked: state.lowercase, onChange: (v) => { state.lowercase = v; update(); } }));
  toggles.appendChild(createToggle({ id: 'nums', label: 'Numbers (0-9)', checked: state.numbers, onChange: (v) => { state.numbers = v; update(); } }));
  toggles.appendChild(createToggle({ id: 'syms', label: 'Symbols (!@#$)', checked: state.symbols, onChange: (v) => { state.symbols = v; update(); } }));
  optionsEl.appendChild(toggles);

  update();
  return container;
}
