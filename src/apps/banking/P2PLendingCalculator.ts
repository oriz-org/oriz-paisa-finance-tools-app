/**
 * FinSuite OS - P2P Lending Interest Calculator
 * Simple Interest calculator for Peer-to-Peer lending with RBI caps
 */
import { formatCurrency } from '@/core/math';
import { createSmartInput, createResultCard, createSelect } from '@/components/ui/SmartInput';

// RBI caps for P2P lending
const MAX_LENDING_AMOUNT = 5000000; // ₹50 Lakhs max per individual
const PLATFORM_FEE_PERCENT = 1; // Typical 1% platform fee
const TDS_RATE = 10; // 10% TDS on interest
const TDS_THRESHOLD = 5000; // TDS applicable if interest > ₹5000

interface P2PResult {
  principal: number;
  grossInterest: number;
  platformFee: number;
  tds: number;
  netInterest: number;
  netReturn: number;
  effectiveRate: number;
  monthlyInterest: number;
}

function calculateP2PLending(
  principal: number,
  rate: number,
  tenureMonths: number,
  platformFeePercent: number
): P2PResult {
  const tenureYears = tenureMonths / 12;

  // Simple Interest: P × R × T / 100
  const grossInterest = (principal * rate * tenureYears) / 100;

  // Platform fee on interest earned
  const platformFee = (grossInterest * platformFeePercent) / 100;

  // TDS calculation (10% if interest > ₹5000)
  const interestAfterPlatformFee = grossInterest - platformFee;
  const tds =
    interestAfterPlatformFee > TDS_THRESHOLD ? (interestAfterPlatformFee * TDS_RATE) / 100 : 0;

  // Net calculations
  const netInterest = interestAfterPlatformFee - tds;
  const netReturn = principal + netInterest;

  // Effective rate after all deductions
  const effectiveRate = tenureYears > 0 ? (netInterest / principal / tenureYears) * 100 : 0;

  // Monthly interest (for monthly payout calculation)
  const monthlyInterest = grossInterest / tenureMonths;

  return {
    principal,
    grossInterest: Math.round(grossInterest),
    platformFee: Math.round(platformFee),
    tds: Math.round(tds),
    netInterest: Math.round(netInterest),
    netReturn: Math.round(netReturn),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    monthlyInterest: Math.round(monthlyInterest),
  };
}

