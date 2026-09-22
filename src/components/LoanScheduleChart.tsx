import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LoanCalcResult } from '../types';
import { fmtINR } from '../utils/calculator';
import { Landmark, Calendar, ShieldCheck, Info } from 'lucide-react';

interface LoanScheduleChartProps {
  loanCalc: LoanCalcResult;
}

export const LoanScheduleChart: React.FC<LoanScheduleChartProps> = ({ loanCalc }) => {
  const [viewMode, setViewMode] = useState<'balance' | 'breakdown'>('balance');

  // Downsample or map the 60-month schedule for smooth rendering and responsive display
  const rawSchedule = loanCalc?.schedule || [];

  // Group or sample points (e.g. Months 1, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48, 54, 60) or full 60 months
  const chartData = rawSchedule.map((row) => ({
    month: `M${row.month}`,
    monthNum: row.month,
    phase: row.phase,
    balance: row.closing,
    principal: row.principal,
    interest: row.interest,
    totalPayment: row.total,
  }));

  const moratoriumEnd = loanCalc?.moratorium || 6;
  const netLoan = loanCalc?.netLoan || 0;
  const regularEmi = loanCalc?.regularEmi || 0;

  return (
    <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDD1B8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#DEEAE3] text-[#144134]">
              <Landmark className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E5C4A]">
              Financial Amortization Trajectory
            </span>
          </div>
          <h3 className="font-display text-base md:text-lg font-bold text-[#231F18] mt-0.5">
            60-Month Loan Repayment & Balance Sinking Schedule
          </h3>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F3ECE0] p-1 rounded-lg border border-[#DDD1B8]">
          <button
            type="button"
            onClick={() => setViewMode('balance')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'balance'
                ? 'bg-white text-[#144134] shadow-xs'
                : 'text-[#5E5648] hover:text-[#231F18]'
            }`}
          >
            Outstanding Balance
          </button>
          <button
            type="button"
            onClick={() => setViewMode('breakdown')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'breakdown'
                ? 'bg-white text-[#144134] shadow-xs'
                : 'text-[#5E5648] hover:text-[#231F18]'
            }`}
          >
            Principal vs Interest
          </button>
        </div>
      </div>

      {/* Key Financial Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#DDD1B8]">
          <span className="text-[10px] text-[#8C8373] block">Net Bank Loan</span>
          <strong className="text-sm font-bold text-[#231F18]">{fmtINR(netLoan)}</strong>
        </div>
        <div className="p-2.5 rounded-lg bg-[#FAF2DC] border border-[#B88628]/30">
          <span className="text-[10px] text-[#785310] block">Moratorium (Grace)</span>
          <strong className="text-sm font-bold text-[#785310]">Months 1–{moratoriumEnd}</strong>
        </div>
        <div className="p-2.5 rounded-lg bg-[#E5F0EB] border border-[#1E5C4A]/30">
          <span className="text-[10px] text-[#144134] block">Regular Monthly EMI</span>
          <strong className="text-sm font-bold text-[#144134]">{fmtINR(regularEmi)} / mo</strong>
        </div>
        <div className="p-2.5 rounded-lg bg-[#E8F2F9] border border-[#1D5C8A]/30">
          <span className="text-[10px] text-[#1D5C8A] block">Tenure Length</span>
          <strong className="text-sm font-bold text-[#1D5C8A]">60 Months (5 Yrs)</strong>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'balance' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E5C4A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1E5C4A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DEC9" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#8C8373"
                tick={{ fontSize: 11, fill: '#5E5648' }}
                interval={5}
              />
              <YAxis
                stroke="#8C8373"
                tick={{ fontSize: 10, fill: '#5E5648' }}
                tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#FFFDF8] border border-[#DDD1B8] p-3 rounded-lg shadow-md text-xs space-y-1">
                        <div className="font-bold text-[#231F18] flex items-center justify-between gap-3">
                          <span>Month {data.monthNum}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              data.phase === 'Moratorium'
                                ? 'bg-[#FAF2DC] text-[#785310]'
                                : 'bg-[#DEEAE3] text-[#144134]'
                            }`}
                          >
                            {data.phase}
                          </span>
                        </div>
                        <div className="text-[#5E5648] pt-1">
                          Remaining Loan Balance:{' '}
                          <strong className="text-[#1E5C4A]">{fmtINR(data.balance)}</strong>
                        </div>
                        <div className="text-[#5E5648]">
                          Monthly Repayment:{' '}
                          <strong className="text-[#231F18]">{fmtINR(data.totalPayment)}</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                name="Remaining Loan Balance"
                stroke="#1E5C4A"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#balanceGrad)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E5C4A" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#1E5C4A" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B5551E" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#B5551E" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DEC9" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#8C8373"
                tick={{ fontSize: 11, fill: '#5E5648' }}
                interval={5}
              />
              <YAxis
                stroke="#8C8373"
                tick={{ fontSize: 10, fill: '#5E5648' }}
                tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#FFFDF8] border border-[#DDD1B8] p-3 rounded-lg shadow-md text-xs space-y-1">
                        <div className="font-bold text-[#231F18] flex items-center justify-between gap-3">
                          <span>Month {data.monthNum}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              data.phase === 'Moratorium'
                                ? 'bg-[#FAF2DC] text-[#785310]'
                                : 'bg-[#DEEAE3] text-[#144134]'
                            }`}
                          >
                            {data.phase}
                          </span>
                        </div>
                        <div className="text-[#1E5C4A]">
                          Principal Component: <strong>{fmtINR(data.principal)}</strong>
                        </div>
                        <div className="text-[#B5551E]">
                          Interest Component: <strong>{fmtINR(data.interest)}</strong>
                        </div>
                        <div className="border-t border-[#DDD1B8] pt-1 text-[#231F18]">
                          Total Month Instalment: <strong>{fmtINR(data.totalPayment)}</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
              />
              <Area
                type="monotone"
                dataKey="principal"
                name="Principal Repaid"
                stroke="#1E5C4A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#principalGrad)"
              />
              <Area
                type="monotone"
                dataKey="interest"
                name="Interest Paid"
                stroke="#B5551E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#interestGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F3ECE0]/50 border border-[#DDD1B8] text-[11px] text-[#5E5648]">
        <Info className="w-4 h-4 text-[#8C3E14] shrink-0 mt-0.5" />
        <div>
          <strong>RBI Micro-Lending Norm Compliance:</strong> During the initial {moratoriumEnd}-month moratorium, the borrower services interest only ({fmtINR(loanCalc?.moratoriumMonthlyInterest)}/mo), allowing the rural enterprise to complete construction, procure machinery, and reach cash-positive capacity before full principal amortization begins in Month {moratoriumEnd + 1}.
        </div>
      </div>
    </div>
  );
};
