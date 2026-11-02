import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { Shield, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export const BudgetRule503020: React.FC = () => {
  const { summary, settings } = useFinance();
  const { needsVsWantsRatio, totalIncome, totalExpenses } = summary;

  const idealNeeds = Math.round(totalIncome * 0.5);
  const idealWants = Math.round(totalIncome * 0.3);
  const idealSavings = Math.round(totalIncome * 0.2);

  const getStatus = (actual: number, target: number, isUpperLimit: boolean = true) => {
    if (isUpperLimit) {
      if (actual <= target) return { text: 'Optimal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      if (actual <= target + 10) return { text: 'Caution', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      return { text: 'Elevated', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    } else {
      if (actual >= target) return { text: 'Excellent', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      if (actual >= 10) return { text: 'Moderate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      return { text: 'Needs Boost', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    }
  };

  const needsStatus = getStatus(needsVsWantsRatio.needs, 50, true);
  const wantsStatus = getStatus(needsVsWantsRatio.wants, 30, true);
  const savingsStatus = getStatus(needsVsWantsRatio.savings, 20, false);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white light:text-slate-900 tracking-tight">
              50 / 30 / 20 Budget Health Analysis
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gold standard allocation: 50% Needs, 30% Wants, 20% Savings
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 self-start sm:self-auto">
          Income Basis: {formatCurrency(totalIncome, settings.currencySymbol)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Needs (50%) */}
        <div className="p-4 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 light:text-slate-800">
              1. Essential Needs (Target: 50%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${needsStatus.color}`}>
              {needsStatus.text}
            </span>
          </div>

          <div className="text-xl font-extrabold text-white light:text-slate-900">
            {needsVsWantsRatio.needs}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ideal cap: ~{formatCurrency(idealNeeds, settings.currencySymbol)}
          </p>

          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                needsVsWantsRatio.needs > 55 ? 'bg-amber-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, needsVsWantsRatio.needs)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            Covers shelter, utilities, essential groceries, healthcare & education.
          </p>
        </div>

        {/* Wants (30%) */}
        <div className="p-4 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 light:text-slate-800">
              2. Lifestyle Wants (Target: 30%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${wantsStatus.color}`}>
              {wantsStatus.text}
            </span>
          </div>

          <div className="text-xl font-extrabold text-white light:text-slate-900">
            {needsVsWantsRatio.wants}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ideal cap: ~{formatCurrency(idealWants, settings.currencySymbol)}
          </p>

          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                needsVsWantsRatio.wants > 35 ? 'bg-rose-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(100, needsVsWantsRatio.wants)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            Dining out, OTT entertainment, shopping, gadgets & hobbies.
          </p>
        </div>

        {/* Savings (20%) */}
        <div className="p-4 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 light:text-slate-800">
              3. Surplus & Savings (Target: 20%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${savingsStatus.color}`}>
              {savingsStatus.text}
            </span>
          </div>

          <div className="text-xl font-extrabold text-white light:text-slate-900">
            {needsVsWantsRatio.savings}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ideal target: ~{formatCurrency(idealSavings, settings.currencySymbol)}
          </p>

          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(100, needsVsWantsRatio.savings)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            Liquid emergency reserves, Fixed Deposits, and Mutual Fund SIPs.
          </p>
        </div>
      </div>
    </div>
  );
};
