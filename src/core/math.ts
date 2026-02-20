/**
 * FinSuite OS - Math Engine
 * Pure calculation functions for all financial formulas
 * No DOM dependencies - pure TypeScript
 */

// ============================================
// INVESTMENT CALCULATIONS (Drive A)
// ============================================

export interface SIPResult {
  investedAmount: number;
  totalValue: number;
  wealthGained: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    value: number;
    gains: number;
  }>;
}

/**
 * Calculate SIP returns
 * @param monthlyInvestment - Monthly SIP amount
 * @param annualRate - Expected annual return rate (as percentage, e.g., 12 for 12%)
 * @param years - Investment duration in years
 */
export function calculateSIP(
  monthlyInvestment: number,
  annualRate: number,
  years: number
): SIPResult {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];

  for (let year = 1; year <= years; year++) {
    const n = year * 12;
    const invested = monthlyInvestment * n;
    const value =
      monthlyInvestment * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    yearlyBreakdown.push({
      year,
      invested: Math.round(invested),
      value: Math.round(value),
      gains: Math.round(value - invested),
    });
  }

  const investedAmount = monthlyInvestment * months;
  const totalValue =
    monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const wealthGained = totalValue - investedAmount;

  return {
    investedAmount: Math.round(investedAmount),
    totalValue: Math.round(totalValue),
    wealthGained: Math.round(wealthGained),
    yearlyBreakdown,
  };
}

export interface LumpsumResult {
  investedAmount: number;
  totalValue: number;
  wealthGained: number;
  yearlyBreakdown: Array<{
    year: number;
    value: number;
  }>;
}

/**
 * Calculate Lumpsum investment returns
 */
export function calculateLumpsum(
  principal: number,
  annualRate: number,
  years: number
): LumpsumResult {
  const rate = annualRate / 100;
  const yearlyBreakdown: LumpsumResult['yearlyBreakdown'] = [];

  for (let year = 1; year <= years; year++) {
    const value = principal * Math.pow(1 + rate, year);
    yearlyBreakdown.push({
      year,
      value: Math.round(value),
    });
  }

  const totalValue = principal * Math.pow(1 + rate, years);
  const wealthGained = totalValue - principal;

  return {
    investedAmount: principal,
    totalValue: Math.round(totalValue),
    wealthGained: Math.round(wealthGained),
    yearlyBreakdown,
  };
}

export interface StepUpSIPResult {
  investedAmount: number;
  totalValue: number;
  wealthGained: number;
  yearlyBreakdown: Array<{
    year: number;
    monthlyAmount: number;
    invested: number;
    value: number;
  }>;
}

/**
 * Calculate Step-Up SIP (annual increment)
 * @param initialMonthly - Starting monthly investment
 * @param stepUpPercent - Annual increment percentage
 * @param annualRate - Expected annual return rate
 * @param years - Investment duration
 */
export function calculateStepUpSIP(
  initialMonthly: number,
  stepUpPercent: number,
  annualRate: number,
  years: number
): StepUpSIPResult {
  const monthlyRate = annualRate / 12 / 100;
  let totalInvested = 0;
  let totalValue = 0;
  let currentMonthly = initialMonthly;
  const yearlyBreakdown: StepUpSIPResult['yearlyBreakdown'] = [];

  for (let year = 1; year <= years; year++) {
    const yearInvested = currentMonthly * 12;
    totalInvested += yearInvested;

    // Calculate value for this year's contributions
    const remainingMonths = (years - year + 1) * 12;
    const yearValue =
      currentMonthly *
      ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate) *
      (1 + monthlyRate) *
      Math.pow(1 + monthlyRate, remainingMonths - 12);

    totalValue += yearValue;

    yearlyBreakdown.push({
      year,
      monthlyAmount: Math.round(currentMonthly),
      invested: Math.round(totalInvested),
      value: Math.round(totalValue),
    });

    currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
  }

  return {
    investedAmount: Math.round(totalInvested),
    totalValue: Math.round(totalValue),
    wealthGained: Math.round(totalValue - totalInvested),
    yearlyBreakdown,
  };
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
export function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  if (initialValue <= 0 || years <= 0) return 0;
  const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  return Math.round(cagr * 100) / 100;
}

/**
 * Rule of 72 - Years to double money
 */
export function calculateRuleOf72(annualRate: number): number {
  if (annualRate <= 0) return 0;
  return Math.round((72 / annualRate) * 10) / 10;
}

export interface SWPResult {
  totalWithdrawals: number;
  finalBalance: number;
  monthlyBreakdown: Array<{
    month: number;
    withdrawal: number;
    balance: number;
  }>;
  durationMonths: number;
}

