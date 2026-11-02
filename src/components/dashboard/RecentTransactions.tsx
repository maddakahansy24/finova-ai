import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatRelativeDate, getCategoryColor } from '../../utils/formatters';
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Clock, Plus, Sparkles } from 'lucide-react';

export const RecentTransactions: React.FC = () => {
  const { transactions, settings, setActiveTab, setIsAddModalOpen } = useFinance();
  const { currencySymbol } = settings;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white light:text-slate-900 tracking-tight">
            Recent Transactions
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('transactions')}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group"
        >
          <span>View All ({transactions.length})</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="py-10 text-center text-slate-400">
          <p className="text-xs">No transactions recorded yet.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Transaction</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60 light:divide-slate-200">
          {recentTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const catColor = getCategoryColor(tx.category);

            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-800/30 dark:hover:bg-slate-800/30 light:hover:bg-slate-50 px-2 -mx-2 rounded-xl transition-all"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white light:text-slate-900 truncate">
                        {tx.description}
                      </p>
                      {tx.isAiCategorized && (
                        <span
                          title={tx.aiReasoning || 'AI Auto-Categorized'}
                          className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex-shrink-0"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                          <span>AI</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.color} border ${catColor.border}`}
                      >
                        {tx.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatRelativeDate(tx.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount */}
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-sm font-bold tracking-tight ${
                      isIncome ? 'text-emerald-400' : 'text-slate-200 light:text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, currencySymbol)}
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {tx.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
