import React from 'react';
import { TransactionType, Category } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/formatters';
import { Search, Filter, ArrowUpDown, X, Download } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  typeFilter: 'all' | TransactionType;
  onTypeFilterChange: (type: 'all' | TransactionType) => void;
  categoryFilter: 'all' | Category;
  onCategoryFilterChange: (cat: 'all' | Category) => void;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
  onSortByChange: (sort: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc') => void;
  onExportCsv: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const TransactionFilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  onExportCsv,
  onResetFilters,
  hasActiveFilters,
}) => {
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 shadow-xl">
      {/* Search & Main Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description, merchant, or notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/80 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type Segmented Control */}
        <div className="flex items-center bg-slate-900/90 light:bg-slate-100 p-1 rounded-xl border border-slate-800 light:border-slate-300 flex-shrink-0">
          <button
            onClick={() => onTypeFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onTypeFilterChange('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'expense'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => onTypeFilterChange('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'income'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Income
          </button>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={onExportCsv}
          title="Export transactions as CSV"
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-all flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Secondary Row: Category Filter, Sorting, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-800/60 light:border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value as any)}
              className="bg-slate-900 light:bg-slate-50 border border-slate-800 light:border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-200 light:text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-slate-900 light:bg-slate-50 border border-slate-800 light:border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-200 light:text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Clear Filters pill */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
