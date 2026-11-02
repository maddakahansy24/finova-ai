import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/layout/Toast';
import { TransactionModal } from './components/transactions/TransactionModal';
import { AboutModal } from './components/common/AboutModal';

// Views & Components
import { SummaryCards } from './components/dashboard/SummaryCards';
import { FinancialOverviewChart } from './components/dashboard/FinancialOverviewChart';
import { ExpenseBreakdownChart } from './components/dashboard/ExpenseBreakdownChart';
import { RecentTransactions } from './components/dashboard/RecentTransactions';
import { AiSummaryBanner } from './components/dashboard/AiSummaryBanner';

import { TransactionList } from './components/transactions/TransactionList';

import { InsightCards } from './components/insights/InsightCards';
import { BudgetRule503020 } from './components/insights/BudgetRule503020';
import { MethodologyDisclosure } from './components/insights/MethodologyDisclosure';

import { BudgetOverview } from './components/budget/BudgetOverview';
import { CategoryBudgetCard } from './components/budget/CategoryBudgetCard';

import { ChatInterface } from './components/chatbot/ChatInterface';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, isAddModalOpen, setIsAddModalOpen } = useFinance();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080C14] dark:bg-[#080C14] light:bg-slate-50 flex">
      {/* Persistent Desktop Sidebar & Collapsible Mobile Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <AiSummaryBanner />
              <SummaryCards />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FinancialOverviewChart />
                </div>
                <div>
                  <ExpenseBreakdownChart />
                </div>
              </div>

              <RecentTransactions />
            </div>
          )}

          {/* TAB 2: TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <TransactionList />
            </div>
          )}

          {/* TAB 3: AI INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <InsightCards />
              <BudgetRule503020 />
              <MethodologyDisclosure />
            </div>
          )}

          {/* TAB 4: BUDGET PLANNER */}
          {activeTab === 'budget' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <BudgetOverview />
              <CategoryBudgetCard />
            </div>
          )}

          {/* TAB 5: AI FINANCIAL ASSISTANT */}
          {activeTab === 'assistant' && (
            <div className="animate-in fade-in duration-200">
              <ChatInterface />
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-200">
              <SettingsView />
            </div>
          )}
        </main>
      </div>

      {/* Global Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Academic Project Modal */}
      <AboutModal />

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <MainLayout />
    </FinanceProvider>
  );
}

export default App;
