export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Education'
  | 'Entertainment'
  | 'Healthcare'
  | 'Bills & Utilities'
  | 'Other';

export type IncomeCategory =
  | 'Allowance / Pocket Money'
  | 'Salary / Stipend'
  | 'Freelance'
  | 'Investments'
  | 'Gifts & Awards'
  | 'Other Income';

export type Category = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  category: Category;
  notes?: string;
  isAiCategorized?: boolean;
  aiConfidence?: number;
  aiReasoning?: string;
  createdAt: string;
}

export interface BudgetConfig {
  monthlyTotalBudget: number;
  categoryBudgets: Record<ExpenseCategory, number>;
}

export interface UserSettings {
  userName: string;
  userRole: string;
  currency: string;
  currencySymbol: string;
  monthlyBudgetPreference: number;
  theme: 'dark' | 'light';
  aiEngine: 'hybrid_nlp' | 'custom_api';
  customApiKey?: string;
}

export interface CategoryInfo {
  name: Category;
  type: TransactionType;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  recommendedPercentage?: number;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage
  highestExpenseCategory: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  } | null;
  transactionCount: number;
  dailyAverageExpense: number;
  needsVsWantsRatio: {
    needs: number;
    wants: number;
    savings: number;
  };
}

export interface AIRecommendation {
  id: string;
  type: 'alert' | 'tip' | 'warning' | 'success';
  title: string;
  description: string;
  potentialSavings?: number;
  category?: Category;
  severity: 'low' | 'medium' | 'high';
  calculationBasis: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  contextUsed?: {
    totalBalance?: number;
    highestExpenseCategory?: string;
    savingsRate?: number;
    monthlyBudgetSpentPercent?: number;
  };
  isOfflineFallback?: boolean;
}

export type ActiveTab =
  | 'dashboard'
  | 'transactions'
  | 'insights'
  | 'budget'
  | 'assistant'
  | 'settings';
