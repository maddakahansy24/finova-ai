import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Menu,
  Plus,
  Calendar,
  Sparkles,
  Info,
  Sun,
  Moon,
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const {
    activeTab,
    settings,
    updateSettings,
    setIsAddModalOpen,
    setIsAboutModalOpen,
    recommendations,
  } = useFinance();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Financial Dashboard';
      case 'transactions':
        return 'Transaction Management';
      case 'insights':
        return 'AI Spending & Savings Insights';
      case 'budget':
        return 'Smart Budget Planner';
      case 'assistant':
        return 'FinWise AI Financial Assistant';
      case 'settings':
        return 'Preferences & System Settings';
      default:
        return 'FinWise AI';
    }
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const toggleTheme = () => {
    updateSettings({
      theme: settings.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const alertCount = recommendations.filter((r) => r.type === 'alert' || r.type === 'warning').length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#080C14]/80 dark:bg-[#080C14]/80 light:bg-white/80 backdrop-blur-xl border-b border-slate-800 dark:border-slate-800 light:border-slate-200 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white light:text-slate-900 tracking-tight flex items-center gap-2">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
            <Calendar className="w-3 h-3 text-indigo-400" />
            <span>{currentDate}</span>
          </p>
        </div>
      </div>

      {/* Right: Quick actions, Add Transaction, Theme, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* About Academic Modal Button */}
        <button
          onClick={() => setIsAboutModalOpen(true)}
          title="Project Methodology & Architecture"
          className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-all"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-all"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* AI Notification Alert Pill */}
        {alertCount > 0 && (
          <div
            title={`${alertCount} AI Financial Alerts active`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden md:inline">{alertCount} Smart Alerts</span>
            <span className="md:hidden">{alertCount}</span>
          </div>
        )}

        {/* Add Transaction Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};
