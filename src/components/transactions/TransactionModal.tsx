import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType, Category, ExpenseCategory, IncomeCategory } from '../../types';
import { predictCategory } from '../../services/aiCategorization';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/formatters';
import {
  X,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
  Check,
  CheckCircle2,
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editTransaction,
}) => {
  const { addTransaction, updateTransaction, settings } = useFinance();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>('Food & Dining');
  const [notes, setNotes] = useState('');

  // AI Categorization states
  const [isAiSuggested, setIsAiSuggested] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | undefined>(undefined);
  const [aiReasoning, setAiReasoning] = useState<string | undefined>(undefined);
  const [userManuallySelectedCategory, setUserManuallySelectedCategory] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debounceTimeout = useRef<any>(null);

  // Initialize or reset form when opening
  useEffect(() => {
    if (editTransaction) {
      setDescription(editTransaction.description);
      setAmount(editTransaction.amount.toString());
      setType(editTransaction.type);
      setDate(editTransaction.date);
      setCategory(editTransaction.category);
      setNotes(editTransaction.notes || '');
      setIsAiSuggested(!!editTransaction.isAiCategorized);
      setAiConfidence(editTransaction.aiConfidence);
      setAiReasoning(editTransaction.aiReasoning);
      setUserManuallySelectedCategory(true);
    } else {
      setDescription('');
      setAmount('');
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Food & Dining');
      setNotes('');
      setIsAiSuggested(false);
      setAiConfidence(undefined);
      setAiReasoning(undefined);
      setUserManuallySelectedCategory(false);
    }
    setErrors({});
  }, [editTransaction, isOpen]);

  // Real-time AI Categorization as user types description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDescription(val);

    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: '' }));
    }

    // Only run auto-categorization if user hasn't explicitly locked in their manual choice
    if (!userManuallySelectedCategory && val.trim().length >= 3) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        const result = predictCategory(val, type);
        if (result.isAiSuggested) {
          setCategory(result.suggestedCategory);
          setIsAiSuggested(true);
          setAiConfidence(result.confidence);
          setAiReasoning(result.reasoning);
        }
      }, 250);
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setUserManuallySelectedCategory(false);

    // Predict category for new type
    if (description.trim().length >= 3) {
      const result = predictCategory(description, newType);
      setCategory(result.suggestedCategory);
      setIsAiSuggested(result.isAiSuggested);
      setAiConfidence(result.confidence);
      setAiReasoning(result.reasoning);
    } else {
      setCategory(newType === 'income' ? 'Salary / Stipend' : 'Food & Dining');
      setIsAiSuggested(false);
    }
  };

  const handleCategorySelect = (selected: Category) => {
    setCategory(selected);
    setUserManuallySelectedCategory(true);
    // Mark as manually chosen
    setIsAiSuggested(false);
    setAiReasoning('User manually verified/selected category');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) {
      newErrors.description = 'Please enter a transaction description.';
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0.';
    }
    if (!date) {
      newErrors.date = 'Please select a date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      date,
      category,
      notes: notes.trim() || undefined,
      isAiCategorized: isAiSuggested,
      aiConfidence,
      aiReasoning,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  const currentCategoryList: Category[] =
    type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D1424] dark:bg-[#0D1424] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 light:border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-white light:text-slate-900">
              {editTransaction ? 'Edit Transaction' : 'Record New Transaction'}
            </h2>
            <p className="text-xs text-slate-400">
              {editTransaction
                ? 'Update your recorded entry'
                : 'Intelligent AI auto-categorization enabled'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Transaction Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
                  type === 'expense'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-md shadow-rose-950/40'
                    : 'bg-slate-900/60 light:bg-slate-100 border-slate-800 light:border-slate-300 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Expense (Spend)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
                  type === 'income'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/60 light:bg-slate-100 border-slate-800 light:border-slate-300 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Income (Inflow)</span>
              </button>
            </div>
          </div>

          {/* Description with real-time AI trigger */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">
                Description *
              </label>
              {isAiSuggested && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                  <span>AI Categorized ({(aiConfidence! * 100).toFixed(0)}%)</span>
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. Swiggy Lunch, Uber to College, Freelance Payment..."
              value={description}
              onChange={handleDescriptionChange}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 light:bg-slate-50 border ${
                errors.description
                  ? 'border-rose-500'
                  : 'border-slate-800 light:border-slate-300 focus:border-indigo-500'
              } text-white light:text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none transition-colors`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
            {aiReasoning && isAiSuggested && (
              <p className="mt-1 text-[11px] text-indigo-300/90 italic">
                💡 {aiReasoning}
              </p>
            )}
          </div>

          {/* Amount & Date in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Amount ({settings.currencySymbol}) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  {settings.currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                  }}
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 light:bg-slate-50 border ${
                    errors.amount
                      ? 'border-rose-500'
                      : 'border-slate-800 light:border-slate-300 focus:border-indigo-500'
                  } text-white light:text-slate-900 text-sm font-semibold placeholder:text-slate-500 focus:outline-none transition-colors`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.amount}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-300 focus:border-indigo-500 text-white light:text-slate-900 text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Category Selection with Interactive Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">
                Category *
              </label>
              <span className="text-[11px] text-slate-400">
                Click any category to override
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-900/40 rounded-xl border border-slate-800/80">
              {currentCategoryList.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm font-semibold'
                        : 'bg-slate-800/40 light:bg-slate-100 border-slate-700/50 light:border-slate-200 text-slate-300 light:text-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {isSelected && <Check className="w-3 h-3 flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Split with classmate, recurring monthly bill, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-300 focus:border-indigo-500 text-white light:text-slate-900 text-xs placeholder:text-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80 light:border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editTransaction ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
