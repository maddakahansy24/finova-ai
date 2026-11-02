import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Transaction,
  BudgetConfig,
  UserSettings,
  FinancialSummary,
  AIRecommendation,
  ActiveTab,
} from '../types';
import { StorageService } from '../services/storage';
import { calculateFinancialSummary, generateAiRecommendations } from '../services/financialAnalytics';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface FinanceContextType {
  transactions: Transaction[];
  budget: BudgetConfig;
  settings: UserSettings;
  summary: FinancialSummary;
  recommendations: AIRecommendation[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (newBudget: Partial<BudgetConfig>) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetDemoData: () => void;
  clearAllData: () => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isAboutModalOpen: boolean;
  setIsAboutModalOpen: (open: boolean) => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    StorageService.getTransactions()
  );
  const [budget, setBudget] = useState<BudgetConfig>(() => StorageService.getBudget());
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Apply theme to HTML document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Recompute financial summary whenever transactions change
  const summary = useMemo(() => {
    return calculateFinancialSummary(transactions);
  }, [transactions]);

  // Recompute AI recommendations
  const recommendations = useMemo(() => {
    return generateAiRecommendations(transactions, budget);
  }, [transactions, budget]);

  // Transaction Actions
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const newTx: Transaction = {
      ...data,
      id: 'tx-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    StorageService.saveTransactions(updated);
    showToast(`Transaction "${newTx.description}" added successfully!`, 'success');
    return newTx;
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...data } : t));
    setTransactions(updated);
    StorageService.saveTransactions(updated);
    showToast('Transaction updated successfully!', 'success');
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    StorageService.saveTransactions(updated);
    showToast(`Removed "${target?.description || 'transaction'}"`, 'info');
  };

  // Budget Actions
  const updateBudget = (newBudget: Partial<BudgetConfig>) => {
    const updated = {
      ...budget,
      ...newBudget,
      categoryBudgets: {
        ...budget.categoryBudgets,
        ...(newBudget.categoryBudgets || {}),
      },
    };
    setBudget(updated);
    StorageService.saveBudget(updated);
    showToast('Budget limits updated!', 'success');
  };

  // Settings Actions
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
    showToast('Settings saved successfully!', 'success');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    const reset = StorageService.resetToDemoData();
    setTransactions(reset.transactions);
    setBudget(reset.budget);
    setSettings(reset.settings);
    showToast('Demo data successfully reloaded with 20 realistic records!', 'success');
  };

  // Clear All Data
  const clearAllData = () => {
    StorageService.clearAllData();
    setTransactions([]);
    setBudget({
      monthlyTotalBudget: 10000,
      categoryBudgets: {
        'Food & Dining': 3000,
        'Transportation': 1000,
        'Shopping': 1500,
        'Education': 1500,
        'Entertainment': 800,
        'Healthcare': 800,
        'Bills & Utilities': 1000,
        'Other': 400,
      },
    });
    showToast('All transaction records have been cleared.', 'warning');
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budget,
        settings,
        summary,
        recommendations,
        activeTab,
        setActiveTab,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        updateSettings,
        resetDemoData,
        clearAllData,
        isAddModalOpen,
        setIsAddModalOpen,
        isAboutModalOpen,
        setIsAboutModalOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
