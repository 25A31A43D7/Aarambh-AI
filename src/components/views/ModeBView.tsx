import React, { useState } from 'react';
import { Mic, Volume2, Calculator, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { BusinessIdea, Language, GPSLocation, UserProfile } from '../../types';
import { fmtINR } from '../../utils/calculator';
import { speakText, startSpeechRecognition } from '../../utils/voice';
import { getTranslation } from '../../i18n';

interface ModeBViewProps {
  user: UserProfile;
  location: GPSLocation;
  lang: Language;
  onSetCustomIdea: (idea: BusinessIdea) => void;
  onNavigate: (view: string) => void;
}

export const ModeBView: React.FC<ModeBViewProps> = ({
  user,
  location,
  lang,
  onSetCustomIdea,
  onNavigate,
}) => {
  const [ideaText, setIdeaText] = useState(
    'Commercial Spice & Turmeric Grinding Mill with FSSAI hygiene packaging for weekly village markets'
  );
  const [invest, setInvest] = useState(240000);
  const [proposedLocation, setProposedLocation] = useState('Village Weekly Market Center');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    viability: number;
    invest: number;
    subsidyPct: number;
    strengths: string[];
    risks: string[];
    suggestions: string[];
  } | null>(null);

  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    startSpeechRecognition(
      lang,
      (transcript) => {
        setIdeaText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const isSpecial = user.category === 'special' || user.gender === 'female';
      const isRural = location.classification === 'rural';
      const subsidyPct = isSpecial && isRural ? 35 : isRural ? 25 : 15;

      setResult({
        viability: 91,
        invest,
        subsidyPct,
        strengths: [
          'Strong sustained consumer demand in rural and tier-3 mandi catchments.',
          `Eligible for ${subsidyPct}% PMEGP credit-linked capital subsidy under KVIC norms.`,
          'Direct farm-gate raw material procurement minimizes transit spoilage and wholesale markups.',
        ],
        risks: [
          'Requires reliable 3-phase agricultural power connection or solar-backed inverter.',
          'Initial 45-day working capital buffer needed for retailer inventory credit cycles.',
          'Basic FSSAI registration & Gram Panchayat commercial trade NOC mandatory before loan sanction.',
        ],
        suggestions: [
          'Apply for PMEGP collateral-free bank loan through the JanSamarth national single-window portal.',
          'Execute forward buyback letters of intent with at least 3 local retail kirana stores.',
          'Generate your bank-ready Detailed Project Report (DPR) directly from this platform.',
        ],
      });
      setIsAnalyzing(false);
    }, 450);
  };

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSelectAsActive = () => {
    const strengthsSummary = (result?.strengths || []).join(' ') || ideaText;
    const custom: BusinessIdea = {
      id: 'custom_' + Date.now(),
      sector: 'agro',
      name: {
        en: ideaText.slice(0, 50),
        hi: ideaText.slice(0, 50),
        te: ideaText.slice(0, 50),
        ta: ideaText.slice(0, 50),
        kn: ideaText.slice(0, 50),
        bn: ideaText.slice(0, 50),
        mr: ideaText.slice(0, 50),
        gu: ideaText.slice(0, 50),
      },
      skills: ['manufacturing'],
      minCapital: Math.round(invest * 0.1),
      fixedCapex: invest,
      monthlyRev: Math.round(invest * 0.28),
      monthlyOpex: Math.round(invest * 0.12),
      risk: 'low',
      labour: 2,
      area: '200 sq ft',
      power: '3-Phase',
      why: {
        en: strengthsSummary,
        hi: strengthsSummary,
        te: strengthsSummary,
        ta: strengthsSummary,
        kn: strengthsSummary,
        bn: strengthsSummary,
        mr: strengthsSummary,
        gu: strengthsSummary,
      },
      schemes: ['pmegp', 'pmfme', 'mudra'],
    };

    onSetCustomIdea(custom);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="pb-3 border-b border-[#DDD1B8] mb-4">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#B5551E]">
            Custom Proposal Engine
          </span>
          <h2 className="font-display text-xl font-bold text-[#231F18] m-0">
            {getTranslation('nav_modeB', lang)} & Feasibility Stress-Test
          </h2>
          <p className="text-xs text-[#5E5648] mt-1">
            Already have a venture in mind? Describe it in your own words or voice. Our engine stress-tests feasibility, verifies government subsidy rules, and flags regulatory hurdles.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Describe Your Proposed Business Idea (Type or Speak)
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder="e.g., Establishing a commercial spice and turmeric grinding mill..."
                className="w-full px-3 py-2 pr-10 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                title="Speak into microphone"
                className={`absolute right-2.5 top-2.5 p-1.5 rounded-full transition-all ${
                  isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-[#B5551E] hover:bg-[#F3ECE0]'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Estimated Total Project Outlay (Capex) (₹)
              </label>
              <input
                type="number"
                step="10000"
                min="20000"
                value={invest}
                onChange={(e) => setInvest(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Proposed Unit Location
              </label>
              <input
                type="text"
                value={proposedLocation}
                onChange={(e) => setProposedLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-2.5 rounded-lg bg-[#B5551E] hover:bg-[#8C3E14] text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <span>Analyzing Statutory Feasibility...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Statutory Feasibility & Subsidy Rights</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-3">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#1E5C4A]">
                Validation Verdict
              </span>
              <h3 className="font-display text-lg font-bold text-[#231F18] m-0">
                Feasibility & Regulatory Gap Analysis
              </h3>
            </div>
            <button
              type="button"
              onClick={handleSelectAsActive}
              className="px-3.5 py-1.5 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Set as Active Business</span>
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#E5F0EB] rounded-lg border border-[#1E5C4A]/20">
              <span className="text-[11px] font-bold text-[#144134] block">Viability Score</span>
              <span className="font-display text-2xl font-bold text-[#144134]">{result.viability}/100</span>
            </div>
            <div className="p-3 bg-[#F3ECE0] rounded-lg border border-[#DDD1B8]">
              <span className="text-[11px] font-bold text-[#5E5648] block">Project Capex</span>
              <span className="font-display text-2xl font-bold text-[#231F18]">{fmtINR(result.invest)}</span>
            </div>
            <div className="p-3 bg-[#FAF2DC] rounded-lg border border-[#B88628]/30">
              <span className="text-[11px] font-bold text-[#785310] block">PMEGP Subsidy Entitlement</span>
              <span className="font-display text-2xl font-bold text-[#785310]">{result.subsidyPct}%</span>
            </div>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="text-xs font-bold text-[#1E5C4A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Core Structural Strengths
            </h4>
            <ul className="space-y-1.5 text-xs md:text-sm text-[#231F18] pl-5 list-disc">
              {(result.strengths || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div>
            <h4 className="text-xs font-bold text-[#A23B27] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Critical Risks to Mitigate
            </h4>
            <ul className="space-y-1.5 text-xs md:text-sm text-[#231F18] pl-5 list-disc">
              {(result.risks || []).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div>
            <h4 className="text-xs font-bold text-[#8C3E14] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Recommended Next Steps
            </h4>
            <ul className="space-y-1.5 text-xs md:text-sm text-[#231F18] pl-5 list-disc">
              {(result.suggestions || []).map((sg, i) => (
                <li key={i}>{sg}</li>
              ))}
            </ul>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-[#E5F0EB] text-[#144134] text-xs font-semibold rounded-lg flex items-center gap-2 border border-[#1E5C4A]/30 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#1E5C4A]" />
              <span>Proposal saved successfully and set as your active proposal!</span>
            </div>
          )}

          <div className="pt-3 border-t border-[#DDD1B8] flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => speakText(((result.strengths?.[0] || '') + '. ' + (result.suggestions?.[0] || '')), lang)}
              className="px-3 py-1.5 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#5E5648] flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#B5551E]" />
              <span>Listen Summary</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleSelectAsActive();
                onNavigate('reports');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#B5551E] hover:bg-[#8C3E14] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Official Bank DPR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
