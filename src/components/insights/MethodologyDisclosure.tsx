import React from 'react';
import { BookOpen, Cpu, Calculator, Sparkles, MessageSquareText } from 'lucide-react';

export const MethodologyDisclosure: React.FC = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-[#0D1424] border border-indigo-500/20 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Academic AI & Algorithmic Methodology Disclosure
          </h3>
          <p className="text-[11px] text-slate-400">
            AI for Finance Coursework · Architectural Breakdown
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mt-2 mb-4">
        To maintain academic integrity and technical precision, FinWise AI clearly demarcates deterministic mathematical calculations from artificial intelligence and natural language processing models:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* 1. AI Categorization */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1.5">
            <Cpu className="w-4 h-4" />
            <span>1. AI / NLP Transaction Categorization</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Uses tokenization, n-gram brand extraction, and natural-language intent heuristics to map freeform transaction strings (e.g. "Swiggy biryani") to financial categories with confidence scores and reasoning.
          </p>
        </div>

        {/* 2. Deterministic Financial Math */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5">
            <Calculator className="w-4 h-4" />
            <span>2. Deterministic Financial Calculations</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Cash balances, budget percentage utilization, daily burn rates, and savings margins are pure mathematical operations. These are explicitly NOT labeled as AI.
          </p>
        </div>

        {/* 3. AI Recommendations */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-purple-400 font-bold mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>3. AI Natural-Language Synthesis</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Dynamic natural language generation transforms numeric anomalies, category share spikes, and savings metrics into actionable, human-readable financial guidance.
          </p>
        </div>

        {/* 4. Conversational Chatbot */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1.5">
            <MessageSquareText className="w-4 h-4" />
            <span>4. Context-Aware Financial Chatbot</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            FinWise Assistant injects live financial telemetry into conversational dialogue, answering literacy questions and providing individualized advice with strict safety guardrails.
          </p>
        </div>
      </div>
    </div>
  );
};
