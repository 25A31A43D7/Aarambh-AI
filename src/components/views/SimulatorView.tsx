import React, { useState } from 'react';
import { SlidersHorizontal, AlertTriangle, ShieldCheck, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';
import { BusinessIdea, LoanCalcResult, Language } from '../../types';
import { fmtINR } from '../../utils/calculator';
import { getTranslation } from '../../i18n';

interface SimulatorViewProps {
  activeIdea: BusinessIdea;
  loanCalc: LoanCalcResult;
  lang: Language;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  activeIdea,
  loanCalc,
  lang,
}) => {
  const [costShock, setCostShock] = useState<number>(0); // -20% to +40%
  const [priceChange, setPriceChange] = useState<number>(0); // -30% to +30%
  const [demandDrop, setDemandDrop] = useState<number>(0); // -50% to +30%
  const [rateShock, setRateShock] = useState<number>(9.5); // 7% to 15%
  const [monsoonShock, setMonsoonShock] = useState<number>(0); // 0 to 3 months

  // Baseline figures
  const baseRev = activeIdea.monthlyRev || 85000;
  const baseOpex = activeIdea.monthlyOpex || 40000;
  const baseEmi = loanCalc.regularEmi || 5500;

  // Adjusted figures
  const simRev = Math.max(0, Math.round(baseRev * (1 + priceChange / 100) * (1 + demandDrop / 100)));
  const simOpex = Math.round(baseOpex * (1 + costShock / 100));

  // Approx adjusted EMI if rate changes
  const rateRatio = rateShock / 9.5;
  const simEmi = Math.round(baseEmi * (0.85 + 0.15 * rateRatio));

  const simNetProfit = simRev - simOpex - simEmi;
  const simDscr = simEmi > 0 ? parseFloat(((simRev - simOpex) / simEmi).toFixed(2)) : 3.0;

  const isDistressed = simDscr < 1.1 || simNetProfit < 0;
  const isHealthy = simDscr >= 1.5 && simNetProfit > 15000;

  const resetDefaults = () => {
    setCostShock(0);
    setPriceChange(0);
    setDemandDrop(0);
    setRateShock(9.5);
    setMonsoonShock(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-2 mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#B88628]">
              Rural Risk Stress Testing
            </span>
            <h2 className="font-display text-xl font-bold text-[#231F18] m-0">
              {getTranslation('nav_sim', lang)} — Weather, Price & Supply Shocks
            </h2>
            <p className="text-xs text-[#5E5648] mt-1">
              Test whether your enterprise can service bank EMIs during bad seasons, drought, inflation, or sudden demand collapses.
            </p>
          </div>
          <button
            type="button"
            onClick={resetDefaults}
            className="px-3 py-1.5 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#5E5648] self-start sm:self-auto"
          >
            Reset Stress Scenarios
          </button>
        </div>

        {/* 5 Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {/* Slider 1: Raw Material Spike */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#5E5648] mb-1">
              <span>Raw Material Cost Shock</span>
              <span className={`font-bold ${costShock > 0 ? 'text-[#A23B27]' : 'text-[#1E5C4A]'}`}>
                {costShock > 0 ? `+${costShock}%` : `${costShock}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="5"
              value={costShock}
              onChange={(e) => setCostShock(Number(e.target.value))}
              className="w-full accent-[#B5551E] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C8373] mt-0.5">
              <span>-20% Deflation</span>
              <span>Baseline</span>
              <span>+40% Drought / Fuel Spike</span>
            </div>
          </div>

          {/* Slider 2: Product Selling Price */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#5E5648] mb-1">
              <span>Market Selling Price Shift</span>
              <span className={`font-bold ${priceChange >= 0 ? 'text-[#1E5C4A]' : 'text-[#A23B27]'}`}>
                {priceChange > 0 ? `+${priceChange}%` : `${priceChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full accent-[#B5551E] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C8373] mt-0.5">
              <span>-30% Mandi Crash</span>
              <span>Baseline</span>
              <span>+30% Premium Pricing</span>
            </div>
          </div>

          {/* Slider 3: Demand / Offtake Volume Drop */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#5E5648] mb-1">
              <span>Customer Demand / Sales Volume</span>
              <span className={`font-bold ${demandDrop >= 0 ? 'text-[#1E5C4A]' : 'text-[#A23B27]'}`}>
                {demandDrop > 0 ? `+${demandDrop}%` : `${demandDrop}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="30"
              step="5"
              value={demandDrop}
              onChange={(e) => setDemandDrop(Number(e.target.value))}
              className="w-full accent-[#B5551E] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C8373] mt-0.5">
              <span>-50% Lean Months</span>
              <span>Baseline</span>
              <span>+30% Festive Surge</span>
            </div>
          </div>

          {/* Slider 4: Bank Lending Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#5E5648] mb-1">
              <span>Bank Lending Rate</span>
              <span className="font-bold text-[#1D5C8A]">{rateShock}% p.a.</span>
            </div>
            <input
              type="range"
              min="7.0"
              max="15.0"
              step="0.5"
              value={rateShock}
              onChange={(e) => setRateShock(Number(e.target.value))}
              className="w-full accent-[#1D5C8A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C8373] mt-0.5">
              <span>7% PSL Concession</span>
              <span>9.5% Base</span>
              <span>15% Commercial Non-Priority</span>
            </div>
          </div>
        </div>

        {/* Dynamic Stress Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
          <div className="p-3.5 bg-[#F3ECE0] rounded-xl border border-[#DDD1B8]">
            <span className="text-[11px] font-semibold text-[#5E5648] block">Simulated Monthly Sales</span>
            <span className="font-display text-2xl font-bold text-[#231F18]">{fmtINR(simRev)}</span>
            <span className="text-[10px] text-[#8C8373] block mt-0.5">Base: {fmtINR(baseRev)}</span>
          </div>

          <div className="p-3.5 bg-[#F3ECE0] rounded-xl border border-[#DDD1B8]">
            <span className="text-[11px] font-semibold text-[#5E5648] block">Operating Expenses (Opex)</span>
            <span className="font-display text-2xl font-bold text-[#231F18]">{fmtINR(simOpex)}</span>
            <span className="text-[10px] text-[#8C8373] block mt-0.5">Base: {fmtINR(baseOpex)}</span>
          </div>

          <div
            className={`p-3.5 rounded-xl border ${
              simNetProfit > 0
                ? 'bg-[#E5F0EB] border-[#1E5C4A]/30 text-[#144134]'
                : 'bg-[#FDEBE8] border-[#A23B27]/30 text-[#A23B27]'
            }`}
          >
            <span className="text-[11px] font-semibold block">Net Surplus After EMI</span>
            <span className="font-display text-2xl font-bold">
              {fmtINR(simNetProfit)}
            </span>
            <span className="text-[10px] block mt-0.5">EMI: {fmtINR(simEmi)}/mo</span>
          </div>

          <div
            className={`p-3.5 rounded-xl border ${
              isHealthy
                ? 'bg-[#DEEAE3] border-[#1E5C4A]/30 text-[#144134]'
                : isDistressed
                ? 'bg-[#FDEBE8] border-[#A23B27]/30 text-[#A23B27]'
                : 'bg-[#FAF2DC] border-[#B88628]/30 text-[#785310]'
            }`}
          >
            <span className="text-[11px] font-semibold block">Stressed DSCR Ratio</span>
            <span className="font-display text-2xl font-bold">
              {simDscr}x
            </span>
            <span className="text-[10px] block mt-0.5">
              {isHealthy ? 'Safe (>1.5x)' : isDistressed ? 'Default Danger (<1.1x)' : 'Borderline'}
            </span>
          </div>
        </div>

        {/* Advisory Verdict Banner */}
        <div
          className={`p-4 rounded-xl border text-xs md:text-sm leading-relaxed ${
            isHealthy
              ? 'bg-[#DEEAE3] border-[#1E5C4A]/30 text-[#144134]'
              : isDistressed
              ? 'bg-[#FDEBE8] border-[#A23B27]/30 text-[#A23B27]'
              : 'bg-[#FAF2DC] border-[#B88628]/30 text-[#785310]'
          }`}
        >
          {isHealthy ? (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Resilient Financial Buffer:</strong> Even under these stressed conditions, your venture maintains a Debt Service Coverage Ratio of <strong>{simDscr}x</strong> and generates a monthly net cash surplus of <strong>{fmtINR(simNetProfit)}</strong>. This demonstrates high loan underwriting safety to prospective bank branch managers.
              </div>
            </div>
          ) : isDistressed ? (
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>High Vulnerability Detected:</strong> Under this stress scenario, cash flow is insufficient to service monthly EMIs comfortably (DSCR falls to <strong>{simDscr}x</strong>). Recommendation: Maintain a <strong>3-month liquid reserve buffer ({fmtINR(simEmi * 3)})</strong> in an emergency fixed deposit before launching operations.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Moderate Tightness:</strong> Debt service is borderline. Ensure you negotiate a <strong>6-month moratorium grace period</strong> with the bank to build up working capital buffers during the startup ramp-up phase.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
