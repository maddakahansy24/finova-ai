import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  X,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Code2,
  Target,
  Layers,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export const AboutModal: React.FC = () => {
  const { isAboutModalOpen, setIsAboutModalOpen } = useFinance();

  if (!isAboutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white light:text-slate-900">
                About FinWise AI — Academic Project Overview
              </h2>
              <p className="text-xs text-indigo-300">
                AI for Personal Finance Assignment · Technical Documentation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* 1. Problem Statement */}
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
              <Target className="w-4 h-4" />
              <span>1. Problem Statement</span>
            </div>
            <p className="text-slate-300">
              College students and young professionals face recurring personal finance friction: lack of expense tracking discipline, tedious manual transaction entry, emotional impulse spending, and low financial literacy regarding compounding, emergency buffers, and credit scores. Conventional spreadsheets lack predictive guidance, while commercial apps often sell user data or require paid subscriptions.
            </p>
          </div>

          {/* 2. Project Objectives */}
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>2. Project Objectives</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Eliminate manual category selection friction via automated NLP intent recognition.</li>
              <li>Provide instant visual cash flow feedback using Indian Rupees (₹) as the primary base currency.</li>
              <li>Detect spending anomalies and evaluate the 50/30/20 financial rule dynamically.</li>
              <li>Offer an interactive conversational financial assistant that references the user's live financial data.</li>
              <li>Ensure 100% offline functionality with zero requirement for paid API keys or tracking telemetry.</li>
            </ul>
          </div>

          {/* 3. Technology Stack */}
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
              <Code2 className="w-4 h-4" />
              <span>3. Technology Stack</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-medium">
                <span className="text-indigo-400 font-bold block">Frontend</span>
                React 19 + TypeScript
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-medium">
                <span className="text-cyan-400 font-bold block">Build Tool</span>
                Vite 8.3 + ES Modules
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-medium">
                <span className="text-purple-400 font-bold block">Styling</span>
                Tailwind CSS 3.4
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-medium">
                <span className="text-emerald-400 font-bold block">Visualization</span>
                Recharts + Lucide Icons
              </div>
            </div>
          </div>

          {/* 4. Academic AI vs Mathematical Operations Demarcation */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>4. AI Demarcation vs Deterministic Math</span>
            </div>
            <p className="text-xs text-slate-300">
              In accordance with academic standards, ordinary mathematical aggregations are distinct from AI functionality:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-emerald-400">Rule-Based Math (Not AI):</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Balance = Income − Expenses; category percentage shares; budget variance thresholds (70%/90%/100%).
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-indigo-400">Machine Learning & NLP (AI):</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Token classification & brand entity recognition for transaction categorization, natural-language recommendation synthesis, and conversational context parsing.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Benefits and Real-World Limitations */}
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>5. Benefits & Realistic Limitations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-slate-200">Key Benefits:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400 text-[11px]">
                  <li>Total client-side privacy with browser LocalStorage.</li>
                  <li>No external API latency or authentication downtime.</li>
                  <li>Instant feedback loop as transactions are recorded.</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-slate-200">Real-World Limitations:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400 text-[11px]">
                  <li>Does not connect directly to banking SMS/AA APIs (academic sandbox).</li>
                  <li>Guidance is educational and should not replace certified financial advisor audits.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
          <span className="text-xs text-slate-400">
            FinWise AI · Academic Version 2.0
          </span>
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
