import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Landmark,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Sliders,
  DollarSign,
  PieChart,
} from 'lucide-react';
import { UserProfile, GPSLocation, BusinessIdea, Language } from '../types';
import { fmtINR } from '../utils/calculator';
import { getTranslation } from '../i18n';

interface LoanEligibilityQuickCheckerProps {
  user: UserProfile;
  location: GPSLocation;
  activeIdea?: BusinessIdea;
  lang?: Language;
  onApplyCapacityToCapex?: (capacity: number) => void;
  onNavigate?: (view: string) => void;
}

export const LoanEligibilityQuickChecker: React.FC<LoanEligibilityQuickCheckerProps> = ({
  user,
  location,
  activeIdea,
  lang = 'en',
  onApplyCapacityToCapex,
  onNavigate,
}) => {
  // Inputs
  const [annualIncome, setAnnualIncome] = useState<number>(300000); // ₹3,00,000 / yr default (~₹25,000 / mo)
  const [existingMonthlyEmi, setExistingMonthlyEmi] = useState<number>(3000); // ₹3,000 existing EMI
  const [tenureMonths, setTenureMonths] = useState<number>(60); // 5 years standard
  const [interestRate, setInterestRate] = useState<number>(9.5); // 9.5% p.a. PSL concessional rate
  const [includeFamilyIncome, setIncludeFamilyIncome] = useState<boolean>(true);

  // Bank Underwriting Benchmarks
  const isSpecial = user.category === 'special' || user.gender === 'female';
  const isRural = location.classification === 'rural';
  const subsidyPct = isSpecial && isRural ? 0.35 : isSpecial || isRural ? 0.25 : 0.15;
  const promoterMarginPct = isSpecial ? 0.05 : 0.10;

  // Monthly income
  const monthlyHouseholdIncome = Math.max(1000, Math.round(annualIncome / 12));

  // Rural Bank Benchmark: Maximum FOIR (Fixed Obligation to Income Ratio) = 50%
  // Under RBI PSL norms, monthly debt servicing should not exceed 50% of monthly household income
  const maxAllowableFoirPct = 0.50;
  const totalAllowableDebtService = Math.round(monthlyHouseholdIncome * maxAllowableFoirPct);

  // Maximum monthly capacity available for the new enterprise loan EMI
  const maxAvailableEmi = Math.max(0, totalAllowableDebtService - existingMonthlyEmi);

  // Current FOIR with existing debt only
  const currentFoirPct = Math.min(100, Math.round((existingMonthlyEmi / monthlyHouseholdIncome) * 100));

  // Projected FOIR if max loan is taken
  const projectedFoirPct = Math.min(
    100,
    Math.round(((existingMonthlyEmi + maxAvailableEmi) / monthlyHouseholdIncome) * 100)
  );

  // Reverse Calculate Maximum Borrowing Capacity (Net Bank Loan Principal)
  // PV formula: P = EMI * ((1 + r)^n - 1) / (r * (1 + r)^n)
  const monthlyRate = interestRate / 100 / 12;
  let maxBorrowingCapacity = 0;
  if (monthlyRate > 0 && maxAvailableEmi > 0) {
    const factor =
      (Math.pow(1 + monthlyRate, tenureMonths) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));
    maxBorrowingCapacity = Math.round(maxAvailableEmi * factor);
  }

  // Total Project Capex Enabled when combined with PMEGP/KVIC Capital Subsidy & Promoter Margin
  // Bank loan is: (1 - subsidyPct - promoterMarginPct) of total Capex
  const debtSharePct = 1 - subsidyPct - promoterMarginPct;
  const totalProjectCapexEnabled =
    debtSharePct > 0 ? Math.round(maxBorrowingCapacity / debtSharePct) : maxBorrowingCapacity;
  const estimatedSubsidyGrant = Math.round(totalProjectCapexEnabled * subsidyPct);
  const estimatedMarginRequired = Math.round(totalProjectCapexEnabled * promoterMarginPct);

  // Credit Band Appraisal Status
  let eligibilityStatus: 'prime' | 'moderate' | 'strained';
  let statusColor = 'text-[#1E5C4A]';
  let statusBg = 'bg-[#E5F0EB]';
  let statusBorder = 'border-[#1E5C4A]/40';
  let statusLabel = 'High Safety (Pre-Qualified)';

  if (currentFoirPct > 45 || maxAvailableEmi < 1500) {
    eligibilityStatus = 'strained';
    statusColor = 'text-[#8C3E14]';
    statusBg = 'bg-[#FFF2EB]';
    statusBorder = 'border-[#B5551E]/40';
    statusLabel = 'Tight Cash Cushion (High Debt Load)';
  } else if (currentFoirPct > 25) {
    eligibilityStatus = 'moderate';
    statusColor = 'text-[#785310]';
    statusBg = 'bg-[#FAF2DC]';
    statusBorder = 'border-[#B88628]/40';
    statusLabel = 'Standard Bank Eligibility';
  } else {
    eligibilityStatus = 'prime';
    statusColor = 'text-[#1E5C4A]';
    statusBg = 'bg-[#E5F0EB]';
    statusBorder = 'border-[#1E5C4A]/40';
    statusLabel = 'Prime Rural Credit (Fast-Track)';
  }

  // Active idea fit check
  const activeCapex = activeIdea?.fixedCapex || 220000;
  const activeIdeaFits = totalProjectCapexEnabled >= activeCapex;
  const ideaSurplusOrDeficit = totalProjectCapexEnabled - activeCapex;

  return (
    <div className="bg-[#FFFDF8] border-2 border-[#DDD1B8] rounded-2xl p-5 md:p-7 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD1B8] gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E5C4A]/10 text-[#1E5C4A] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3ECE0] text-[#8C3E14] uppercase tracking-wider mb-1">
              <Landmark className="w-3 h-3" />
              RBI & RRB Micro-Credit Guidelines
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#231F18] m-0">
              Loan Eligibility Quick-Checker
            </h3>
            <p className="text-xs text-[#5E5648] m-0 mt-0.5">
              Instant rural bank borrowing capacity check based on 50% FOIR household debt benchmark.
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border ${statusBg} ${statusBorder} flex items-center gap-2 self-start sm:self-center`}>
          <div className={`w-2.5 h-2.5 rounded-full ${eligibilityStatus === 'prime' ? 'bg-[#1E5C4A]' : eligibilityStatus === 'moderate' ? 'bg-[#B88628]' : 'bg-[#B5551E]'} animate-pulse`} />
          <span className={`text-xs font-bold ${statusColor}`}>{statusLabel}</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Financial Inputs */}
        <div className="lg:col-span-6 space-y-5">
          {/* Annual Household Income Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#231F18] flex items-center gap-1.5">
                <span>Annual Household Income</span>
                <span className="text-[10px] text-[#8C8373] font-normal">
                  (₹{monthlyHouseholdIncome.toLocaleString('en-IN')}/mo)
                </span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#1E5C4A] bg-[#E5F0EB] px-2 py-0.5 rounded border border-[#1E5C4A]/30">
                  {fmtINR(annualIncome)}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={60000}
              max={1200000}
              step={10000}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-[#1E5C4A] cursor-pointer"
            />

            {/* Income Preset Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[120000, 240000, 360000, 480000, 600000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAnnualIncome(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    annualIncome === preset
                      ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]'
                      : 'bg-white text-[#5E5648] border-[#DDD1B8] hover:bg-[#F3ECE0]'
                  }`}
                >
                  {fmtINR(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Existing Monthly Liabilities Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#231F18] flex items-center gap-1.5">
                <span>Existing Monthly Debt Liabilities</span>
                <span className="text-[10px] text-[#8C8373] font-normal">
                  (SHG loans, micro-loans, chit funds)
                </span>
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                existingMonthlyEmi > 0 ? 'bg-[#FAF2DC] text-[#785310] border-[#B88628]/30' : 'bg-[#E5F0EB] text-[#1E5C4A] border-[#1E5C4A]/30'
              }`}>
                {fmtINR(existingMonthlyEmi)} / mo
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={Math.max(15000, Math.round(monthlyHouseholdIncome * 0.7))}
              step={500}
              value={existingMonthlyEmi}
              onChange={(e) => setExistingMonthlyEmi(Number(e.target.value))}
              className="w-full accent-[#B5551E] cursor-pointer"
            />

            {/* Liability Preset Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[0, 1500, 3000, 5000, 8000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setExistingMonthlyEmi(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    existingMonthlyEmi === preset
                      ? 'bg-[#B5551E] text-white border-[#B5551E]'
                      : 'bg-white text-[#5E5648] border-[#DDD1B8] hover:bg-[#F3ECE0]'
                  }`}
                >
                  {preset === 0 ? 'Zero Debt' : fmtINR(preset) + '/mo'}
                </button>
              ))}
            </div>
          </div>

          {/* Tenure & Concessional Rate Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-[#231F18] block mb-1">
                Loan Repayment Tenure
              </label>
              <select
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full text-xs bg-white border border-[#DDD1B8] rounded-lg p-2 text-[#231F18] focus:outline-none focus:ring-2 focus:ring-[#1E5C4A]"
              >
                <option value={36}>36 Months (3 Years)</option>
                <option value={48}>48 Months (4 Years)</option>
                <option value={60}>60 Months (5 Years - Standard)</option>
                <option value={84}>84 Months (7 Years - Term Loan)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#231F18] block mb-1">
                Priority Sector Interest Rate
              </label>
              <select
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full text-xs bg-white border border-[#DDD1B8] rounded-lg p-2 text-[#231F18] focus:outline-none focus:ring-2 focus:ring-[#1E5C4A]"
              >
                <option value={8.5}>8.50% p.a. (Women / SC-ST Concession)</option>
                <option value={9.5}>9.50% p.a. (Standard PSL Concession)</option>
                <option value={10.5}>10.50% p.a. (General Rural MSME)</option>
                <option value={11.5}>11.50% p.a. (Standard Commercial Rate)</option>
              </select>
            </div>
          </div>

          {/* Statutory Benchmark Indicator */}
          <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#DDD1B8] text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#5E5648]">RBI Household FOIR Debt Benchmark:</span>
              <strong className="text-[#231F18]">50.0% Max Permissible</strong>
            </div>
            <div className="w-full bg-[#EAE0CE] h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-[#B5551E] h-full transition-all duration-300"
                style={{ width: `${currentFoirPct}%` }}
                title={`Existing Debt: ${currentFoirPct}%`}
              />
              <div
                className="bg-[#1E5C4A] h-full transition-all duration-300"
                style={{ width: `${Math.max(0, projectedFoirPct - currentFoirPct)}%` }}
                title={`Available for New Loan: ${projectedFoirPct - currentFoirPct}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#8C8373]">
              <span>Existing Debt: {currentFoirPct}%</span>
              <span>Available for New Loan: {Math.max(0, projectedFoirPct - currentFoirPct)}%</span>
              <span>Max Cap: 50%</span>
            </div>
          </div>
        </div>

        {/* Right Side: Assessment & Capacity Results */}
        <div className="lg:col-span-6 space-y-4">
          {/* Hero Assessment Metric Cards */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1E5C4A] to-[#144134] text-white shadow-md space-y-3">
            <span className="text-[10px] uppercase tracking-wider font-bold text-white/80 block">
              Estimated Rural Bank Borrowing Capacity
            </span>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold m-0 tracking-tight text-white">
                  {fmtINR(maxBorrowingCapacity)}
                </h2>
                <span className="text-xs text-white/80 mt-0.5 block">
                  Net Bank Term Loan Sanctionable (Principal)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#F59E0B] font-bold block">
                  Max Safe EMI: {fmtINR(maxAvailableEmi)}/mo
                </span>
                <span className="text-[10px] text-white/70 block">
                  Within 50% FOIR Ceiling
                </span>
              </div>
            </div>

            {/* PMEGP Subsidy Multiplier Effect Banner */}
            <div className="pt-2.5 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-white/70 block">
                  Total Project Size Supported
                </span>
                <strong className="text-base text-[#F7EFE0]">
                  {fmtINR(totalProjectCapexEnabled)}
                </strong>
                <span className="text-[10px] text-white/75 block">
                  With {subsidyPct * 100}% PMEGP Grant
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/70 block">
                  KVIC Capital Subsidy Grant
                </span>
                <strong className="text-base text-[#A7F3D0]">
                  +{fmtINR(estimatedSubsidyGrant)}
                </strong>
                <span className="text-[10px] text-white/75 block">
                  Promoter Margin: {fmtINR(estimatedMarginRequired)}
                </span>
              </div>
            </div>
          </div>

          {/* Active Enterprise Viability Check */}
          {activeIdea && (
            <div className={`p-4 rounded-xl border-2 ${
              activeIdeaFits ? 'bg-[#E5F0EB]/60 border-[#1E5C4A]' : 'bg-[#FFF2EB] border-[#B5551E]'
            } space-y-2`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#231F18] flex items-center gap-1.5">
                  {activeIdeaFits ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1E5C4A]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#B5551E]" />
                  )}
                  <span>Fit with Selected Business: {activeIdea.name.en}</span>
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  activeIdeaFits ? 'bg-[#1E5C4A] text-white' : 'bg-[#B5551E] text-white'
                }`}>
                  {activeIdeaFits ? 'FEASIBLE & APPROVED' : 'CAPITAL EXPANSION NEEDED'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[#5E5648] text-[11px] block">Enterprise Capex:</span>
                  <strong className="text-[#231F18]">{fmtINR(activeCapex)}</strong>
                </div>
                <div>
                  <span className="text-[#5E5648] text-[11px] block">Your Supported Capex:</span>
                  <strong className={activeIdeaFits ? 'text-[#1E5C4A]' : 'text-[#B5551E]'}>
                    {fmtINR(totalProjectCapexEnabled)}
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-[#5E5648] m-0 pt-1">
                {activeIdeaFits ? (
                  <span>
                    Your borrowing capacity covers this project comfortably with a <strong>{fmtINR(ideaSurplusOrDeficit)} safety surplus</strong>.
                  </span>
                ) : (
                  <span>
                    This project exceeds your estimated individual capacity by {fmtINR(Math.abs(ideaSurplusOrDeficit))}. Consider adding a family co-applicant or extending tenure to 84 months.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Underwriting Recommendations & Schemes */}
          <div className="bg-[#FAF7F0] border border-[#DDD1B8] rounded-xl p-3.5 text-xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8373] block">
              Recommended Statutory Schemes for Your Capacity:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-white rounded-lg border border-[#DDD1B8] flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#1E5C4A]/10 text-[#1E5C4A] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✓
                </div>
                <div>
                  <strong className="text-[#231F18] block text-[11px]">PMEGP Rural Special Tier</strong>
                  <span className="text-[10px] text-[#5E5648]">
                    {subsidyPct * 100}% Capital Subsidy + 5% Margin requirement.
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[#DDD1B8] flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#1D5C8A]/10 text-[#1D5C8A] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✓
                </div>
                <div>
                  <strong className="text-[#231F18] block text-[11px]">MUDRA Kishore / Tarun</strong>
                  <span className="text-[10px] text-[#5E5648]">
                    100% Collateral-Free under CGTMSE Guarantee up to ₹10 Lakhs.
                  </span>
                </div>
              </div>
            </div>

            {onNavigate && (
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-[#8C8373]">
                  Ready to formalize into your Bank Project Report?
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('reports')}
                  className="text-xs font-bold text-[#1E5C4A] hover:text-[#144134] flex items-center gap-1 cursor-pointer"
                >
                  <span>Generate Bank DPR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
