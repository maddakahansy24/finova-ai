import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { summary, settings } = useFinance();
  const { currencySymbol } = settings;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Balance */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 shadow-xl transition-all hover:border-indigo-500/40">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Balance
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            {formatCurrency(summary.totalBalance, currencySymbol)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold ${
                summary.totalBalance >= 0
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {summary.totalBalance >= 0 ? '+' : ''}
              {summary.savingsRate}% net margin
            </span>
            <span className="text-slate-400">from records</span>
          </div>
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 shadow-xl transition-all hover:border-emerald-500/40">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            {formatCurrency(summary.totalIncome, currencySymbol)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" /> Inflows
            </span>
            <span className="text-slate-400">all sources</span>
          </div>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 shadow-xl transition-all hover:border-rose-500/40">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-rose-500/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            {formatCurrency(summary.totalExpenses, currencySymbol)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              ~{formatCurrency(summary.dailyAverageExpense, currencySymbol)}/day
            </span>
            <span className="text-slate-400">daily burn</span>
          </div>
        </div>
      </div>

      {/* 4. Total Savings */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 shadow-xl transition-all hover:border-purple-500/40">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Savings
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            {formatCurrency(summary.netSavings, currencySymbol)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Percent className="w-3 h-3" /> {summary.savingsRate}% rate
            </span>
            <span className="text-slate-400">retained</span>
          </div>
        </div>
      </div>
    </div>
  );
};
