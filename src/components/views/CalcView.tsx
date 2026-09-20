import React, { useState } from 'react';
import { Calculator, Table, PieChart, CheckCircle2, Download, ArrowDownToLine } from 'lucide-react';
import { LoanCalcResult, BusinessIdea, UserProfile, GPSLocation, Language } from '../../types';
import { calculateLoanWithMoratorium, fmtINR } from '../../utils/calculator';
import { getTranslation } from '../../i18n';

interface CalcViewProps {
  user: UserProfile;
  location: GPSLocation;
  activeIdea: BusinessIdea;
  lang: Language;
}

export const CalcView: React.FC<CalcViewProps> = ({
  user,
  location,
  activeIdea,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'emi' | 'schedule' | 'be'>('emi');

  const [capex, setCapex] = useState<number>(activeIdea.fixedCapex || 220000);
  const [rate, setRate] = useState<number>(9.5);
  const [tenure, setTenure] = useState<number>(60);
  const [moratorium, setMoratorium] = useState<number>(6);
  const [capitalize, setCapitalize] = useState<boolean>(false);

  // Break Even
  const [fixedOverhead, setFixedOverhead] = useState<number>(12000);
  const [sellingPrice, setSellingPrice] = useState<number>(65);
  const [unitCost, setUnitCost] = useState<number>(38);

  const isSpecial = user.category === 'special' || user.gender === 'female';
  const isRural = location.classification === 'rural';

  const result: LoanCalcResult = calculateLoanWithMoratorium(
    capex,
    isSpecial,
    isRural,
    rate,
    tenure,
    moratorium,
    capitalize
  );

  // Break-even
  const marginPerUnit = sellingPrice - unitCost;
  const breakEvenUnits = marginPerUnit > 0 ? Math.ceil(fixedOverhead / marginPerUnit) : 0;
  const breakEvenRev = breakEvenUnits * sellingPrice;

  const handleSyncWithIdea = () => {
    setCapex(activeIdea.fixedCapex);
  };

  const handleExportScheduleCsv = () => {
    const headers = ['Month', 'Phase', 'Opening Balance (₹)', 'Principal Repaid (₹)', 'Interest Paid (₹)', 'Total EMI (₹)', 'Closing Balance (₹)'];
    const rows = (result?.schedule || []).map((r) => [
      `M${r.month}`,
      r.phase,
      r.opening,
      r.principal,
      r.interest,
      r.total,
      r.closing,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Amortization_Schedule_${activeIdea?.id || 'loan'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-3 mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#B5551E]">
              Banking Debt Architecture
            </span>
            <h2 className="font-display text-xl font-bold text-[#231F18] m-0">
              {getTranslation('nav_calc', lang)} & Grace-Period Economics
            </h2>
            <p className="text-xs text-[#5E5648] mt-1">
              Statutory PMEGP subsidy computation, 3 to 12 month moratorium grace period, and Debt Service Coverage Ratio (DSCR).
            </p>
          </div>
          <button
            type="button"
            onClick={handleSyncWithIdea}
            className="px-3 py-1.5 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#8C3E14] self-start sm:self-auto transition-all"
          >
            📥 Import Active Capex ({fmtINR(activeIdea.fixedCapex)})
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-[#DDD1B8] gap-4 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('emi')}
            className={`pb-2 text-xs md:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'emi'
                ? 'border-[#B5551E] text-[#8C3E14]'
                : 'border-transparent text-[#5E5648] hover:text-[#231F18]'
            }`}
          >
            Loan & Moratorium EMI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`pb-2 text-xs md:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'schedule'
                ? 'border-[#B5551E] text-[#8C3E14]'
                : 'border-transparent text-[#5E5648] hover:text-[#231F18]'
            }`}
          >
            Full Amortization Table ({result.schedule.length} Months)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('be')}
            className={`pb-2 text-xs md:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'be'
                ? 'border-[#B5551E] text-[#8C3E14]'
                : 'border-transparent text-[#5E5648] hover:text-[#231F18]'
            }`}
          >
            Break-Even Sales Economics
          </button>
        </div>

        {/* TAB 1: LOAN & MORATORIUM EMI */}
        {activeTab === 'emi' && (
          <div className="space-y-5">
            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                  Project Cost (Capex) (₹)
                </label>
                <input
                  type="number"
                  step="10000"
                  min="10000"
                  value={capex}
                  onChange={(e) => setCapex(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                  Bank Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="4"
                  max="18"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value) || 9.5)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                  Total Loan Tenure (Months)
                </label>
                <select
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                >
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years - Standard)</option>
                  <option value={84}>84 Months (7 Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                  Moratorium Grace Period
                </label>
                <select
                  value={moratorium}
                  onChange={(e) => setMoratorium(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                >
                  <option value={0}>0 Months (Immediate EMI)</option>
                  <option value={3}>3 Months Grace</option>
                  <option value={6}>6 Months Grace (Standard)</option>
                  <option value={9}>9 Months Grace</option>
                  <option value={12}>12 Months Grace</option>
                </select>
              </div>
            </div>

            {/* 4 Primary Output Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#FAF2DC] rounded-xl border border-[#B88628]/30">
                <span className="text-[11px] text-[#785310] font-semibold block">
                  Promoter Margin ({result.marginPct * 100}%)
                </span>
                <span className="font-display text-2xl font-bold text-[#785310]">
                  {fmtINR(result.marginMoney)}
                </span>
                <span className="text-[10px] text-[#785310] block mt-0.5">Your required cash</span>
              </div>

              <div className="p-3.5 bg-[#E5F0EB] rounded-xl border border-[#1E5C4A]/30">
                <span className="text-[11px] text-[#144134] font-semibold block">
                  Govt Subsidy ({result.subsidyPct * 100}%)
                </span>
                <span className="font-display text-2xl font-bold text-[#144134]">
                  {fmtINR(result.subsidyAmount)}
                </span>
                <span className="text-[10px] text-[#144134] block mt-0.5">Non-repayable PMEGP</span>
              </div>

              <div className="p-3.5 bg-[#F3ECE0] rounded-xl border border-[#DDD1B8]">
                <span className="text-[11px] text-[#5E5648] font-semibold block">
                  Net Bank Term Loan
                </span>
                <span className="font-display text-2xl font-bold text-[#231F18]">
                  {fmtINR(result.netLoan)}
                </span>
                <span className="text-[10px] text-[#5E5648] block mt-0.5">Borrowed principal</span>
              </div>

              <div className="p-3.5 bg-[#E8F2F9] rounded-xl border border-[#1D5C8A]/30">
                <span className="text-[11px] text-[#1D5C8A] font-semibold block">
                  Regular Monthly EMI
                </span>
                <span className="font-display text-2xl font-bold text-[#1D5C8A]">
                  {fmtINR(result.regularEmi)}
                </span>
                <span className="text-[10px] text-[#1D5C8A] block mt-0.5">Post-grace repayment</span>
              </div>
            </div>

            {/* Grace Period & DSCR Economics Banner */}
            <div className="p-4 bg-[#F3ECE0]/60 border border-[#DDD1B8] rounded-xl space-y-2 text-xs md:text-sm">
              <div className="font-bold text-[#231F18] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1E5C4A]" />
                Moratorium Economics & Debt Service Coverage Ratio (DSCR):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div>
                  During <strong>Months 1 to {result.moratorium}</strong> (Grace Period), principal repayment is suspended. You only service simple interest of{' '}
                  <strong className="text-[#B5551E]">{fmtINR(result.moratoriumMonthlyInterest)} / month</strong>.
                </div>
                <div>
                  From <strong>Month {result.moratorium + 1} to {tenure}</strong>, full regular EMI of{' '}
                  <strong className="text-[#1D5C8A]">{fmtINR(result.regularEmi)} / month</strong> commences for commercial amortisation.
                </div>
                <div>
                  Projected <strong>DSCR Safety Ratio: <span className="text-[#1E5C4A] text-base">{result.dscr}x</span></strong>. Indian banks require DSCR &gt; 1.5x for loan clearance. Your proposal is well within the safety corridor.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AMORTIZATION SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#5E5648]">
                Displaying complete month-by-month principal & interest schedule over {tenure} months.
              </span>
              <button
                type="button"
                onClick={handleExportScheduleCsv}
                className="px-3 py-1.5 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#231F18] flex items-center gap-1.5"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-[#B5551E]" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto border border-[#DDD1B8] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#F3ECE0] border-b border-[#DDD1B8] z-10">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold text-[#5E5648]">Month</th>
                    <th className="py-2.5 px-3 font-semibold text-[#5E5648]">Phase</th>
                    <th className="py-2.5 px-3 font-semibold text-[#5E5648] text-right">Opening Balance</th>
                    <th className="py-2.5 px-3 font-semibold text-[#5E5648] text-right">Principal Paid</th>
                    <th className="py-2.5 px-3 font-semibold text-[#5E5648] text-right">Interest Paid</th>
                    <th className="py-2.5 px-3 font-semibold text-[#5E5648] text-right">Total Instalment</th>
                    <th className="py-2.5 px-3 font-semibold text-[#5E5648] text-right">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD1B8]/60 bg-white">
                  {(result?.schedule || []).map((row) => (
                    <tr
                      key={row.month}
                      className={`hover:bg-[#FAF7F0] ${
                        row.phase === 'Moratorium' ? 'bg-[#FAF2DC]/30' : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-bold text-[#231F18]">M{row.month}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.phase === 'Moratorium'
                              ? 'bg-[#FAF2DC] text-[#785310]'
                              : 'bg-[#DEEAE3] text-[#144134]'
                          }`}
                        >
                          {row.phase}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[#5E5648]">{fmtINR(row.opening)}</td>
                      <td className="py-2 px-3 text-right font-medium text-[#231F18]">{fmtINR(row.principal)}</td>
                      <td className="py-2 px-3 text-right text-[#8C3E14]">{fmtINR(row.interest)}</td>
                      <td className="py-2 px-3 text-right font-bold text-[#1D5C8A]">{fmtINR(row.total)}</td>
                      <td className="py-2 px-3 text-right font-semibold text-[#231F18]">{fmtINR(row.closing)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BREAK-EVEN SALES */}
        {activeTab === 'be' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                  Monthly Fixed Overheads (Rent, Wages, Power) (₹)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={fixedOverhead}
                  onChange={(e) => setFixedOverhead(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                  Selling Price per Unit (₹)
                </label>
                <input
                  type="number"
                  step="5"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                  Raw Material Cost per Unit (₹)
                </label>
                <input
                  type="number"
                  step="2"
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#E5F0EB] rounded-xl border border-[#1E5C4A]/20">
                <span className="text-xs font-bold text-[#144134] block">
                  Monthly Break-Even Production Volume
                </span>
                <span className="font-display text-3xl font-bold text-[#144134] mt-1 block">
                  {breakEvenUnits.toLocaleString('en-IN')} Units / month
                </span>
                <span className="text-[11px] text-[#1E5C4A]">
                  Units required to cover all operating overheads & bank interest
                </span>
              </div>

              <div className="p-4 bg-[#F3ECE0] rounded-xl border border-[#DDD1B8]">
                <span className="text-xs font-bold text-[#5E5648] block">
                  Monthly Break-Even Sales Turnover
                </span>
                <span className="font-display text-3xl font-bold text-[#231F18] mt-1 block">
                  {fmtINR(breakEvenRev)} / month
                </span>
                <span className="text-[11px] text-[#5E5648]">
                  Minimum monthly gross cash collection target
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
