import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  User,
  DollarSign,
  Sun,
  Moon,
  Database,
  Trash2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    budget,
    updateBudget,
    resetDemoData,
    clearAllData,
    transactions,
    showToast,
  } = useFinance();

  const [name, setName] = useState(settings.userName);
  const [currency, setCurrency] = useState(settings.currency);
  const [budgetPref, setBudgetPref] = useState(budget.monthlyTotalBudget.toString());
  const [theme, setTheme] = useState(settings.theme);

  // Modals
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const currencySymbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };

    const newSymbol = currencySymbols[currency] || '₹';
    const parsedBudget = parseFloat(budgetPref);

    updateSettings({
      userName: name.trim() || 'Arjun Sharma',
      currency,
      currencySymbol: newSymbol,
      monthlyBudgetPreference: !isNaN(parsedBudget) ? parsedBudget : 12000,
      theme,
    });

    if (!isNaN(parsedBudget) && parsedBudget > 0) {
      updateBudget({ monthlyTotalBudget: parsedBudget });
    }
  };

  const handleResetDemo = () => {
    resetDemoData();
    setIsResetConfirmOpen(false);
  };

  const handleClearAll = () => {
    clearAllData();
    setIsClearConfirmOpen(false);
  };

  const aiCategorizedCount = transactions.filter((t) => t.isAiCategorized).length;
  const aiRatio =
    transactions.length > 0 ? Math.round((aiCategorizedCount / transactions.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile & Currency Form */}
      <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800/80 light:border-slate-200">
          <User className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              User Profile & Preferences
            </h3>
            <p className="text-xs text-slate-400">
              Personalize your display identity, default currency, and targets
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Currency (Default: INR ₹)
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
                <option value="GBP">British Pound (£ GBP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly Total Budget Target */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Monthly Target Budget ({settings.currencySymbol})
              </label>
              <input
                type="number"
                value={budgetPref}
                onChange={(e) => setBudgetPref(e.target.value)}
                placeholder="12000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Theme Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Interface Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    theme === 'dark'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-900 light:bg-slate-100 text-slate-400 border-slate-800 light:border-slate-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Fintech</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    theme === 'light'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-900 light:bg-slate-100 text-slate-400 border-slate-800 light:border-slate-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Clean</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* AI Telemetry & Engine Status */}
      <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800/80 light:border-slate-200">
          <Cpu className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              AI Categorization & Model Status
            </h3>
            <p className="text-xs text-slate-400">
              Heuristic Natural Language intent classification engine
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium">Model Mode</span>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hybrid NLP (Active)</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium">AI Categorized</span>
            <p className="text-sm font-bold text-indigo-400 mt-1">
              {aiCategorizedCount} of {transactions.length} records ({aiRatio}%)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium">API Dependency</span>
            <p className="text-sm font-bold text-slate-200 light:text-slate-800 mt-1">
              Zero Paid Keys Required
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The built-in Natural Language Categorization Engine recognizes hundreds of merchant brands, payment keywords, and transit/dining patterns without requiring any third-party paid API keys.
        </p>
      </div>

      {/* Demo & Storage Data Management */}
      <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800/80 light:border-slate-200">
          <Database className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              Demo Data & Local Storage
            </h3>
            <p className="text-xs text-slate-400">
              Manage persistent state and fictional demonstration datasets
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 gap-3">
            <div>
              <h4 className="text-xs font-bold text-white light:text-slate-900">
                Load / Reset Demo Data
              </h4>
              <p className="text-[11px] text-slate-400">
                Restores 20 fictional Indian Rupee (₹) student transactions across all categories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 transition-all flex-shrink-0"
            >
              Reset Demo Data
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-rose-950/15 border border-rose-500/20 gap-3">
            <div>
              <h4 className="text-xs font-bold text-rose-300">
                Clear All Application Data
              </h4>
              <p className="text-[11px] text-slate-400">
                Permanently erases all stored transactions, customized budgets, and local ledger storage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsClearConfirmOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all flex-shrink-0"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset to Demo Data?"
        message="This will reload the realistic academic demonstration dataset with 20 sample transactions in Indian Rupees (₹). Any custom transactions will be replaced."
        confirmLabel="Load Demo Data"
        isDestructive={false}
        onConfirm={handleResetDemo}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={isClearConfirmOpen}
        title="Clear All Application Data?"
        message="Are you sure you want to permanently erase all stored transactions and local data? This action cannot be reversed."
        confirmLabel="Erase Everything"
        isDestructive={true}
        onConfirm={handleClearAll}
        onCancel={() => setIsClearConfirmOpen(false)}
      />
    </div>
  );
};
