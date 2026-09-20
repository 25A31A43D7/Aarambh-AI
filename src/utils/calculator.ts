import { LoanCalcResult, ScheduleRow, UserProfile, CapitalState } from '../types';

export function fmtINR(n: number | string | null | undefined): string {
  if (n === null || n === undefined || n === '') return '—';
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (!isFinite(num)) return '—';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export function calculateLoanWithMoratorium(
  capexInput: number,
  isSpecialCat: boolean,
  isRural: boolean,
  annualRatePct: number = 9.5,
  tenureMonths: number = 60,
  moratoriumMonths: number = 6,
  capitalizeInterest: boolean = false
): LoanCalcResult {
  const capex = Math.max(1000, Number(capexInput) || 0);

  let subsidyPct = 0.25;
  let marginPct = 0.10;

  if (isSpecialCat && isRural) {
    subsidyPct = 0.35;
    marginPct = 0.05;
  } else if (isSpecialCat && !isRural) {
    subsidyPct = 0.25;
    marginPct = 0.05;
  } else if (!isSpecialCat && isRural) {
    subsidyPct = 0.25;
    marginPct = 0.10;
  } else {
    subsidyPct = 0.15;
    marginPct = 0.10;
  }

  const marginMoney = Math.round(capex * marginPct);
  const subsidyAmount = Math.round(capex * subsidyPct);
  const netLoan = Math.max(0, capex - marginMoney - subsidyAmount);

  const annualRate = (Number(annualRatePct) || 9.5) / 100;
  const monthlyRate = annualRate / 12;
  const totalTenure = Number(tenureMonths) || 60;
  const moratorium = Math.min(totalTenure - 6, Math.max(0, Number(moratoriumMonths) || 0));
  const repaymentMonths = Math.max(1, totalTenure - moratorium);

  const moratoriumMonthlyInterest = Math.round(netLoan * monthlyRate);
  const totalMoratoriumInterest = moratoriumMonthlyInterest * moratorium;

  let principalForEmi = netLoan;
  if (capitalizeInterest && moratorium > 0) {
    principalForEmi += totalMoratoriumInterest;
  }

  let regularEmi = 0;
  if (principalForEmi > 0 && monthlyRate > 0 && repaymentMonths > 0) {
    regularEmi = Math.round(
      (principalForEmi * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
        (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
    );
  }

  const totalRepaymentPaid = regularEmi * repaymentMonths + (capitalizeInterest ? 0 : totalMoratoriumInterest);
  const totalInterestPaid = Math.max(0, totalRepaymentPaid - netLoan);

  const schedule: ScheduleRow[] = [];
  let currentBalance = principalForEmi;

  for (let m = 1; m <= moratorium; m++) {
    schedule.push({
      month: m,
      phase: 'Moratorium',
      opening: currentBalance,
      principal: 0,
      interest: moratoriumMonthlyInterest,
      total: capitalizeInterest ? 0 : moratoriumMonthlyInterest,
      closing: currentBalance,
    });
  }

  for (let m = 1; m <= repaymentMonths; m++) {
    const monthNum = moratorium + m;
    const interestPart = Math.round(currentBalance * monthlyRate);
    const principalPart = Math.min(currentBalance, Math.max(0, regularEmi - interestPart));
    const closingBalance = Math.max(0, currentBalance - principalPart);

    schedule.push({
      month: monthNum,
      phase: 'Repayment',
      opening: currentBalance,
      principal: principalPart,
      interest: interestPart,
      total: principalPart + interestPart,
      closing: closingBalance,
    });
    currentBalance = closingBalance;
  }

  // DSCR calculation: Projected annual Net Operating Cash Flow / Annual Debt Service
  const projectedMonthlyNetProfit = Math.round(capex * 0.16); // ~16% benchmark monthly net cash margin
  const annualCashFlow = projectedMonthlyNetProfit * 12;
  const annualDebtService = regularEmi * 12;
  const dscrVal = annualDebtService > 0 ? (annualCashFlow / annualDebtService).toFixed(2) : '3.50';

  return {
    capex,
    marginPct,
    marginMoney,
    subsidyPct,
    subsidyAmount,
    netLoan,
    moratorium,
    moratoriumMonthlyInterest,
    totalMoratoriumInterest,
    regularEmi,
    totalInterestPaid,
    totalRepaymentPaid,
    dscr: dscrVal,
    schedule,
  };
}

export function calculateBankReadiness(profile: UserProfile, capital: CapitalState): number {
  let score = 30; // base qualification

  if (profile.hasJanDhan) score += 15;
  if (['10th', '12th', 'graduate'].includes(profile.education)) score += 15;
  else if (profile.education === '8th') score += 10;

  if (profile.creditBand === 'good') score += 15;
  else if (profile.creditBand === 'fair') score += 8;

  const totalEquity = (capital.ownSavings || 0) + (capital.softLoans || 0);
  const targetCapex = capital.targetCapex || 200000;
  const equityPct = totalEquity / targetCapex;

  if (equityPct >= 0.15) score += 15;
  else if (equityPct >= 0.05) score += 10;

  if (profile.landAcres > 0 || profile.hasShed) score += 10;

  return Math.min(100, score);
}
