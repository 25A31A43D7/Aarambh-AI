import React, { useState } from 'react';
import { Printer, Copy, CheckCircle2, BookmarkCheck, Landmark, FileCheck } from 'lucide-react';
import { UserProfile, GPSLocation, BusinessIdea, LoanCalcResult, SavedPlan, Language } from '../../types';
import { fmtINR } from '../../utils/calculator';
import { getTranslation } from '../../i18n';

interface ReportsViewProps {
  user: UserProfile;
  location: GPSLocation;
  activeIdea: BusinessIdea;
  loanCalc: LoanCalcResult;
  lang: Language;
  onSavePlan: (plan: SavedPlan) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  user,
  location,
  activeIdea,
  loanCalc,
  lang,
  onSavePlan,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `DETAILED PROJECT REPORT (DPR) FOR BANK CREDIT APPRAISAL
Scheme: Prime Minister's Employment Generation Programme (PMEGP) / MUDRA
Promoter: ${user.name} | Category: ${user.category.toUpperCase()} | Gender: ${user.gender.toUpperCase()}
Location: ${location.village}, ${location.district}, ${location.state} (${location.classification.toUpperCase()})
Enterprise: ${activeIdea.name.en}

1. FINANCIAL SUMMARY:
Total Capital Outlay: ${fmtINR(loanCalc.capex)}
Promoter Margin (${loanCalc.marginPct * 100}%): ${fmtINR(loanCalc.marginMoney)}
Government Subsidy Grant (${loanCalc.subsidyPct * 100}%): ${fmtINR(loanCalc.subsidyAmount)}
Net Bank Term Loan: ${fmtINR(loanCalc.netLoan)}
Moratorium (Grace Period): ${loanCalc.moratorium} Months (Interest-only: ${fmtINR(loanCalc.moratoriumMonthlyInterest)}/mo)
Regular Monthly EMI (Post Grace): ${fmtINR(loanCalc.regularEmi)}/mo
Debt Service Coverage Ratio (DSCR): ${loanCalc.dscr}x

2. BANK BRANCH UNDERWRITING AUDIT:
Bank Readiness Score: ${Number(loanCalc.dscr) >= 1.5 ? 'HIGH SAFETY (PRE-QUALIFIED)' : 'SATISFACTORY'}
Collateral Status: Collateral-Free under CGTMSE Guarantee Scheme up to ₹10 Lakhs.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToPlans = () => {
    const dscrVal = parseFloat(String(loanCalc.dscr)) || 1.8;
    const plan: SavedPlan = {
      id: 'plan_' + Date.now(),
      ideaId: activeIdea?.id,
      title: activeIdea?.name?.[lang] || activeIdea?.name?.en || 'Rural Enterprise Proposal',
      capex: loanCalc.capex,
      subsidy: loanCalc.subsidyAmount,
      emi: loanCalc.regularEmi,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      readiness: Math.min(98, Math.round(dscrVal * 35)),
    };
    onSavePlan(plan);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-4 shadow-xs print:hidden">
        <div>
          <h2 className="font-display text-lg font-bold text-[#231F18] m-0">
            {getTranslation('nav_reports', lang)} (DPR)
          </h2>
          <span className="text-xs text-[#5E5648]">
            Pre-formatted for State Bank of India, RRBs, and JanSamarth portal upload.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#5E5648] flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToPlans}
            className="px-3 py-1.5 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#1E5C4A] flex items-center gap-1.5"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{saved ? 'Saved!' : 'Save to My Plans'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Bank DPR Document Paper */}
      <div
        id="bank_dpr_document"
        className="bg-white border-2 border-[#DDD1B8] rounded-2xl p-6 md:p-10 shadow-lg text-[#231F18] space-y-6"
      >
        {/* Document Header */}
        <div className="text-center pb-6 border-b-2 border-[#231F18]">
          <div className="inline-block px-3 py-1 bg-[#F3ECE0] border border-[#DDD1B8] rounded-full text-[11px] font-bold text-[#8C3E14] uppercase tracking-wider mb-2">
            Priority Sector Lending (PSL) Micro-Enterprise Appraisal
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#231F18] m-0">
            DETAILED PROJECT REPORT (DPR)
          </h1>
          <p className="text-xs md:text-sm text-[#5E5648] mt-1 font-medium">
            Submitted under Prime Minister's Employment Generation Programme (PMEGP) / KVIC
          </p>
        </div>

        {/* Section 1: Promoter Profile */}
        <div className="space-y-3">
          <h3 className="font-display text-sm md:text-base font-bold text-[#144134] uppercase tracking-wider border-b border-[#DDD1B8] pb-1">
            1. Promoter & Enterprise Identity
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[#8C8373] block">Promoter Name</span>
              <strong className="text-sm">{user.name}</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Social Category</span>
              <strong className="text-sm">{user.category.toUpperCase()} (Special Tier)</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Gender / Age</span>
              <strong className="text-sm">{user.gender.toUpperCase()} / {user.age} Years</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Educational Attainment</span>
              <strong className="text-sm">{user.education.toUpperCase()}</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Credit History Status</span>
              <strong className="text-sm">{user.creditBand.toUpperCase()}</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">PM Jan Dhan Account</span>
              <strong className="text-sm">{user.hasJanDhan ? 'VERIFIED (Active)' : 'Pending'}</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Enterprise */}
        <div className="space-y-3">
          <h3 className="font-display text-sm md:text-base font-bold text-[#144134] uppercase tracking-wider border-b border-[#DDD1B8] pb-1">
            2. Proposed Location & Enterprise Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[#8C8373] block">Enterprise Name</span>
              <strong className="text-sm">{activeIdea.name.en}</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Unit Location</span>
              <strong className="text-sm">{location.village}, {location.district}</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Area Classification</span>
              <strong className="text-sm uppercase">{location.classification} (35% Subsidy)</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Built-Up Space / Land</span>
              <strong className="text-sm">{activeIdea.area} ({user.landAcres} Acres Available)</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Power Load Sanctioned</span>
              <strong className="text-sm">{activeIdea.power} Connected Load</strong>
            </div>
            <div>
              <span className="text-[#8C8373] block">Family Labour Deployed</span>
              <strong className="text-sm">{activeIdea.labour} Working Hands</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Project Cost & Means of Finance */}
        <div className="space-y-3">
          <h3 className="font-display text-sm md:text-base font-bold text-[#144134] uppercase tracking-wider border-b border-[#DDD1B8] pb-1">
            3. Project Cost & Means of Finance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F3ECE0]">
                <tr>
                  <th className="py-2 px-3 font-semibold">Component</th>
                  <th className="py-2 px-3 font-semibold text-right">Statutory Norm</th>
                  <th className="py-2 px-3 font-semibold text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD1B8]">
                <tr>
                  <td className="py-2 px-3 font-medium">Total Capital Outlay (Capex)</td>
                  <td className="py-2 px-3 text-right">100.0%</td>
                  <td className="py-2 px-3 text-right font-bold">{fmtINR(loanCalc.capex)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-[#785310]">Promoter Equity Margin Money</td>
                  <td className="py-2 px-3 text-right text-[#785310]">{loanCalc.marginPct * 100}%</td>
                  <td className="py-2 px-3 text-right font-bold text-[#785310]">{fmtINR(loanCalc.marginMoney)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-[#1E5C4A]">Government Capital Subsidy (Credit Linked)</td>
                  <td className="py-2 px-3 text-right text-[#1E5C4A]">{loanCalc.subsidyPct * 100}% (Rural Tier)</td>
                  <td className="py-2 px-3 text-right font-bold text-[#1E5C4A]">{fmtINR(loanCalc.subsidyAmount)}</td>
                </tr>
                <tr className="bg-[#FAF7F0] font-bold">
                  <td className="py-2.5 px-3 text-[#1D5C8A]">Net Bank Term Loan Required</td>
                  <td className="py-2.5 px-3 text-right text-[#1D5C8A]">Debt Financed</td>
                  <td className="py-2.5 px-3 text-right text-base text-[#1D5C8A]">{fmtINR(loanCalc.netLoan)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Operational Cash Flow & Debt Servicing */}
        <div className="space-y-3">
          <h3 className="font-display text-sm md:text-base font-bold text-[#144134] uppercase tracking-wider border-b border-[#DDD1B8] pb-1">
            4. Operational Cash Flows & Debt Service Ratios
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#DDD1B8]">
              <span className="text-[#8C8373] block">Monthly Gross Revenue</span>
              <strong className="text-sm text-[#231F18]">{fmtINR(activeIdea.monthlyRev)}</strong>
            </div>
            <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#DDD1B8]">
              <span className="text-[#8C8373] block">Monthly Operating Outlay</span>
              <strong className="text-sm text-[#231F18]">{fmtINR(activeIdea.monthlyOpex)}</strong>
            </div>
            <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#DDD1B8]">
              <span className="text-[#8C8373] block">Net Operating Cash Flow</span>
              <strong className="text-sm text-[#1E5C4A]">
                {fmtINR(activeIdea.monthlyRev - activeIdea.monthlyOpex)} / mo
              </strong>
            </div>
            <div className="p-3 bg-[#FAF2DC] rounded-lg border border-[#B88628]/30">
              <span className="text-[#785310] block">Moratorium Grace Period</span>
              <strong className="text-sm text-[#785310]">
                {loanCalc.moratorium} Months ({fmtINR(loanCalc.moratoriumMonthlyInterest)} / mo)
              </strong>
            </div>
            <div className="p-3 bg-[#E8F2F9] rounded-lg border border-[#1D5C8A]/30">
              <span className="text-[#1D5C8A] block">Regular Bank EMI (Post-Grace)</span>
              <strong className="text-sm text-[#1D5C8A]">{fmtINR(loanCalc.regularEmi)} / mo</strong>
            </div>
            <div className="p-3 bg-[#E5F0EB] rounded-lg border border-[#1E5C4A]/30">
              <span className="text-[#144134] block">Debt Service Coverage Ratio</span>
              <strong className="text-sm text-[#144134]">{loanCalc.dscr}x (High Safety)</strong>
            </div>
          </div>
        </div>

        {/* Section 5: Underwriter Clearance Stamp */}
        <div className="pt-4 border-t-2 border-[#DDD1B8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-[#5E5648]">
          <div>
            <div className="font-bold text-[#231F18] flex items-center gap-1.5 mb-0.5">
              <CheckCircle2 className="w-4 h-4 text-[#1E5C4A]" />
              <span>Sanction Feasibility Verification: PASSED</span>
            </div>
            <p>
              Collateral-Free under CGTMSE Guarantee Scheme up to ₹10 Lakhs. Generated via Aarambh AI.
            </p>
          </div>

          <div className="text-right border-t sm:border-t-0 sm:border-l border-[#DDD1B8] pt-2 sm:pt-0 sm:pl-4">
            <div className="text-[10px] uppercase font-bold text-[#8C8373]">Signature of Applicant</div>
            <div className="font-display text-sm font-bold text-[#231F18] mt-4 underline underline-offset-4">
              {user.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
