import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES, formatCurrency, getCategoryColor } from '../../utils/formatters';
import { AlertTriangle, ShieldAlert, CheckCircle2, Edit2, Check, X } from 'lucide-react';

export const CategoryBudgetCard: React.FC = () => {
  const { budget, updateBudget, transactions, settings } = useFinance();
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [tempValue, setTempValue] = useState('');

  // Calculate actual spending per category
  const categoryExpenses: Record<string, number> = {};
  EXPENSE_CATEGORIES.forEach((cat) => (categoryExpenses[cat] = 0));

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    });

  const handleStartEdit = (cat: ExpenseCategory) => {
    setEditingCategory(cat);
    setTempValue((budget.categoryBudgets[cat] || 0).toString());
  };

  const handleSaveEdit = (cat: ExpenseCategory) => {
    const val = parseFloat(tempValue);
    if (!isNaN(val) && val >= 0) {
      updateBudget({
        categoryBudgets: {
          ...budget.categoryBudgets,
          [cat]: val,
        },
      });
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white light:text-slate-900 tracking-tight">
            Category Budget Allocation & Thresholds
          </h3>
          <p className="text-xs text-slate-400">
            Automated alerts active at 70%, 90%, and 100% threshold limits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPENSE_CATEGORIES.map((cat) => {
          const catBudget = budget.categoryBudgets[cat] || 0;
          const spent = categoryExpenses[cat] || 0;
          const remaining = catBudget - spent;
          const pct = catBudget > 0 ? Math.round((spent / catBudget) * 100) : 0;
          const catColor = getCategoryColor(cat);

          // Threshold Warnings
          let progressBg = 'bg-emerald-500';
          let warningBadge = null;

          if (catBudget === 0) {
            warningBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                No Limit Set
              </span>
            );
          } else if (pct >= 100) {
            progressBg = 'bg-rose-500';
            warningBadge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                <span>Exceeded (100%+)</span>
              </span>
            );
          } else if (pct >= 90) {
            progressBg = 'bg-rose-400';
            warningBadge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-3 h-3" />
                <span>Urgent (90%+)</span>
              </span>
            );
          } else if (pct >= 70) {
            progressBg = 'bg-amber-400';
            warningBadge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-3 h-3" />
                <span>Caution (70%+)</span>
              </span>
            );
          } else {
            warningBadge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Safe</span>
              </span>
            );
          }

          const isEditing = editingCategory === cat;

          return (
            <div
              key={cat}
              className="p-5 rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 shadow-xl transition-all hover:border-slate-700"
            >
              {/* Header: Name, Edit & Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3 h-3 rounded-full flex-shrink-0`}
                    style={{ backgroundColor: catColor.hex }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white light:text-slate-900">{cat}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Utilization: {pct}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {warningBadge}
                  {!isEditing ? (
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="p-1 text-slate-400 hover:text-indigo-400 rounded transition-colors"
                      title="Adjust budget limit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Budget Values Row (Budget, Spent, Remaining) */}
              <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-800/60 light:border-slate-200 text-xs">
                {/* Budget Column */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Budget
                  </span>
                  {isEditing ? (
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-16 bg-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(cat)}
                        className="p-1 bg-indigo-600 rounded text-white"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-bold text-white light:text-slate-900 mt-0.5">
                      {formatCurrency(catBudget, settings.currencySymbol)}
                    </p>
                  )}
                </div>

                {/* Spent Column */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Spent
                  </span>
                  <p className="font-bold text-rose-400 mt-0.5">
                    {formatCurrency(spent, settings.currencySymbol)}
                  </p>
                </div>

                {/* Remaining Column */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Remaining
                  </span>
                  <p
                    className={`font-bold mt-0.5 ${
                      remaining >= 0 ? 'text-emerald-400' : 'text-rose-500'
                    }`}
                  >
                    {formatCurrency(remaining, settings.currencySymbol)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 space-y-1">
                <div className="w-full bg-slate-900 light:bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