export function render(): HTMLElement {
  const state = {
    principal: 100000,
    rate: 12,
    tenure: 12,
    platformFee: PLATFORM_FEE_PERCENT,
    payoutType: 'maturity', // or 'monthly'
  };

  const container = document.createElement('div');
  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">🤝 P2P Lending Calculator</h1>
      <p class="page-subtitle">Simple interest calculator for Peer-to-Peer lending (RBI regulated)</p>
    </header>
    <div class="calculator-layout">
      <div class="calculator-inputs glass-card" style="padding: var(--space-6);" id="inputs"></div>
      <div class="calculator-results" id="results"></div>
    </div>
  `;

  const inputs = container.querySelector('#inputs') as HTMLElement;
  const results = container.querySelector('#results') as HTMLElement;

  function update(): void {
    const result = calculateP2PLending(
      state.principal,
      state.rate,
      state.tenure,
      state.platformFee
    );

    results.innerHTML = '';

    // Main stats
    const stats = document.createElement('div');
    stats.className = 'stats-grid';

    if (state.payoutType === 'monthly') {
      stats.appendChild(
        createResultCard({
          label: 'Monthly Interest',
          value: formatCurrency(result.monthlyInterest),
          accent: true,
        })
      );
    } else {
      stats.appendChild(
        createResultCard({
          label: 'Net Return at Maturity',
          value: formatCurrency(result.netReturn),
          accent: true,
        })
      );
    }

    stats.appendChild(
      createResultCard({
        label: 'Gross Interest',
        value: formatCurrency(result.grossInterest),
      })
    );
    stats.appendChild(
      createResultCard({
        label: 'Net Interest (After Deductions)',
        value: formatCurrency(result.netInterest),
      })
    );
    stats.appendChild(
      createResultCard({
        label: 'Effective Rate',
        value: `${result.effectiveRate}% p.a.`,
      })
    );

    results.appendChild(stats);

    // Deductions breakdown
    const deductions = document.createElement('div');
    deductions.className = 'glass-card';
    deductions.style.cssText = 'padding: var(--space-5); margin-top: var(--space-4);';
    deductions.innerHTML = `
      <h4 style="margin-bottom: var(--space-3); color: var(--text-secondary);">📋 Deductions Breakdown</h4>
      <div style="display: flex; flex-direction: column; gap: var(--space-2);">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-tertiary);">Platform Fee (${state.platformFee}%)</span>
          <span style="color: var(--accent-cost); font-family: var(--font-mono);">- ${formatCurrency(result.platformFee)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-tertiary);">TDS (${result.tds > 0 ? TDS_RATE : 0}%)</span>
          <span style="color: var(--accent-cost); font-family: var(--font-mono);">- ${formatCurrency(result.tds)}</span>
        </div>
        <hr style="border: none; border-top: 1px solid var(--glass-border); margin: var(--space-2) 0;">
        <div style="display: flex; justify-content: space-between; font-weight: 600;">
          <span>Total Deductions</span>
          <span style="color: var(--accent-cost); font-family: var(--font-mono);">- ${formatCurrency(result.platformFee + result.tds)}</span>
        </div>
      </div>
    `;
    results.appendChild(deductions);

    // RBI regulations notice
    const notice = document.createElement('div');
    notice.className = 'ai-insight';
    notice.style.marginTop = 'var(--space-4)';
    notice.innerHTML = `
      <div class="ai-insight-header">
        <span class="ai-insight-icon">⚠️</span>
        <span class="ai-insight-title">RBI P2P Lending Regulations</span>
      </div>
      <div class="ai-insight-content">
        <ul style="margin: 0; padding-left: var(--space-4); color: var(--text-secondary);">
          <li>Maximum investment limit: ₹50 Lakhs per individual</li>
          <li>Maximum per borrower: ₹50,000</li>
          <li>TDS @10% applicable if interest exceeds ₹5,000</li>
          <li>Returns are not guaranteed - default risk exists</li>
        </ul>
      </div>
    `;
    results.appendChild(notice);
  }

  // Build inputs
  inputs.innerHTML = '<h3 style="margin-bottom: var(--space-4);">Investment Details</h3>';

  // Principal with RBI cap warning
  const principalContainer = document.createElement('div');
  principalContainer.appendChild(
    createSmartInput({
      id: 'p2p-principal',
      label: `Principal Amount (Max ₹${(MAX_LENDING_AMOUNT / 100000).toFixed(0)}L)`,
      min: 1000,
      max: MAX_LENDING_AMOUNT,
      value: state.principal,
      step: 10000,
      prefix: '₹',
      currency: true,
      onChange: (v) => {
        state.principal = v;
        update();
      },
    })
  );
  inputs.appendChild(principalContainer);

  // Interest rate
  const rateContainer = document.createElement('div');
  rateContainer.style.marginTop = 'var(--space-6)';
  rateContainer.appendChild(
    createSmartInput({
      id: 'p2p-rate',
      label: 'Expected Interest Rate',
      min: 8,
      max: 36,
      value: state.rate,
      step: 0.5,
      suffix: '%',
      onChange: (v) => {
        state.rate = v;
        update();
      },
    })
  );
  inputs.appendChild(rateContainer);

  // Tenure
  const tenureContainer = document.createElement('div');
  tenureContainer.style.marginTop = 'var(--space-6)';
  tenureContainer.appendChild(
    createSmartInput({
      id: 'p2p-tenure',
      label: 'Tenure (Months)',
      min: 6,
      max: 36,
      value: state.tenure,
      step: 1,
      suffix: ' months',
      onChange: (v) => {
        state.tenure = v;
        update();
      },
    })
  );
  inputs.appendChild(tenureContainer);

  // Platform fee
  const feeContainer = document.createElement('div');
  feeContainer.style.marginTop = 'var(--space-6)';
  feeContainer.appendChild(
    createSmartInput({
      id: 'p2p-fee',
      label: 'Platform Fee',
      min: 0,
      max: 3,
      value: state.platformFee,
      step: 0.1,
      suffix: '%',
      onChange: (v) => {
        state.platformFee = v;
        update();
      },
    })
  );
  inputs.appendChild(feeContainer);

  // Payout type
  const payoutContainer = document.createElement('div');
  payoutContainer.style.marginTop = 'var(--space-6)';
  payoutContainer.appendChild(
    createSelect({
      id: 'p2p-payout',
      label: 'Interest Payout',
      value: state.payoutType,
      options: [
        { value: 'maturity', label: 'At Maturity' },
        { value: 'monthly', label: 'Monthly Payout' },
      ],
      onChange: (v) => {
        state.payoutType = v;
        update();
      },
    })
  );
  inputs.appendChild(payoutContainer);

  update();
  return container;
}
