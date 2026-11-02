import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { generateAiFinancialSummary } from '../../services/financialAnalytics';
import { Sparkles, ArrowRight, PlusCircle, BrainCircuit } from 'lucide-react';

export const AiSummaryBanner: React.FC = () => {
  const { transactions, setActiveTab, setIsAddModalOpen } = useFinance();
  const summaryText = generateAiFinancialSummary(transactions);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-slate-900 border border-indigo-500/30 p-5 sm:p-6 shadow-xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Summary Content */}
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Financial Engine</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Dynamic Real-Time Synthesis
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Personalized Financial Snapshot
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {summaryText}
          </p>
        </div>

        {/* Right: Functional CTAs */}
        <div className="flex flex-row md:flex-col lg:flex-row items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab('insights')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Deep AI Insights</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-slate-300" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    </div>
  );
};
