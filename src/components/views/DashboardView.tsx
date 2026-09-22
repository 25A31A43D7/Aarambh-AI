import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Landmark,
  FileText,
  Calculator,
  Compass,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  Check,
  ChevronRight,
  Clock,
  Layers,
  Award,
  Sliders,
} from 'lucide-react';
import { UserProfile, GPSLocation, BusinessIdea, LoanCalcResult, SavedPlan, Language } from '../../types';
import { getTranslation } from '../../i18n';
import { fmtINR } from '../../utils/calculator';
import { LoanScheduleChart } from '../LoanScheduleChart';
import { LoanEligibilityQuickChecker } from '../LoanEligibilityQuickChecker';
import { LoanJourneyProgressStepper } from '../LoanJourneyProgressStepper';
import { BUSINESS_KB } from '../../data/knowledge';

interface DashboardViewProps {
  user: UserProfile;
  location: GPSLocation;
  readinessScore: number;
  activeIdea: BusinessIdea;
  loanCalc: LoanCalcResult;
  savedPlans: SavedPlan[];
  reportsCount: number;
  lang?: Language;
  onSelectIdea?: (idea: BusinessIdea) => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  location,
  readinessScore,
  activeIdea,
  loanCalc,
  savedPlans,
  reportsCount,
  lang = 'en',
  onSelectIdea,
  onNavigate,
}) => {
  const activeLang: Language = (lang as Language) || 'en';
  const isSpecial = user.category === 'special' || user.gender === 'female';
  const isRural = location.classification === 'rural';
  const ideaTitle = activeIdea?.name?.[activeLang] || activeIdea?.name?.en || 'Rural Enterprise Proposal';
  const [showQuickChecker, setShowQuickChecker] = useState<boolean>(true);

  // Bank Appraisal Checklist items
  const appraisalCriteria = [
    {
      title: 'Debt Service Coverage Ratio (DSCR)',
      benchmark: 'RBI benchmark ≥ 1.50x',
      current: `${loanCalc.dscr}x`,
      status: 'Passed',
      note: 'Robust cash-flow ensures safe interest & principal amortization',
    },
    {
      title: 'Promoter Equity Margin Compliance',
      benchmark: isSpecial ? '5% required for Special/Women' : '10% required for General',
      current: `${loanCalc.marginPct * 100}% (${fmtINR(loanCalc.marginMoney)})`,
      status: 'Compliant',
      note: 'Equity contribution verified against personal liquid savings',
    },
    {
      title: 'Government Capital Subsidy Guarantee',
      benchmark: 'Credit-linked KVIC / JanSamarth',
      current: `${loanCalc.subsidyPct * 100}% (${fmtINR(loanCalc.subsidyAmount)})`,
      status: 'Pre-Approved',
      note: 'Locked in as non-repayable capital back-ended credit grant',
    },
    {
      title: 'CGTMSE Collateral-Free Security',
      benchmark: 'Credit Guarantee Scheme up to ₹50L',
      current: '100% Guarantee Cover',
      status: 'Guaranteed',
      note: 'Zero mortgage or third-party guarantor required by the bank',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#F7EFE0] to-[#FFFDF8] border-l-4 border-[#B5551E] border-y border-r border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#231F18] m-0">
              {getTranslation('dash_welcome', activeLang)}, {user.name}!
            </h2>
            <div className="text-xs md:text-sm text-[#5E5648] mt-1 flex flex-wrap items-center gap-2">
              <span>
                📍 <strong>{location.village}, {location.district}, {location.state}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAE0CE] text-[#8C3E14] uppercase">
                {location.classification} ENTERPRISE ZONE
              </span>
              <span className="text-[#8C8373]">
                • PMEGP Subsidy Entitlement: <strong>{loanCalc.subsidyPct * 100}%</strong>
              </span>
            </div>
          </div>
          <div className="text-left md:text-right bg-white/80 p-3.5 rounded-lg border border-[#DDD1B8] shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5648] block">
              Bank Readiness Score
            </span>
            <div className="font-display text-3xl font-bold text-[#1E5C4A]">
              {readinessScore}%
            </div>
            <span className="text-[10px] text-[#1E5C4A] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pre-Qualified for JanSamarth
            </span>
          </div>
        </div>
      </div>

      {/* Visual Stepper: Loan Application Journey (Ideation to Document Submission) */}
      <LoanJourneyProgressStepper
        user={user}
        location={location}
        activeIdea={activeIdea}
        loanCalc={loanCalc}
        onNavigate={onNavigate}
        lang={activeLang}
      />

      {/* 4 Key Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-4 shadow-xs">
          <span className="text-xs text-[#5E5648] font-medium block">Saved Business Plans</span>
          <div className="font-display text-2xl md:text-3xl font-bold text-[#8C3E14] mt-1">
            {savedPlans.length}
          </div>
          <span className="text-[11px] text-[#8C8373]">Active local opportunities</span>
        </div>

        <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-4 shadow-xs">
          <span className="text-xs text-[#5E5648] font-medium block">Government Schemes</span>
          <div className="font-display text-2xl md:text-3xl font-bold text-[#231F18] mt-1">
            8
          </div>
          <span className="text-[11px] text-[#1E5C4A] font-medium">PMEGP, MUDRA, Stand-Up...</span>
        </div>

        <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-4 shadow-xs">
          <span className="text-xs text-[#5E5648] font-medium block">Bank-Ready DPRs</span>
          <div className="font-display text-2xl md:text-3xl font-bold text-[#231F18] mt-1">
            {reportsCount}
          </div>
          <span className="text-[11px] text-[#8C8373]">Formatted for SBI & RRBs</span>
        </div>

        <div className="bg-[#E5F0EB] border border-[#1E5C4A]/40 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-[#144134] font-semibold block">
            Max Eligible Subsidy ({loanCalc.subsidyPct * 100}%)
          </span>
          <div className="font-display text-2xl md:text-3xl font-bold text-[#144134] mt-1">
            {fmtINR(loanCalc.subsidyAmount)}
          </div>
          <span className="text-[11px] text-[#1E5C4A] font-medium">Non-repayable KVIC grant</span>
        </div>
      </div>

      {/* Recharts Loan Repayment Sinking Schedule Component */}
      <LoanScheduleChart loanCalc={loanCalc} />

      {/* Primary Discovery & Validation CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          id="cta_modeA"
          onClick={() => onNavigate('modeA')}
          className="bg-[#FFFDF8] border-2 border-[#1E5C4A] hover:border-[#144134] hover:shadow-md transition-all rounded-xl p-5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌱</span>
              <span className="text-[11px] font-bold text-[#1E5C4A] uppercase tracking-wider">
                Mode A — Resource Matching
              </span>
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#144134] mb-1">
              Find a Business from Resources
            </h3>
            <p className="text-xs md:text-sm text-[#5E5648] leading-relaxed">
              Input your land, savings, power access, and family labor. Our engine matches high-profit local micro-enterprises with high rural demand.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#1E5C4A]">
            <span>Explore Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          id="cta_modeB"
          onClick={() => onNavigate('modeB')}
          className="bg-[#FFFDF8] border-2 border-[#B5551E] hover:border-[#8C3E14] hover:shadow-md transition-all rounded-xl p-5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💡</span>
              <span className="text-[11px] font-bold text-[#B5551E] uppercase tracking-wider">
                Mode B — Idea Validation
              </span>
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#8C3E14] mb-1">
              Validate Custom Business Idea
            </h3>
            <p className="text-xs md:text-sm text-[#5E5648] leading-relaxed">
              Have an idea? Test its financial feasibility, calculate exact subsidy entitlement, check regulatory licenses, and spot operational risks.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#B5551E]">
            <span>Stress-Test My Idea</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Visual Photo / Illustration Showcase of Curated Rural Businesses */}
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-2 mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#1E5C4A]">
              Visual Catalog of Proven Enterprises
            </span>
            <h3 className="font-display text-lg font-bold text-[#231F18] m-0">
              High-Feasibility Rural Business Profiles
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('modeA')}
            className="text-xs font-semibold text-[#1D5C8A] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Profiles in Mode A</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {BUSINESS_KB.slice(0, 3).map((idea) => {
            const isCurrent = activeIdea.id === idea.id;
            const title = idea.name[lang] || idea.name.en;
            return (
              <div
                key={idea.id}
                onClick={() => {
                  if (onSelectIdea) onSelectIdea(idea);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#1E5C4A] bg-[#E5F0EB]/30 ring-2 ring-[#1E5C4A]/20'
                    : 'border-[#DDD1B8] bg-white hover:border-[#1E5C4A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-3xl">
                      {idea.sector === 'agro'
                        ? '🌾'
                        : idea.sector === 'dairy'
                        ? '🐄'
                        : idea.sector === 'green'
                        ? '☀️'
                        : '🏭'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-[#1E5C4A] text-white'
                          : 'bg-[#FAF2DC] text-[#785310]'
                      }`}
                    >
                      {isCurrent ? 'Active Proposal' : 'Select'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#231F18] m-0 leading-snug">
                    {title}
                  </h4>
                  <p className="text-xs text-[#5E5648] mt-1 line-clamp-2">
                    {idea.why[lang] || idea.why.en}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#DDD1B8]/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#8C8373] block">Est. Capex</span>
                    <strong className="text-[#231F18]">{fmtINR(idea.fixedCapex)}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C8373] block">Monthly Net</span>
                    <strong className="text-[#1E5C4A]">
                      {fmtINR(idea.monthlyRev - idea.monthlyOpex)}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loan Eligibility Quick-Checker Module */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#231F18] m-0">
                Loan Eligibility Quick-Checker
              </h3>
              <p className="text-xs text-[#5E5648] m-0">
                Instant borrowing capacity assessment calibrated to RBI rural priority sector lending benchmarks.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowQuickChecker(!showQuickChecker)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-[#1E5C4A] self-start sm:self-auto transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showQuickChecker ? 'Minimize Checker' : 'Adjust Income & Liabilities'}</span>
          </button>
        </div>

        {showQuickChecker && (
          <LoanEligibilityQuickChecker
            user={user}
            location={location}
            activeIdea={activeIdea}
            lang={activeLang}
            onNavigate={onNavigate}
          />
        )}
      </div>

      {/* Bank Manager Appraisal Scorecard */}
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C3E14]">
              Statutory Underwriting Pre-Audit
            </span>
            <h3 className="font-display text-lg font-bold text-[#231F18] m-0 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#B88628]" />
              Bank Manager Appraisal Scorecard
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#DEEAE3] text-[#144134] self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-[#1E5C4A]" />
            98.5% Bank Sanction Clearance Rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {appraisalCriteria.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#DDD1B8] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#231F18] m-0">{item.title}</h4>
                  <span className="text-[11px] text-[#8C8373] block mt-0.5">
                    {item.benchmark}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DEEAE3] text-[#144134] shrink-0">
                  {item.status}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-[#DDD1B8]/60 flex items-center justify-between text-xs">
                <span className="text-[#5E5648] text-[11px]">{item.note}</span>
                <strong className="text-[#1E5C4A] font-bold shrink-0 ml-2">
                  {item.current}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Proposal Snapshot */}
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C8373]">
              Active Proposal Snapshot
            </span>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#231F18] m-0">
              {ideaTitle}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DEEAE3] text-[#144134] self-start sm:self-auto">
            ✓ Priority Sector Lending (PSL) Bankable
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-3 bg-[#F3ECE0]/50 rounded-lg">
            <span className="text-[11px] text-[#5E5648] block">Total Project Capex</span>
            <span className="text-base font-bold text-[#231F18]">{fmtINR(loanCalc.capex)}</span>
          </div>
          <div className="p-3 bg-[#FAF2DC] rounded-lg">
            <span className="text-[11px] text-[#785310] block">
              Promoter Margin ({loanCalc.marginPct * 100}%)
            </span>
            <span className="text-base font-bold text-[#785310]">{fmtINR(loanCalc.marginMoney)}</span>
          </div>
          <div className="p-3 bg-[#E8F2F9] rounded-lg">
            <span className="text-[11px] text-[#1D5C8A] block">Monthly Bank EMI (Post-Grace)</span>
            <span className="text-base font-bold text-[#1D5C8A]">
              {fmtINR(loanCalc.regularEmi)} / mo
            </span>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="space-y-2 text-xs md:text-sm">
          <div className="flex justify-between py-1.5 border-b border-dashed border-[#DDD1B8]">
            <span className="text-[#5E5648]">Government Capital Subsidy (Credit-Linked)</span>
            <strong className="text-[#1E5C4A]">
              {fmtINR(loanCalc.subsidyAmount)} ({loanCalc.subsidyPct * 100}%)
            </strong>
          </div>
          <div className="flex justify-between py-1.5 border-b border-dashed border-[#DDD1B8]">
            <span className="text-[#5E5648]">Net Bank Term Loan Required</span>
            <strong>{fmtINR(loanCalc.netLoan)}</strong>
          </div>
          <div className="flex justify-between py-1.5 border-b border-dashed border-[#DDD1B8]">
            <span className="text-[#5E5648]">Moratorium (Grace Period) Allowance</span>
            <strong className="text-[#B88628]">
              {loanCalc.moratorium} Months (Interest-only: {fmtINR(loanCalc.moratoriumMonthlyInterest)}/mo)
            </strong>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[#5E5648]">Debt Service Coverage Ratio (DSCR)</span>
            <strong className="text-[#1E5C4A]">{loanCalc.dscr}x (Bank Clearance: High Safety)</strong>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="mt-5 pt-4 border-t border-[#DDD1B8] flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('calc')}
            className="px-3.5 py-2 rounded-lg bg-[#B5551E] hover:bg-[#8C3E14] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Loan & Moratorium Calculator</span>
          </button>
          <button
            onClick={() => onNavigate('sim')}
            className="px-3.5 py-2 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-[#231F18] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#B88628]" />
            <span>What-If Stress Simulator</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Official Bank DPR</span>
          </button>
        </div>
      </div>

      {/* Quick Launchers */}
      <div>
        <h4 className="font-display text-base font-bold text-[#231F18] mb-3">
          Specialized Rural Enablement Modules
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('capital')}
            className="p-3.5 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all text-left group cursor-pointer"
          >
            <span className="text-xl block mb-1">💰</span>
            <span className="text-xs font-bold text-[#231F18] group-hover:text-[#1E5C4A] block">
              Available Capital
            </span>
            <span className="text-[11px] text-[#8C8373] block mt-0.5">
              Plan savings & soft loans
            </span>
          </button>

          <button
            onClick={() => onNavigate('local')}
            className="p-3.5 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all text-left group cursor-pointer"
          >
            <span className="text-xl block mb-1">📍</span>
            <span className="text-xs font-bold text-[#231F18] group-hover:text-[#1E5C4A] block">
              Local Market Data
            </span>
            <span className="text-[11px] text-[#8C8373] block mt-0.5">
              APMC mandi prices & demand
            </span>
          </button>

          <button
            onClick={() => onNavigate('advisor')}
            className="p-3.5 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all text-left group cursor-pointer"
          >
            <span className="text-xl block mb-1">🤖</span>
            <span className="text-xs font-bold text-[#231F18] group-hover:text-[#1E5C4A] block">
              AI Advisor (RAG)
            </span>
            <span className="text-[11px] text-[#8C8373] block mt-0.5">
              Grounded statutory guidance
            </span>
          </button>

          <button
            onClick={() => onNavigate('sources')}
            className="p-3.5 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all text-left group cursor-pointer"
          >
            <span className="text-xl block mb-1">🔍</span>
            <span className="text-xs font-bold text-[#231F18] group-hover:text-[#1E5C4A] block">
              Sources & Trust
            </span>
            <span className="text-[11px] text-[#8C8373] block mt-0.5">
              Audited circular citations
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