/**
 * Calculate SWP (Systematic Withdrawal Plan)
 * @param corpus - Initial investment corpus
 * @param monthlyWithdrawal - Monthly withdrawal amount
 * @param annualRate - Expected annual return rate
 */
export function calculateSWP(
  corpus: number,
  monthlyWithdrawal: number,
  annualRate: number
): SWPResult {
  const monthlyRate = annualRate / 12 / 100;
  let balance = corpus;
  let totalWithdrawals = 0;
  const monthlyBreakdown: SWPResult['monthlyBreakdown'] = [];
  let month = 0;

  while (balance > 0 && month < 1200) {
    // Max 100 years
    month++;
    balance = balance * (1 + monthlyRate);
    const withdrawal = Math.min(monthlyWithdrawal, balance);
    balance -= withdrawal;
    totalWithdrawals += withdrawal;

    if (month <= 120) {
      // Only store first 10 years
      monthlyBreakdown.push({
        month,
        withdrawal: Math.round(withdrawal),
        balance: Math.round(balance),
      });
    }
  }

  return {
    totalWithdrawals: Math.round(totalWithdrawals),
    finalBalance: Math.round(balance),
    monthlyBreakdown,
    durationMonths: month,
  };
}

export interface GoalResult {
  requiredMonthlySIP: number;
  requiredLumpsum: number;
  inflationAdjustedGoal: number;
}

/**
 * Calculate goal-based investment
 */
export function calculateGoal(
  goalAmount: number,
  years: number,
  expectedReturn: number,
  inflationRate: number
): GoalResult {
  const inflationAdjustedGoal = goalAmount * Math.pow(1 + inflationRate / 100, years);
  const monthlyRate = expectedReturn / 12 / 100;
  const months = years * 12;

  // SIP formula reversed
  const requiredMonthlySIP =
    inflationAdjustedGoal /
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

  // Lumpsum formula reversed
  const requiredLumpsum = inflationAdjustedGoal / Math.pow(1 + expectedReturn / 100, years);

  return {
    requiredMonthlySIP: Math.round(requiredMonthlySIP),
    requiredLumpsum: Math.round(requiredLumpsum),
    inflationAdjustedGoal: Math.round(inflationAdjustedGoal),
  };
}

export interface FIREResult {
  targetCorpus: number;
  yearsToFIRE: number;
  monthlyWithdrawalSafe: number;
  yearlyBreakdown: Array<{
    year: number;
    savings: number;
    corpus: number;
  }>;
}

/**
 * Calculate FIRE (Financial Independence, Retire Early)
 * @param monthlyExpenses - Current monthly expenses
 * @param currentSavings - Current savings/investments
 * @param monthlySavings - Monthly savings
 * @param expectedReturn - Expected annual return
 * @param safeWithdrawalRate - Safe withdrawal rate (default 4%)
 */
export function calculateFIRE(
  monthlyExpenses: number,
  currentSavings: number,
  monthlySavings: number,
  expectedReturn: number,
  safeWithdrawalRate: number = 4
): FIREResult {
  const yearlyExpenses = monthlyExpenses * 12;
  const targetCorpus = yearlyExpenses / (safeWithdrawalRate / 100);

  const monthlyRate = expectedReturn / 12 / 100;
  let corpus = currentSavings;
  let months = 0;
  const yearlyBreakdown: FIREResult['yearlyBreakdown'] = [];

  while (corpus < targetCorpus && months < 600) {
    // Max 50 years
    months++;
    corpus = corpus * (1 + monthlyRate) + monthlySavings;

    if (months % 12 === 0) {
      yearlyBreakdown.push({
        year: months / 12,
        savings: Math.round(currentSavings + monthlySavings * months),
        corpus: Math.round(corpus),
      });
    }
  }

  return {
    targetCorpus: Math.round(targetCorpus),
    yearsToFIRE: Math.round((months / 12) * 10) / 10,
    monthlyWithdrawalSafe: Math.round((targetCorpus * (safeWithdrawalRate / 100)) / 12),
    yearlyBreakdown,
  };
}

// ============================================
// BANKING CALCULATIONS (Drive B)
// ============================================

