import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, DollarSign, AlertTriangle, CheckCircle, ShieldAlert, Edit2, Check } from 'lucide-react';

export const BudgetOverview: React.FC = () => {
  const { budget, updateBudget, summary, settings } = useFinance();
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [tempTotal, setTempTotal] = useState(budget.monthlyTotalBudget.toString());

  const totalBudget = budget.monthlyTotalBudget;
  const totalSpent = summary.totalExpenses;
  const remaining = totalBudget - totalSpent;
  const utilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const handleSaveTotal = () => {
    const val = parseFloat(tempTotal);
    if (!isNaN(val) && val > 0) {
      updateBudget({ monthlyTotalBudget: val });
    }
    setIsEditingTotal(false);
  };

  let progressColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let warningMessage = 'On track! You have plenty of financial cushion.';

  if (utilization >= 100) {
    progressColor = 'bg-rose-500';
    badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    warningMessage = 'Critical Alert: You have exceeded 100% of your total budget!';
  } else if (utilization >= 90) {
    progressColor = 'bg-rose-400';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    warningMessage = 'Urgent Warning: 90%+ budget utilized. Halt non-essential spends!';
  } else if (utilization >= 70) {
    progressColor = 'bg-amber-400';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    warningMessage = 'Moderate Caution: 70%+ of budget reached.';
  }

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white light:text-slate-900 tracking-tight">
              Monthly Budget Utilization
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time aggregate spending tracked against target allocation
          </p>
        </div>

        {/* Total Budget Edit Widget */}
        <div className="flex items-center gap-2 bg-slate-900/80 light:bg-slate-100 p-1.5 px-3 rounded-xl border border-slate-800 light:border-slate-300">
          <span className="text-xs text-slate-400 font-medium">Monthly Target:</span>
          {isEditingTotal ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={tempTotal}
                onChange={(e) => setTempTotal(e.target.value)}
                className="w-24 bg-slate-800 border border-indigo-500 text-white rounded px-2 py-0.5 text-xs font-bold focus:outline-none"
              />
              <button
                onClick={handleSaveTotal}
                className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white light:text-slate-900">
                {formatCurrency(totalBudget, settings.currencySymbol)}
              </span>
              <button
                onClick={() => {
                  setTempTotal(totalBudget.toString());
                  setIsEditingTotal(true);
                }}
                className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors"
                title="Edit total budget"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3 Metric Stat Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Budget
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-white light:text-slate-900 mt-1">
            {formatCurrency(totalBudget, settings.currencySymbol)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Monthly planned cap</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Spent
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-1">
            {formatCurrency(totalSpent, settings.currencySymbol)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">From recorded expenses</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Remaining Budget
          </span>
          <div
            className={`text-xl sm:text-2xl font-extrabold mt-1 ${
              remaining >= 0 ? 'text-emerald-400' : 'text-rose-500'
            }`}
          >
            {formatCurrency(remaining, settings.currencySymbol)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {remaining >= 0 ? 'Safe unspent cushion' : 'Over budget deficit!'}
          </p>
        </div>
      </div>

      {/* Progress Bar & Status Pill */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 light:text-slate-700">
            Budget Burn Rate
          </span>
          <span className="font-bold text-white light:text-slate-900">{utilization}%</span>
        </div>

        <div className="w-full bg-slate-900 light:bg-slate-200 rounded-full h-3.5 p-0.5 border border-slate-800 light:border-slate-300 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{ width: `${Math.min(100, utilization)}%` }}
          />
        </div>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badgeColor}`}>
            {utilization >= 90 ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
            <span>{warningMessage}</span>
          </span>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Warning triggers at 70%, 90%, 100%
          </span>
        </div>
      </div>
    </div>
  );
};
