import { ExpenseCategory, IncomeCategory, Category } from '../types';

export const formatCurrency = (amount: number, symbol: string = '₹'): string => {
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatRelativeDate = (dateString: string): string => {
  if (!dateString) return '';
  const today = new Date();
  const txDate = new Date(dateString);
  const diffTime = today.getTime() - txDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7 && diffDays > 1) return `${diffDays} days ago`;
  return formatDate(dateString);
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Education',
  'Entertainment',
  'Healthcare',
  'Bills & Utilities',
  'Other',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Allowance / Pocket Money',
  'Salary / Stipend',
  'Freelance',
  'Investments',
  'Gifts & Awards',
  'Other Income',
];

export const CATEGORY_COLORS: Record<string, { color: string; hex: string; bg: string; border: string }> = {
  'Food & Dining': { color: 'text-amber-400', hex: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  'Transportation': { color: 'text-blue-400', hex: '#3B82F6', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  'Shopping': { color: 'text-purple-400', hex: '#A855F7', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  'Education': { color: 'text-cyan-400', hex: '#06B6D4', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  'Entertainment': { color: 'text-pink-400', hex: '#EC4899', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  'Healthcare': { color: 'text-rose-400', hex: '#F43F5E', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  'Bills & Utilities': { color: 'text-indigo-400', hex: '#6366F1', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  'Other': { color: 'text-slate-400', hex: '#94A3B8', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
  'Allowance / Pocket Money': { color: 'text-emerald-400', hex: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  'Salary / Stipend': { color: 'text-teal-400', hex: '#14B8A6', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  'Freelance': { color: 'text-emerald-400', hex: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  'Investments': { color: 'text-violet-400', hex: '#8B5CF6', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  'Gifts & Awards': { color: 'text-yellow-400', hex: '#EAB308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  'Other Income': { color: 'text-emerald-400', hex: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
};

export const getCategoryColor = (category: Category) => {
  return (
    CATEGORY_COLORS[category] || {
      color: 'text-slate-400',
      hex: '#94A3B8',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30',
    }
  );
};
