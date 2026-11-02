import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType, Category } from '../../types';
import { TransactionFilterBar } from './TransactionFilterBar';
import { TransactionModal } from './TransactionModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/formatters';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Pencil,
  Trash2,
  Plus,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, settings, setIsAddModalOpen, showToast } =
    useFinance();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Edit / Delete Modal State
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter and Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchDesc = t.description.toLowerCase().includes(q);
          const matchCat = t.category.toLowerCase().includes(q);
          const matchNotes = t.notes?.toLowerCase().includes(q) || false;
          if (!matchDesc && !matchCat && !matchNotes) return false;
        }

        // Type
        if (typeFilter !== 'all' && t.type !== typeFilter) {
          return false;
        }

        // Category
        if (categoryFilter !== 'all' && t.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 || typeFilter !== 'all' || categoryFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSortBy('date-desc');
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteTransaction(deletingId);
      setDeletingId(null);
    }
  };

  // CSV Export utility
  const handleExportCsv = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export.', 'warning');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'AI_Categorized', 'Notes'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.type,
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.isAiCategorized ? 'YES' : 'NO',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredTransactions.length} records to CSV!`, 'success');
  };

  const totalFilteredSum = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [filteredTransactions]);

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <TransactionFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onExportCsv={handleExportCsv}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-400 font-medium">
          Showing <span className="font-bold text-white light:text-slate-900">{filteredTransactions.length}</span> of {transactions.length} records
        </p>
        <div className="text-xs font-semibold text-slate-400">
          Filtered Net: <span className={totalFilteredSum >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {formatCurrency(totalFilteredSum, settings.currencySymbol)}
          </span>
        </div>
      </div>

      {/* Table / Cards Container */}
      <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 shadow-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 light:bg-slate-100 flex items-center justify-center mx-auto text-slate-500 mb-3">
              <Receipt className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              No Transactions Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              {hasActiveFilters
                ? 'Try adjusting or clearing your search criteria and filters.'
                : 'Start tracking your financial transactions by adding your first entry.'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Reset Filters
              </button>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 light:bg-slate-100 border-b border-slate-800/80 light:border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const catColor = getCategoryColor(tx.category);

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-800/30 dark:hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors group"
                    >
                      {/* Description & AI indicator */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isIncome
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200 light:text-slate-900 truncate">
                                {tx.description}
                              </span>
                              {tx.isAiCategorized && (
                                <span
                                  title={tx.aiReasoning || 'AI Auto-Categorized'}
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex-shrink-0"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                                  <span>AI</span>
                                </span>
                              )}
                            </div>
                            {tx.notes && (
                              <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                                {tx.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.color} border ${catColor.border} whitespace-nowrap`}
                        >
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-slate-400 font-medium whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`text-sm font-bold tracking-tight whitespace-nowrap ${
                            isIncome ? 'text-emerald-400' : 'text-slate-100 light:text-slate-900'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(tx.amount, settings.currencySymbol)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditClick(tx)}
                            title="Edit transaction"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(tx.id)}
                            title="Delete transaction"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Transaction Modal */}
      <TransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
        editTransaction={editingTransaction}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction record? This action cannot be undone and will immediately update all financial calculations."
        confirmLabel="Delete Record"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
