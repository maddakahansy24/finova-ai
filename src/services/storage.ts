import { Transaction, BudgetConfig, UserSettings } from '../types';
import { SAMPLE_TRANSACTIONS, INITIAL_BUDGET, INITIAL_USER_SETTINGS } from '../data/sampleTransactions';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finwise_ai_transactions_v1',
  BUDGET: 'finwise_ai_budget_v1',
  SETTINGS: 'finwise_ai_settings_v1',
  DEMO_LOADED: 'finwise_ai_demo_seeded_v1',
};

export const StorageService = {
  // Transactions
  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) {
        return JSON.parse(data);
      }
      // If first launch, load initial sample transactions
      this.saveTransactions(SAMPLE_TRANSACTIONS);
      localStorage.setItem(STORAGE_KEYS.DEMO_LOADED, 'true');
      return SAMPLE_TRANSACTIONS;
    } catch (e) {
      console.error('Error loading transactions from localStorage:', e);
      return SAMPLE_TRANSACTIONS;
    }
  },

  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage:', e);
    }
  },

  // Budget
  getBudget(): BudgetConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (data) {
        return JSON.parse(data);
      }
      this.saveBudget(INITIAL_BUDGET);
      return INITIAL_BUDGET;
    } catch (e) {
      console.error('Error loading budget from localStorage:', e);
      return INITIAL_BUDGET;
    }
  },

  saveBudget(budget: BudgetConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
    } catch (e) {
      console.error('Error saving budget to localStorage:', e);
    }
  },

  // User Settings
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
      this.saveSettings(INITIAL_USER_SETTINGS);
      return INITIAL_USER_SETTINGS;
    } catch (e) {
      console.error('Error loading settings from localStorage:', e);
      return INITIAL_USER_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage:', e);
    }
  },

  // Demo Data Reset
  resetToDemoData(): { transactions: Transaction[]; budget: BudgetConfig; settings: UserSettings } {
    this.saveTransactions(SAMPLE_TRANSACTIONS);
    this.saveBudget(INITIAL_BUDGET);
    this.saveSettings(INITIAL_USER_SETTINGS);
    return {
      transactions: SAMPLE_TRANSACTIONS,
      budget: INITIAL_BUDGET,
      settings: INITIAL_USER_SETTINGS,
    };
  },

  // Clear All Data
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGET);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_LOADED);
  },
};
