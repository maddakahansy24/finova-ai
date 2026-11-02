import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Flame,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const InsightCards: React.FC = () => {
  const { recommendations, settings, setActiveTab } = useFinance();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white light:text-slate-900 tracking-tight">
            AI-Generated Financial Recommendations
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Derived from live transaction records
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          let Icon = Lightbulb;
          let borderTheme = 'border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900';
          let badgeBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

          if (rec.type === 'alert') {
            Icon = Flame;
            borderTheme = 'border-rose-500/40 bg-gradient-to-br from-rose-950/40 to-slate-900';
            badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
          } else if (rec.type === 'warning') {
            Icon = AlertTriangle;
            borderTheme = 'border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-slate-900';
            badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
          } else if (rec.type === 'success') {
            Icon = CheckCircle2;
            borderTheme = 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-900';
            badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
          }

          return (
            <div
              key={rec.id}
              className={`rounded-2xl border p-5 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between ${borderTheme}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${badgeBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white light:text-slate-900">
                        {rec.title}
                      </h4>
                      {rec.category && (
                        <span className="text-[11px] font-medium text-slate-400">
                          Domain: {rec.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeBg}`}
                  >
                    {rec.severity} priority
                  </span>
                </div>

                <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 light:border-slate-200 flex items-center justify-between text-xs">
                {rec.potentialSavings ? (
                  <div className="text-slate-400">
                    Est. Savings:{' '}
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(rec.potentialSavings, settings.currencySymbol)}/mo
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic truncate max-w-xs">
                    {rec.calculationBasis}
                  </div>
                )}

                <button
                  onClick={() => setActiveTab('assistant')}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Ask FinWise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
