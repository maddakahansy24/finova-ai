import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { prepareExpenseBreakdownChart } from '../../services/financialAnalytics';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CATEGORY_COLORS, formatCurrency } from '../../utils/formatters';
import { PieChart as PieIcon, AlertCircle } from 'lucide-react';

export const ExpenseBreakdownChart: React.FC = () => {
  const { transactions, summary, settings } = useFinance();
  const breakdownData = prepareExpenseBreakdownChart(transactions);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        summary.totalExpenses > 0
          ? ((data.value / summary.totalExpenses) * 100).toFixed(1)
          : '0';
      return (
        <div className="bg-[#0B0F19] border border-slate-700/80 p-2.5 rounded-xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.payload.fill }}
            />
            <span className="text-xs font-semibold text-white">{data.name}</span>
          </div>
          <div className="mt-1 text-xs text-slate-300">
            <span className="font-bold text-indigo-400">
              {formatCurrency(data.value, settings.currencySymbol)}
            </span>{' '}
            ({percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white light:text-slate-900 tracking-tight">
              Expense Distribution
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {breakdownData.length} active categories
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Proportional spending by financial domain
        </p>
      </div>

      {breakdownData.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-center p-4 text-slate-400">
          <AlertCircle className="w-8 h-8 text-slate-500 mb-2" />
          <p className="text-xs font-medium">No recorded expenses to visualize.</p>
          <p className="text-[11px] text-slate-400 mt-1">Add an expense to populate the chart.</p>
        </div>
      ) : (
        <div className="relative h-60 w-full flex items-center justify-center my-1">
          {/* Donut Chart */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={breakdownData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                animationDuration={800}
              >
                {breakdownData.map((entry, index) => {
                  const colorObj = CATEGORY_COLORS[entry.name];
                  const fill = colorObj ? colorObj.hex : '#94A3B8';
                  return <Cell key={`cell-${index}`} fill={fill} stroke="transparent" />;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Inner Centerpiece */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Total Spent
            </span>
            <span className="text-lg font-extrabold text-white light:text-slate-900">
              {formatCurrency(summary.totalExpenses, settings.currencySymbol)}
            </span>
          </div>
        </div>
      )}

      {/* Mini Legend Chips */}
      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 light:border-slate-200">
        {breakdownData.slice(0, 4).map((item) => {
          const colorObj = CATEGORY_COLORS[item.name];
          const hex = colorObj ? colorObj.hex : '#94A3B8';
          const pct = summary.totalExpenses > 0 ? Math.round((item.value / summary.totalExpenses) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center justify-between text-[11px] px-2 py-1 rounded-lg bg-slate-900/50 light:bg-slate-100">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: hex }} />
                <span className="text-slate-300 light:text-slate-700 truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-200 light:text-slate-900">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
