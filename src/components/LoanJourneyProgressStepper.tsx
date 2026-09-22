import React, { useState } from 'react';
import {
  Check,
  Compass,
  Calculator,
  ShieldCheck,
  FileSpreadsheet,
  Building2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  Landmark,
} from 'lucide-react';
import { UserProfile, GPSLocation, BusinessIdea, LoanCalcResult, Language } from '../types';
import { fmtINR } from '../utils/calculator';

export interface LoanStage {
  id: 'ideation' | 'feasibility' | 'subsidy' | 'dpr' | 'submission';
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'upcoming';
  badge: string;
  icon: React.ElementType;
  targetView: string;
  description: string;
  requiredAction: string;
  keyOutputs: string[];
}

interface LoanJourneyProgressStepperProps {
  user: UserProfile;
  location: GPSLocation;
  activeIdea?: BusinessIdea;
  loanCalc: LoanCalcResult;
  onNavigate: (view: string) => void;
  lang?: Language;
}

export const LoanJourneyProgressStepper: React.FC<LoanJourneyProgressStepperProps> = ({
  user,
  location,
  activeIdea,
  loanCalc,
  onNavigate,
  lang = 'en',
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('subsidy');

  const ideaName = activeIdea?.name?.en || 'Agro-Processing Unit';
  const capexAmount = fmtINR(loanCalc.capex || activeIdea?.fixedCapex || 220000);
  const subsidyAmount = fmtINR(loanCalc.subsidyAmount || Math.round(loanCalc.capex * 0.35));
  const promoterMarginAmount = fmtINR(loanCalc.marginMoney || Math.round(loanCalc.capex * 0.05));
  const netLoanAmount = fmtINR(loanCalc.netLoan || (loanCalc.capex - (loanCalc.marginMoney || 0)));
  const dscrStr = typeof loanCalc.dscr === 'number' ? (loanCalc.dscr as number).toFixed(2) : String(loanCalc.dscr || '2.10');

  // Determine stage configurations
  const stages: LoanStage[] = [
    {
      id: 'ideation',
      title: '1. Ideation',
      subtitle: 'Opportunity Discovery',
      status: 'completed',
      badge: 'Cluster Matched',
      icon: Compass,
      targetView: 'modeA',
      description: `Matched to local raw materials and APMC market demand in ${location.district} (${location.state}).`,
      requiredAction: 'Review or change recommended enterprise idea',
      keyOutputs: [
        `Enterprise Selected: ${ideaName}`,
        `Sector: ${activeIdea?.sector || 'Agro-Processing'}`,
        'High Market Demand Index (88/100)',
      ],
    },
    {
      id: 'feasibility',
      title: '2. Feasibility',
      subtitle: 'Unit Economics & Capex',
      status: 'completed',
      badge: `${capexAmount} Project`,
      icon: Calculator,
      targetView: 'calc',
      description: `Machinery, working capital, and break-even capacity modeled for ${ideaName}.`,
      requiredAction: 'Adjust Capex or operational assumptions',
      keyOutputs: [
        `Total Capex: ${capexAmount}`,
        `Promoter Margin: ${promoterMarginAmount} (5%)`,
        'Monthly Break-Even: 48.2% capacity',
      ],
    },
    {
      id: 'subsidy',
      title: '3. Subsidy & Eligibility',
      subtitle: 'RBI & PMEGP Qualification',
      status: 'current',
      badge: '35% Rural Subsidy',
      icon: ShieldCheck,
      targetView: 'calc',
      description: `Verified under 50% FOIR household debt benchmark and KVIC special category rural parameters.`,
      requiredAction: 'Run Loan Eligibility Quick-Checker to confirm household borrowing headroom',
      keyOutputs: [
        `Eligible Capital Grant: ${subsidyAmount}`,
        'FOIR Debt Ceiling: 50.0% Max',
        'CGTMSE Collateral-Free Cover: ₹10 Lakhs',
      ],
    },
    {
      id: 'dpr',
      title: '4. Bank Appraisal',
      subtitle: 'DPR & 60-Mo Schedule',
      status: 'upcoming',
      badge: `DSCR ${dscrStr}x Safe`,
      icon: FileSpreadsheet,
      targetView: 'reports',
      description: `Comprehensive 60-month amortization schedule, sensitivity stress tests, and Credit Officer briefing.`,
      requiredAction: 'Generate and download official multi-page Bank Appraisal Dossier (PDF)',
      keyOutputs: [
        `Net Bank Term Loan: ${netLoanAmount}`,
        '6-Month Moratorium Buffer Included',
        `DSCR: ${dscrStr}x (RBI Benchmark > 1.50x)`,
      ],
    },
    {
      id: 'submission',
      title: '5. Document Submission',
      subtitle: 'Lead Bank & JanSamarth',
      status: 'upcoming',
      badge: 'Branch Desk Ready',
      icon: Building2,
      targetView: 'local',
      description: `Identify nearest Lead Bank or Regional Rural Bank (RRB) branch for physical & JanSamarth portal submission.`,
      requiredAction: 'Locate nearest branch via Branch Finder & assemble required KYC documentation',
      keyOutputs: [
        'Lead Bank: SBI & Regional Rural Bank',
        'Physical Dossier Submission (3 hard copies)',
        'JanSamarth Portal Tracking Reference',
      ],
    },
  ];

  // Calculate overall percentage completion
  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const currentProgressPct = Math.round(((completedCount + 0.5) / stages.length) * 100);

  const activeStage = stages.find((s) => s.id === selectedStageId) || stages[2];

  return (
    <div className="bg-[#FFFDF8] border-2 border-[#DDD1B8] rounded-2xl p-5 md:p-6 shadow-md space-y-5">
      {/* Header & Overall Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E5C4A]/10 text-[#1E5C4A] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#231F18] m-0">
                Rural Enterprise Loan Application Journey
              </h3>
              <p className="text-xs text-[#5E5648] m-0">
                End-to-end guided roadmap from business ideation to branch manager sanction.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-[#1E5C4A] bg-[#E5F0EB] px-2.5 py-1 rounded-full border border-[#1E5C4A]/30">
              {currentProgressPct}% Completed (Stage 3 of 5)
            </span>
          </div>
        </div>

        {/* Visual Continuous Progress Line */}
        <div className="w-full bg-[#EAE0CE] h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1E5C4A] via-[#2F856A] to-[#B5551E] rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${currentProgressPct}%` }}
          />
        </div>
      </div>

      {/* Stepper Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isSelected = selectedStageId === stage.id;
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSelectedStageId(stage.id)}
              className={`p-3 rounded-xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#1E5C4A] shadow-md ring-2 ring-[#1E5C4A]/20'
                  : isCurrent
                  ? 'bg-[#FFF9F2] border-[#B5551E] shadow-xs'
                  : isCompleted
                  ? 'bg-[#FAF7F0] border-[#DDD1B8] hover:border-[#1E5C4A]'
                  : 'bg-white border-[#DDD1B8] hover:border-[#8C8373] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompleted
                      ? 'bg-[#1E5C4A] text-white'
                      : isCurrent
                      ? 'bg-[#B5551E] text-white animate-pulse'
                      : 'bg-[#EAE0CE] text-[#5E5648]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-[#E5F0EB] text-[#1E5C4A]'
                      : isCurrent
                      ? 'bg-[#FFF2EB] text-[#8C3E14]'
                      : 'bg-[#F3ECE0] text-[#8C8373]'
                  }`}
                >
                  {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Next'}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#231F18] m-0 line-clamp-1">{stage.title}</h4>
                <p className="text-[10px] text-[#5E5648] m-0 mt-0.5 line-clamp-1">{stage.subtitle}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-[#DDD1B8]/60 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#8C3E14] truncate">{stage.badge}</span>
                <ChevronRight className="w-3 h-3 text-[#8C8373] shrink-0" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Interactive Detail Card */}
      <div className="p-4 md:p-5 rounded-xl bg-gradient-to-r from-[#FAF7F0] to-[#F3ECE0] border border-[#DDD1B8] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#DDD1B8]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1E5C4A] text-white flex items-center justify-center text-xs font-bold">
              <activeStage.icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1E5C4A] tracking-wider block">
                Stage Detail Focus
              </span>
              <strong className="text-xs sm:text-sm font-bold text-[#231F18]">
                {activeStage.title} — {activeStage.subtitle}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(activeStage.targetView)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>Open {activeStage.title.split('.')[1]} Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          {/* Description & Action */}
          <div className="md:col-span-7 space-y-2">
            <p className="text-[#5E5648] text-xs leading-relaxed m-0">{activeStage.description}</p>
            <div className="p-2.5 bg-white rounded-lg border border-[#DDD1B8]">
              <span className="text-[10px] font-bold text-[#8C3E14] uppercase tracking-wider block mb-0.5">
                Next Recommended Action:
              </span>
              <span className="text-[11px] font-semibold text-[#231F18] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#B88628] shrink-0" />
                <span>{activeStage.requiredAction}</span>
              </span>
            </div>
          </div>

          {/* Key Outputs List */}
          <div className="md:col-span-5 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-[#8C8373] tracking-wider block">
              Verified Dossier Assets:
            </span>
            <div className="space-y-1">
              {activeStage.keyOutputs.map((out, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-[11px] text-[#231F18] bg-white/80 px-2.5 py-1 rounded border border-[#DDD1B8]"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#1E5C4A] shrink-0" />
                  <span className="truncate">{out}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
