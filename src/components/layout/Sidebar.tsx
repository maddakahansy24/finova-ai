import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  ReceiptText,
  Sparkles,
  PieChart,
  Bot,
  Settings,
  HelpCircle,
  Database,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, settings, summary, resetDemoData, setIsAboutModalOpen } =
    useFinance();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'insights', label: 'AI Insights', icon: Sparkles, badge: 'Smart' },
    { id: 'budget', label: 'Budget Planner', icon: PieChart },
    { id: 'assistant', label: 'FinWise Assistant', icon: Bot, badge: 'AI' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 flex flex-col bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-slate-200 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0F19] light:bg-white rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white light:text-slate-900">
                  FinWise <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Finance Engine</p>
            </div>
          </div>
        </div>

        {/* Academic Demo Notice */}
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/40 to-purple-950/30 border border-indigo-500/20 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Academic Demonstration</span>
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            AI for Finance Project · Rupee Default (₹)
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 dark:hover:bg-slate-800/40 light:hover:bg-slate-100 light:text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions & User Profile Card */}
        <div className="p-3 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-2">
          {/* Demo Data Reset Trigger */}
          <button
            onClick={resetDemoData}
            title="Reload fictional sample transactions"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 transition-all hover:border-indigo-400/50"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load / Reset Demo Data</span>
          </button>

          {/* Academic About Modal Button */}
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>About FinWise Project</span>
          </button>

          {/* User Profile Snippet */}
          <div className="pt-2 flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 light:border-slate-300">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              {settings.userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 light:text-slate-800 truncate">
                {settings.userName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                Bal: {formatCurrency(summary.totalBalance, settings.currencySymbol)}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