export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principalPercent: number;
  interestPercent: number;
  amortizationSchedule: Array<{
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

/**
 * Calculate EMI (Equated Monthly Installment)
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): EMIResult {
  const monthlyRate = annualRate / 12 / 100;

  // EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  const emi =
    principal *
    monthlyRate *
    (Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1));

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  // Generate amortization schedule
  const amortizationSchedule: EMIResult['amortizationSchedule'] = [];
  let balance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance -= principalPaid;

    amortizationSchedule.push({
      month,
      principal: Math.round(principalPaid),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    principalPercent: Math.round((principal / totalPayment) * 100),
    interestPercent: Math.round((totalInterest / totalPayment) * 100),
    amortizationSchedule,
  };
}

export interface FDResult {
  maturityAmount: number;
  totalInterest: number;
  effectiveYield: number;
}

/**
 * Calculate FD (Fixed Deposit) maturity
 * @param principal - Deposit amount
 * @param annualRate - Annual interest rate
 * @param tenureMonths - Tenure in months
 * @param compoundingFreq - Compounding frequency (1=yearly, 2=half-yearly, 4=quarterly, 12=monthly)
 */
export function calculateFD(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  compoundingFreq: number = 4
): FDResult {
  const rate = annualRate / 100;
  const years = tenureMonths / 12;
  const n = compoundingFreq;

  // A = P (1 + r/n)^(nt)
  const maturityAmount = principal * Math.pow(1 + rate / n, n * years);
  const totalInterest = maturityAmount - principal;
  const effectiveYield = ((maturityAmount / principal - 1) / years) * 100;

  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(totalInterest),
    effectiveYield: Math.round(effectiveYield * 100) / 100,
  };
}

export interface RDResult {
  maturityAmount: number;
  totalDeposit: number;
  totalInterest: number;
}

/**
 * Calculate RD (Recurring Deposit) maturity
 */
export function calculateRD(
  monthlyDeposit: number,
  annualRate: number,
  tenureMonths: number
): RDResult {
  const quarterlyRate = annualRate / 4 / 100;
  const totalDeposit = monthlyDeposit * tenureMonths;

  // RD formula with quarterly compounding
  let maturityAmount = 0;
  for (let i = 0; i < tenureMonths; i++) {
    const remainingQuarters = (tenureMonths - i) / 3;
    maturityAmount += monthlyDeposit * Math.pow(1 + quarterlyRate, remainingQuarters);
  }

  return {
    maturityAmount: Math.round(maturityAmount),
    totalDeposit,
    totalInterest: Math.round(maturityAmount - totalDeposit),
  };
}

export interface PPFResult {
  maturityAmount: number;
  totalDeposit: number;
  totalInterest: number;
  yearlyBreakdown: Array<{
    year: number;
    deposit: number;
    interest: number;
    balance: number;
  }>;
}

/**
 * Calculate PPF (Public Provident Fund) - 15 year scheme
 */
