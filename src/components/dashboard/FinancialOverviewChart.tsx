import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  prepareWeeklyOverviewChart,
  prepareMonthlyOverviewChart,
  CashFlowDataPoint,
} from '../../services/financialAnalytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3 } from 'lucide-react';

export const FinancialOverviewChart: React.FC = () => {
  const { transactions, settings } = useFinance();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const chartData: CashFlowDataPoint[] =
    timeframe === 'weekly'
      ? prepareWeeklyOverviewChart(transactions)
      : prepareMonthlyOverviewChart(transactions);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B0F19] border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-300 mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 text-xs py-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-400 font-medium">{entry.name}:</span>
              <span className="font-bold text-white">
                {formatCurrency(entry.value, settings.currencySymbol)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] dark:from-[#131B2E] dark:to-[#0E1524] light:bg-white light:border light:border-slate-200 border border-slate-800/80 p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white light:text-slate-900 tracking-tight">
              Cash Flow Overview
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare incoming funds versus expenses across cycles
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center bg-slate-900/80 light:bg-slate-100 p-1 rounded-xl border border-slate-800 light:border-slate-300 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'weekly'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white light:hover:text-slate-800'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'monthly'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white light:hover:text-slate-800'
            }`}
          >
            Monthly (4 Weeks)
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />
            <Bar
              dataKey="Income"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
              animationDuration={800}
            />
            <Bar
              dataKey="Expenses"
              fill="#6366F1"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
