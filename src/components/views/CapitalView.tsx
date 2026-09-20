import React, { useState } from 'react';
import { Wallet, CheckCircle2, AlertCircle, ArrowRight, Calculator, Compass } from 'lucide-react';
import { CapitalState, UserProfile, Language } from '../../types';
import { fmtINR } from '../../utils/calculator';
import { getTranslation } from '../../i18n';

interface CapitalViewProps {
  capital: CapitalState;
  user: UserProfile;
  lang: Language;
  onUpdateCapital: (updated: CapitalState) => void;
  onNavigate: (view: string) => void;
}

export const CapitalView: React.FC<CapitalViewProps> = ({
  capital,
  user,
  lang,
  onUpdateCapital,
  onNavigate,
}) => {
  const [ownSavings, setOwnSavings] = useState(capital.ownSavings);
  const [softLoans, setSoftLoans] = useState(capital.softLoans);
  const [targetCapex, setTargetCapex] = useState(capital.targetCapex);
  const [landValue, setLandValue] = useState(capital.landValue);
  const [maxEmi, setMaxEmi] = useState(capital.maxEmi);

  const totalEquity = (ownSavings || 0) + (softLoans || 0);
  const target = Math.max(1000, targetCapex || 200000);
  const equityPct = Math.round((totalEquity / target) * 100);

  const isSpecial = user.category === 'special' || user.gender === 'female';
  const requiredMarginPct = isSpecial ? 5 : 10;
  const isCompliant = equityPct >= requiredMarginPct;

  const subsidyPct = isSpecial ? 0.35 : 0.25;
  const subsidyEst = Math.round(target * subsidyPct);
  const netLoanNeeded = Math.max(0, target - totalEquity - subsidyEst);

  const handleApplyChanges = () => {
    onUpdateCapital({
      ownSavings,
      softLoans,
      targetCapex,
      landValue,
      maxEmi,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="pb-3 border-b border-[#DDD1B8] mb-4">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#1E5C4A]">
            Financial Structuring & Margin Planning
          </span>
          <h2 className="font-display text-xl font-bold text-[#231F18] m-0">
            {getTranslation('nav_capital', lang)} & Debt-Equity Breakdown
          </h2>
          <p className="text-xs text-[#5E5648] mt-1">
            Banks require mandatory promoter equity before sanctioning credit. Plan your own savings and soft family loans against target capex to satisfy statutory margin norms.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Own Liquid Savings (₹)
            </label>
            <input
              type="number"
              step="5000"
              min="0"
              value={ownSavings}
              onChange={(e) => {
                setOwnSavings(Number(e.target.value) || 0);
                handleApplyChanges();
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Family / Soft Loan Support (₹)
            </label>
            <input
              type="number"
              step="5000"
              min="0"
              value={softLoans}
              onChange={(e) => {
                setSoftLoans(Number(e.target.value) || 0);
                handleApplyChanges();
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Target Project Cost (Capex) (₹)
            </label>
            <input
              type="number"
              step="10000"
              min="10000"
              value={targetCapex}
              onChange={(e) => {
                setTargetCapex(Number(e.target.value) || 0);
                handleApplyChanges();
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Owned Land / Shed Valuation (₹)
            </label>
            <input
              type="number"
              step="10000"
              min="0"
              value={landValue}
              onChange={(e) => {
                setLandValue(Number(e.target.value) || 0);
                handleApplyChanges();
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Maximum Monthly EMI Budget (₹)
            </label>
            <input
              type="number"
              step="500"
              min="0"
              value={maxEmi}
              onChange={(e) => {
                setMaxEmi(Number(e.target.value) || 0);
                handleApplyChanges();
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            />
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
          <div className="p-3 bg-[#F3ECE0] rounded-lg border border-[#DDD1B8]">
            <span className="text-[11px] text-[#5E5648] font-semibold block">Total Available Equity</span>
            <span className="font-display text-xl font-bold text-[#231F18]">{fmtINR(totalEquity)}</span>
            <span className="text-[10px] text-[#8C8373] block mt-0.5">({equityPct}% of Capex)</span>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              isCompliant
                ? 'bg-[#E5F0EB] border-[#1E5C4A]/30 text-[#144134]'
                : 'bg-[#FDEBE8] border-[#A23B27]/30 text-[#A23B27]'
            }`}
          >
            <span className="text-[11px] font-semibold block">Statutory Margin Rule</span>
            <span className="font-display text-xl font-bold">
              {isCompliant ? 'Compliant' : 'Deficit'}
            </span>
            <span className="text-[10px] block mt-0.5">Min required: {requiredMarginPct}%</span>
          </div>

          <div className="p-3 bg-[#FAF2DC] rounded-lg border border-[#B88628]/30">
            <span className="text-[11px] text-[#785310] font-semibold block">Govt Subsidy Grant</span>
            <span className="font-display text-xl font-bold text-[#785310]">{fmtINR(subsidyEst)}</span>
            <span className="text-[10px] text-[#785310] block mt-0.5">({subsidyPct * 100}% PMEGP)</span>
          </div>

          <div className="p-3 bg-[#E8F2F9] rounded-lg border border-[#1D5C8A]/30">
            <span className="text-[11px] text-[#1D5C8A] font-semibold block">Net Bank Borrowing</span>
            <span className="font-display text-xl font-bold text-[#1D5C8A]">{fmtINR(netLoanNeeded)}</span>
            <span className="text-[10px] text-[#1D5C8A] block mt-0.5">Term Loan</span>
          </div>
        </div>

        {/* Compliance Notice Banner */}
        <div
          className={`p-4 rounded-xl border text-xs md:text-sm leading-relaxed ${
            isCompliant
              ? 'bg-[#E5F0EB] border-[#1E5C4A]/30 text-[#144134]'
              : 'bg-[#FDEBE8] border-[#A23B27]/30 text-[#A23B27]'
          }`}
        >
          {isCompliant ? (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Statutory Compliance Verified:</strong> Your available equity contribution of{' '}
                <strong>{equityPct}%</strong> exceeds the mandatory minimum <strong>{requiredMarginPct}%</strong>{' '}
                promoter equity required under PMEGP for {isSpecial ? 'Special Category' : 'General Category'} applicants.
                Your proposal qualifies for loan appraisal.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Margin Shortfall Alert:</strong> Under PMEGP rules, you need at least{' '}
                <strong>{requiredMarginPct}%</strong> own contribution ({fmtINR(target * (requiredMarginPct / 100))}).
                Current equity is {fmtINR(totalEquity)}. Please increase equity by{' '}
                <strong>{fmtINR(target * (requiredMarginPct / 100) - totalEquity)}</strong> or reduce project outlay.
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#DDD1B8] flex flex-wrap gap-2.5 mt-5">
          <button
            onClick={() => {
              handleApplyChanges();
              onNavigate('calc');
            }}
            className="px-4 py-2 rounded-lg bg-[#B5551E] hover:bg-[#8C3E14] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Load into Loan Calculator</span>
          </button>
          <button
            onClick={() => {
              handleApplyChanges();
              onNavigate('modeA');
            }}
            className="px-4 py-2 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-[#231F18] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#1E5C4A]" />
            <span>Discover Ideas for {fmtINR(totalEquity)} Equity</span>
          </button>
        </div>
      </div>
    </div>
  );
};