export function calculatePPF(
  yearlyDeposit: number,
  annualRate: number = 7.1,
  years: number = 15
): PPFResult {
  const rate = annualRate / 100;
  let balance = 0;
  let totalDeposit = 0;
  let totalInterest = 0;
  const yearlyBreakdown: PPFResult['yearlyBreakdown'] = [];

  for (let year = 1; year <= years; year++) {
    balance += yearlyDeposit;
    totalDeposit += yearlyDeposit;
    const interest = balance * rate;
    totalInterest += interest;
    balance += interest;

    yearlyBreakdown.push({
      year,
      deposit: totalDeposit,
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }

  return {
    maturityAmount: Math.round(balance),
    totalDeposit,
    totalInterest: Math.round(totalInterest),
    yearlyBreakdown,
  };
}

/**
 * Calculate SSY (Sukanya Samriddhi Yojana)
 * Similar to PPF but different lock-in rules
 */
export function calculateSSY(
  yearlyDeposit: number,
  annualRate: number = 8.2,
  depositYears: number = 15,
  maturityYears: number = 21
): PPFResult {
  const rate = annualRate / 100;
  let balance = 0;
  let totalDeposit = 0;
  let totalInterest = 0;
  const yearlyBreakdown: PPFResult['yearlyBreakdown'] = [];

  for (let year = 1; year <= maturityYears; year++) {
    if (year <= depositYears) {
      balance += yearlyDeposit;
      totalDeposit += yearlyDeposit;
    }
    const interest = balance * rate;
    totalInterest += interest;
    balance += interest;

    yearlyBreakdown.push({
      year,
      deposit: totalDeposit,
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }

  return {
    maturityAmount: Math.round(balance),
    totalDeposit,
    totalInterest: Math.round(totalInterest),
    yearlyBreakdown,
  };
}

export interface NPSResult {
  totalCorpus: number;
  pensionWealth: number;
  lumpsum: number;
  monthlyPension: number;
  yearlyBreakdown: Array<{
    year: number;
    contribution: number;
    corpus: number;
  }>;
}

/**
 * Calculate NPS (National Pension System)
 */
export function calculateNPS(
  monthlyContribution: number,
  currentAge: number,
  retirementAge: number = 60,
  expectedReturn: number = 10,
  annuityPercent: number = 40,
  annuityRate: number = 6
): NPSResult {
  const years = retirementAge - currentAge;
  const monthlyRate = expectedReturn / 12 / 100;
  const months = years * 12;

  let totalCorpus =
    monthlyContribution *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);

  totalCorpus = Math.round(totalCorpus);
  const lumpsum = Math.round(totalCorpus * (1 - annuityPercent / 100));
  const pensionWealth = Math.round(totalCorpus * (annuityPercent / 100));
  const monthlyPension = Math.round((pensionWealth * (annuityRate / 100)) / 12);

  const yearlyBreakdown: NPSResult['yearlyBreakdown'] = [];
  for (let year = 1; year <= years; year++) {
    const n = year * 12;
    const corpus =
      monthlyContribution * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    yearlyBreakdown.push({
      year,
      contribution: Math.round(monthlyContribution * n),
      corpus: Math.round(corpus),
    });
  }

  return {
    totalCorpus,
    pensionWealth,
    lumpsum,
    monthlyPension,
    yearlyBreakdown,
  };
}

/**
 * Calculate future value with inflation
 */
export function calculateInflation(
  currentValue: number,
  inflationRate: number,
  years: number
): number {
  return Math.round(currentValue * Math.pow(1 + inflationRate / 100, years));
}

/**
 * Calculate present value accounting for inflation
 */
export function calculatePresentValue(
  futureValue: number,
  inflationRate: number,
  years: number
): number {
  return Math.round(futureValue / Math.pow(1 + inflationRate / 100, years));
}

// ============================================
// TAX CALCULATIONS
// ============================================

export interface GSTResult {
  originalAmount: number;
  gstAmount: number;
  totalAmount: number;
}

/**
 * Calculate GST
 */
export function calculateGST(
  amount: number,
  gstRate: number,
  inclusive: boolean = false
): GSTResult {
  if (inclusive) {
    const originalAmount = amount / (1 + gstRate / 100);
    const gstAmount = amount - originalAmount;
    return {
      originalAmount: Math.round(originalAmount),
      gstAmount: Math.round(gstAmount),
      totalAmount: Math.round(amount),
    };
  } else {
    const gstAmount = amount * (gstRate / 100);
    return {
      originalAmount: Math.round(amount),
      gstAmount: Math.round(gstAmount),
      totalAmount: Math.round(amount + gstAmount),
    };
  }
}

export interface HRAResult {
  hraReceived: number;
  exemptHRA: number;
  taxableHRA: number;
  method: string;
}

/**
 * Calculate HRA exemption
 */
export function calculateHRA(
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean
): HRAResult {
  const yearlyBasic = basicSalary * 12;
  const yearlyHRA = hraReceived * 12;
  const yearlyRent = rentPaid * 12;

  // Three conditions for HRA exemption
  const condition1 = yearlyHRA;
  const condition2 = isMetro ? yearlyBasic * 0.5 : yearlyBasic * 0.4;
  const condition3 = yearlyRent - yearlyBasic * 0.1;

  const exemptHRA = Math.max(0, Math.min(condition1, condition2, condition3));
  const taxableHRA = yearlyHRA - exemptHRA;

  let method = 'Actual HRA received';
  if (exemptHRA === condition2) {
    method = isMetro ? '50% of basic salary' : '40% of basic salary';
  } else if (exemptHRA === condition3) {
    method = 'Rent paid - 10% of basic salary';
  }

  return {
    hraReceived: Math.round(yearlyHRA),
    exemptHRA: Math.round(exemptHRA),
    taxableHRA: Math.round(taxableHRA),
    method,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format number as Indian currency
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  const absAmount = Math.abs(amount);
  let formatted: string;

  if (absAmount >= 10000000) {
    formatted = (absAmount / 10000000).toFixed(2) + ' Cr';
  } else if (absAmount >= 100000) {
    formatted = (absAmount / 100000).toFixed(2) + ' L';
  } else if (absAmount >= 1000) {
    formatted = (absAmount / 1000).toFixed(2) + ' K';
  } else {
    formatted = absAmount.toLocaleString('en-IN');
  }

  return (amount < 0 ? '-' : '') + symbol + formatted;
}

/**
 * Format number with Indian numbering system
 */
export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

/**
 * Parse formatted currency string to number
 */
export function parseCurrency(str: string): number {
  const cleaned = str.replace(/[₹$€£,\s]/g, '');
  return parseFloat(cleaned) || 0;
}
