import React, { useState } from 'react';
import { Mic, Volume2, Calculator, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { BusinessIdea, Language, GPSLocation } from '../../types';
import { BUSINESS_KB } from '../../data/knowledge';
import { fmtINR } from '../../utils/calculator';
import { speakText, startSpeechRecognition, isSpeechSupported } from '../../utils/voice';
import { getTranslation } from '../../i18n';

interface ModeAViewProps {
  lang: Language;
  location: GPSLocation;
  selectedIdea: BusinessIdea;
  onSelectIdea: (idea: BusinessIdea) => void;
  onNavigate: (view: string) => void;
}

export const ModeAView: React.FC<ModeAViewProps> = ({
  lang,
  location,
  selectedIdea,
  onSelectIdea,
  onNavigate,
}) => {
  const [sector, setSector] = useState<string>('all');
  const [capital, setCapital] = useState<number>(75000);
  const [land, setLand] = useState<number>(0.5);
  const [labour, setLabour] = useState<number>(2);
  const [equipment, setEquipment] = useState<string>('Single phase power, 200 sq ft backyard shed');
  const [classification, setClassification] = useState<'rural' | 'semiurban' | 'urban'>(location.classification);

  const [isListening, setIsListening] = useState(false);
  const [hasDiscovered, setHasDiscovered] = useState(true);

  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    startSpeechRecognition(
      lang,
      (transcript) => {
        setEquipment((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  // Filter ideas based on sector and capital
  const matchedIdeas = BUSINESS_KB.filter((b) => {
    if (sector !== 'all' && b.sector !== sector) return false;
    return true;
  }).sort((a, b) => {
    // Sort by proximity of minCapital to user capital
    const diffA = Math.abs(a.minCapital - capital);
    const diffB = Math.abs(b.minCapital - capital);
    return diffA - diffB;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Search Criteria Card */}
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="pb-3 border-b border-[#DDD1B8] mb-4">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#1E5C4A]">
            Resource-Based Discovery Engine
          </span>
          <h2 className="font-display text-xl font-bold text-[#231F18] m-0">
            {getTranslation('nav_modeA', lang)} — Matched to Local Assets
          </h2>
          <p className="text-xs text-[#5E5648] mt-1">
            Input what you have (savings, land, family members) to reveal the highest-yield micro-enterprises with maximum government subsidy support.
          </p>
        </div>

        {/* Sector Chips */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#5E5648] mb-1.5">
            Select Preferred Enterprise Sector
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Sectors' },
              { id: 'agro', label: '🌾 Agro & Food Processing' },
              { id: 'dairy', label: '🐄 Dairy & Livestock' },
              { id: 'green', label: '⚡ Solar & EV Transport' },
              { id: 'crafts', label: '🛠️ Crafts & Manufacturing' },
              { id: 'services', label: '📱 Digital & Rural Services' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSector(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  sector === s.id
                    ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]'
                    : 'bg-white text-[#5E5648] border-[#DDD1B8] hover:border-[#1E5C4A]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Your Ready Cash / Own Savings (₹)
            </label>
            <input
              type="number"
              min="10000"
              step="5000"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Land Available (Acres)
            </label>
            <input
              type="number"
              step="0.25"
              min="0"
              value={land}
              onChange={(e) => setLand(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            />
          </div>
        </div>

        {/* Space, Shed, or Machinery with Voice Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#5E5648] mb-1">
            Available Space, Shed, or Machinery (Type or Speak)
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full px-3 py-2 pr-10 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Family Working Hands
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={labour}
              onChange={(e) => setLabour(Number(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Location Tier Classification
            </label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value as 'rural' | 'semiurban' | 'urban')}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            >
              <option value="rural">Rural / Village (35% PMEGP Subsidy)</option>
              <option value="semiurban">Semi-Urban / Mandal HQ</option>
              <option value="urban">Urban / District Center (15% Subsidy)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHasDiscovered(true)}
          className="w-full py-2.5 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <span>Discover Matched Opportunities</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Matched Opportunities List */}
      {hasDiscovered && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-[#231F18] m-0">
              Matched High-Yield Rural Ventures ({matchedIdeas.length})
            </h3>
            <span className="text-xs text-[#5E5648]">
              Ground-truthed for {location.district}, {location.state}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(matchedIdeas || []).map((idea) => {
              const isSelected = selectedIdea?.id === idea.id;
              const title = idea?.name?.[lang] || idea?.name?.en || 'Enterprise';
              const reason = idea?.why?.[lang] || idea?.why?.en || '';

              return (
                <div
                  key={idea.id}
                  className={`bg-[#FFFDF8] border rounded-xl p-5 transition-all shadow-xs ${
                    isSelected ? 'border-[#1E5C4A] ring-2 ring-[#1E5C4A]/20' : 'border-[#DDD1B8] hover:border-[#1E5C4A]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="font-display text-base md:text-lg font-bold text-[#231F18] m-0">
                      {title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onSelectIdea(idea)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 self-start sm:self-auto ${
                        isSelected
                          ? 'bg-[#1E5C4A] text-white'
                          : 'border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-[#231F18]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Selected Business</span>
                        </>
                      ) : (
                        <span>Select Business</span>
                      )}
                    </button>
                  </div>

                  {/* Financial & Requirement Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        idea.risk === 'low'
                          ? 'bg-[#DEEAE3] text-[#144134]'
                          : idea.risk === 'medium'
                          ? 'bg-[#FAF2DC] text-[#785310]'
                          : 'bg-[#FDEBE8] text-[#A23B27]'
                      }`}
                    >
                      {idea.risk.toUpperCase()} RISK
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3ECE0] text-[#5E5648]">
                      Capex: <strong>{fmtINR(idea.fixedCapex)}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F0EB] text-[#144134]">
                      Est. Profit: <strong>{fmtINR(idea.monthlyRev - idea.monthlyOpex)} / mo</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F3ECE0] text-[#5E5648]">
                      Space: {idea.area}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F3ECE0] text-[#5E5648]">
                      Power: {idea.power}
                    </span>
                  </div>

                  {/* Why it fits */}
                  <p className="text-xs md:text-sm text-[#231F18] leading-relaxed mb-4">
                    <strong>Why this fits:</strong> {reason}
                  </p>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#DDD1B8] flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakText(`${title}. ${reason}`, lang)}
                      className="px-2.5 py-1 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#5E5648] flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#B5551E]" />
                      <span>Listen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectIdea(idea);
                        onNavigate('calc');
                      }}
                      className="px-3 py-1 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#231F18] flex items-center gap-1"
                    >
                      <Calculator className="w-3.5 h-3.5 text-[#B88628]" />
                      <span>Loan & Moratorium</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectIdea(idea);
                        onNavigate('reports');
                      }}
                      className="px-3 py-1 rounded-lg bg-[#B5551E] hover:bg-[#8C3E14] text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generate Bank DPR</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
