/**
 * FinSuite OS - Smart Input Component
 * Synced slider + number input with currency formatting
 */

export interface SmartInputConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  currency?: boolean;
  onChange: (value: number) => void;
}

/**
 * Create a smart input component (slider + number synced)
 */
export function createSmartInput(config: SmartInputConfig): HTMLElement {
  const {
    id,
    label,
    min,
    max,
    value,
    step = 1,
    prefix = '',
    suffix = '',
    currency = false,
    onChange,
  } = config;

  const container = document.createElement('div');
  container.className = 'slider-container';
  container.innerHTML = `
    <div class="slider-header">
      <label class="slider-label" for="${id}">${label}</label>
      <span class="slider-value" id="${id}-display">
        ${prefix}${formatValue(value, currency)}${suffix}
      </span>
    </div>
    <input
      type="range"
      class="slider"
      id="${id}"
      min="${min}"
      max="${max}"
      step="${step}"
      value="${value}"
    />
    <div class="flex justify-between text-muted" style="font-size: var(--text-xs);">
      <span>${prefix}${formatValue(min, currency)}${suffix}</span>
      <span>${prefix}${formatValue(max, currency)}${suffix}</span>
    </div>
  `;

  const slider = container.querySelector(`#${id}`) as HTMLInputElement;
  const display = container.querySelector(`#${id}-display`) as HTMLSpanElement;

  // Handle slider input
  slider.addEventListener('input', () => {
    const val = parseFloat(slider.value);
    display.textContent = `${prefix}${formatValue(val, currency)}${suffix}`;
    onChange(val);
  });

  return container;
}

/**
 * Create a number input with currency formatting
 */
export function createNumberInput(config: {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  placeholder?: string;
  onChange: (value: number) => void;
}): HTMLElement {
  const { id, label, value, prefix = '', placeholder = '', onChange } = config;

  const container = document.createElement('div');
  container.className = 'input-group';
  container.innerHTML = `
    <label class="input-label" for="${id}">${label}</label>
    <div style="position: relative;">
      ${prefix ? `<span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary);">${prefix}</span>` : ''}
      <input
        type="number"
        class="input input--mono"
        id="${id}"
        value="${value}"
        placeholder="${placeholder}"
        style="${prefix ? 'padding-left: 28px;' : ''}"
      />
    </div>
  `;

  const input = container.querySelector(`#${id}`) as HTMLInputElement;

  input.addEventListener('input', () => {
    const val = parseFloat(input.value) || 0;
    onChange(val);
  });

  return container;
}

/**
 * Create a select dropdown
 */
export function createSelect(config: {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}): HTMLElement {
  const { id, label, options, value, onChange } = config;

  const container = document.createElement('div');
  container.className = 'input-group';
  container.innerHTML = `
    <label class="input-label" for="${id}">${label}</label>
    <select class="input" id="${id}">
      ${options.map((opt) => `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`).join('')}
    </select>
  `;

  const select = container.querySelector(`#${id}`) as HTMLSelectElement;

  select.addEventListener('change', () => {
    onChange(select.value);
  });

  return container;
}

/**
 * Create a toggle switch
 */
export function createToggle(config: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}): HTMLElement {
  const { id, label, checked, onChange } = config;

  const container = document.createElement('div');
  container.className = 'flex items-center justify-between';
  container.style.padding = 'var(--space-3) 0';
  container.innerHTML = `
    <label class="input-label" for="${id}" style="margin: 0;">${label}</label>
    <label class="toggle-switch" style="
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;
    ">
      <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
      <span class="toggle-slider" style="
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-full);
        transition: var(--transition-base);
      "></span>
    </label>
  `;

  const input = container.querySelector(`#${id}`) as HTMLInputElement;
  const slider = container.querySelector('.toggle-slider') as HTMLSpanElement;

  // Add toggle indicator
  const indicator = document.createElement('span');
  indicator.style.cssText = `
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    top: 2px;
    background: var(--accent-primary);
    border-radius: var(--radius-full);
    transition: var(--transition-base);
    transform: ${checked ? 'translateX(24px)' : 'translateX(0)'};
  `;
  slider.appendChild(indicator);

  input.addEventListener('change', () => {
    indicator.style.transform = input.checked ? 'translateX(24px)' : 'translateX(0)';
    onChange(input.checked);
  });

  return container;
}

/**
 * Format value for display
 */
function formatValue(value: number, currency: boolean): string {
  if (currency) {
    if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString('en-IN');
  }
  return value.toLocaleString('en-IN');
}

/**
 * Create a result display card
 */
export function createResultCard(config: {
  label: string;
  value: string;
  subtext?: string;
  accent?: boolean;
}): HTMLElement {
  const { label, value, subtext, accent = false } = config;

  const card = document.createElement('div');
  card.className = 'result-card';
  card.innerHTML = `
    <span class="result-label">${label}</span>
    <span class="result-value ${accent ? 'result-value--accent' : ''}">${value}</span>
    ${subtext ? `<span class="result-subtext">${subtext}</span>` : ''}
  `;

  return card;
}

/**
 * Create an AI insight box
 */
export function createAIInsight(content: string, loading: boolean = false): HTMLElement {
  const box = document.createElement('div');
  box.className = 'ai-insight';
  box.innerHTML = `
    <div class="ai-insight-header">
      <span class="ai-insight-icon">✨</span>
      <span class="ai-insight-title">AI Advisor</span>
    </div>
    <div class="ai-insight-content">
      ${loading ? '<div class="skeleton" style="height: 60px;"></div>' : content}
    </div>
  `;

  return box;
}

/**
 * Update AI insight content
 */
export function updateAIInsight(container: HTMLElement, content: string): void {
  const contentEl = container.querySelector('.ai-insight-content');
  if (contentEl) {
    contentEl.innerHTML = content;
  }
}
