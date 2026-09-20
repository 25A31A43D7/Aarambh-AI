import React from 'react';
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
} from 'lucide-react';
import { UserProfile, GPSLocation, BusinessIdea, LoanCalcResult, SavedPlan } from '../../types';
import { getTranslation } from '../../i18n';
import { fmtINR } from '../../utils/calculator';

interface DashboardViewProps {
  user: UserProfile;
  location: GPSLocation;
  readinessScore: number;
  activeIdea: BusinessIdea;
  loanCalc: LoanCalcResult;
  savedPlans: SavedPlan[];
  reportsCount: number;
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
  onNavigate,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#F7EFE0] to-[#FFFDF8] border-l-4 border-[#B5551E] border-y border-r border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#231F18] m-0">
              {getTranslation('dash_welcome', 'en')}, {user.name}!
            </h2>
            <div className="text-xs md:text-sm text-[#5E5648] mt-1 flex flex-wrap items-center gap-2">
              <span>
                📍 <strong>{location.village}, {location.district}, {location.state}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAE0CE] text-[#8C3E14] uppercase">
                {location.classification} ENTERPRISE ZONE
              </span>
              <span className="text-[#8C8373]">• PMEGP Subsidy Tier: <strong>{loanCalc.subsidyPct * 100}%</strong></span>
            </div>
          </div>
          <div className="text-left md:text-right bg-white/70 p-3 rounded-lg border border-[#DDD1B8]/60 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5648] block">
              Bank Readiness Score
            </span>
            <div className="font-display text-3xl font-bold text-[#1E5C4A]">
              {readinessScore}%
            </div>
            <span className="text-[10px] text-[#1E5C4A] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Pre-Qualified for JanSamarth
            </span>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats */}
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

      {/* Active Proposal Snapshot */}
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C8373]">
              Active Proposal Snapshot
            </span>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#231F18] m-0">
              {activeIdea.name.en}
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
            <span className="text-[11px] text-[#785310] block">Promoter Margin ({loanCalc.marginPct * 100}%)</span>
            <span className="text-base font-bold text-[#785310]">{fmtINR(loanCalc.marginMoney)}</span>
          </div>
          <div className="p-3 bg-[#E8F2F9] rounded-lg">
            <span className="text-[11px] text-[#1D5C8A] block">Monthly Bank EMI (Post-Grace)</span>
            <span className="text-base font-bold text-[#1D5C8A]">{fmtINR(loanCalc.regularEmi)} / mo</span>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="space-y-2 text-xs md:text-sm">
          <div className="flex justify-between py-1.5 border-b border-dashed border-[#DDD1B8]">
            <span className="text-[#5E5648]">Government Capital Subsidy (Credit-Linked)</span>
            <strong className="text-[#1E5C4A]">{fmtINR(loanCalc.subsidyAmount)} ({loanCalc.subsidyPct * 100}%)</strong>
          </div>
          <div className="flex justify-between py-1.5 border-b border-dashed border-[#DDD1B8]">
            <span className="text-[#5E5648]">Net Bank Term Loan Required</span>
            <strong>{fmtINR(loanCalc.netLoan)}</strong>
          </div>
          <div className="flex justify-between py-1.5 border-b border-dashed border-[#DDD1B8]">
            <span className="text-[#5E5648]">Moratorium (Grace Period) Allowance</span>
            <strong className="text-[#B88628]">{loanCalc.moratorium} Months (Interest-only: {fmtINR(loanCalc.moratoriumMonthlyInterest)}/mo)</strong>
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
            className="px-3.5 py-2 rounded-lg bg-[#B5551E] hover:bg-[#8C3E14] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Loan & Moratorium Calculator</span>
          </button>
          <button
            onClick={() => onNavigate('sim')}
            className="px-3.5 py-2 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-[#231F18] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#B88628]" />
            <span>What-If Stress Simulator</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
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
            className="p-3.5 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all text-left group"
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
            className="p-3.5 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all text-left group"
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
            className="p-3.5 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all text-left group"
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
            className="p-3.5 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all text-left group"
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
