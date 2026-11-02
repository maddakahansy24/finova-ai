import {
  Transaction,
  FinancialSummary,
  AIRecommendation,
  ExpenseCategory,
  BudgetConfig,
  Category,
} from '../types';
import { EXPENSE_CATEGORIES } from '../utils/formatters';

export const calculateFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryExpenses: Record<string, number> = {};

  EXPENSE_CATEGORIES.forEach((cat) => {
    categoryExpenses[cat] = 0;
  });

  const dates: Set<string> = new Set();

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
      categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + tx.amount;
    }
    dates.add(tx.date);
  });

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Find highest expense category
  let highestCat: ExpenseCategory | null = null;
  let highestAmount = 0;

  Object.entries(categoryExpenses).forEach(([cat, amount]) => {
    if (amount > highestAmount) {
      highestAmount = amount;
      highestCat = cat as ExpenseCategory;
    }
  });

  const highestExpensePercentage =
    totalExpenses > 0 && highestCat ? Math.round((highestAmount / totalExpenses) * 100) : 0;

  // Calculate 50/30/20 Ratio (Needs vs Wants vs Savings)
  // Needs: Food, Transport, Education, Healthcare, Bills
  // Wants: Shopping, Entertainment, Other
  const needsSpend =
    (categoryExpenses['Food & Dining'] || 0) * 0.7 + // 70% food is basic needs
    (categoryExpenses['Transportation'] || 0) +
    (categoryExpenses['Education'] || 0) +
    (categoryExpenses['Healthcare'] || 0) +
    (categoryExpenses['Bills & Utilities'] || 0);

  const wantsSpend =
    (categoryExpenses['Food & Dining'] || 0) * 0.3 + // dining out / luxury food
    (categoryExpenses['Shopping'] || 0) +
    (categoryExpenses['Entertainment'] || 0) +
    (categoryExpenses['Other'] || 0);

  const totalEffective = totalIncome > 0 ? totalIncome : totalExpenses;
  const needsRatio = totalEffective > 0 ? Math.round((needsSpend / totalEffective) * 100) : 0;
  const wantsRatio = totalEffective > 0 ? Math.round((wantsSpend / totalEffective) * 100) : 0;
  const savingsRatio = Math.max(0, 100 - needsRatio - wantsRatio);

  const daysCount = Math.max(1, dates.size);
  const dailyAverageExpense = Math.round(totalExpenses / daysCount);

  return {
    totalBalance: netSavings,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    highestExpenseCategory:
      highestCat && highestAmount > 0
        ? {
            category: highestCat,
            amount: highestAmount,
            percentage: highestExpensePercentage,
          }
        : null,
    transactionCount: transactions.length,
    dailyAverageExpense,
    needsVsWantsRatio: {
      needs: needsRatio,
      wants: wantsRatio,
      savings: savingsRatio,
    },
  };
};

export const generateAiRecommendations = (
  transactions: Transaction[],
  budget?: BudgetConfig
): AIRecommendation[] => {
  if (!transactions || transactions.length < 3) {
    return [
      {
        id: 'rec-insufficient-data',
        type: 'alert',
        title: 'Awaiting Sufficient Transaction Data',
        description:
          'FinWise AI requires at least 3 to 5 financial records to identify authentic spending patterns and generate statistically validated recommendations.',
        severity: 'low',
        calculationBasis: `Currently recorded: ${transactions?.length || 0} transaction(s). Add more transactions or load demo data.`,
      },
    ];
  }

  const recommendations: AIRecommendation[] = [];
  const summary = calculateFinancialSummary(transactions);
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  expenseTransactions.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1;
  });

  // 1. Savings Rate Analysis
  if (summary.savingsRate < 10) {
    recommendations.push({
      id: 'rec-low-savings',
      type: 'warning',
      title: 'Low Savings Margin Alert',
      description: `Your net savings rate is currently ${summary.savingsRate}%, which is below the benchmark of 20%. Consider postponing discretionary purchases this month.`,
      potentialSavings: Math.round(summary.totalIncome * 0.1),
      severity: 'high',
      calculationBasis: `Calculated from Total Income (₹${summary.totalIncome}) vs Total Expenses (₹${summary.totalExpenses}).`,
    });
  } else if (summary.savingsRate >= 20 && summary.savingsRate < 35) {
    recommendations.push({
      id: 'rec-moderate-savings',
      type: 'tip',
      title: 'Healthy Savings Velocity',
      description: `Your current savings rate is ${summary.savingsRate}%. With subtle spending trims in non-essential areas, you can elevate this to 30%.`,
      potentialSavings: Math.round(summary.totalIncome * 0.05),
      severity: 'medium',
      calculationBasis: `Savings Rate: ${summary.savingsRate}% of recorded income retained.`,
    });
  } else if (summary.savingsRate >= 35) {
    recommendations.push({
      id: 'rec-excellent-savings',
      type: 'success',
      title: 'Superior Savings Discipline',
      description: `Impressive! You are saving ${summary.savingsRate}% of your total earnings. Consider allocating this surplus into emergency reserves or index mutual funds.`,
      severity: 'low',
      calculationBasis: `Savings rate of ${summary.savingsRate}% exceeds the recommended 50/30/20 baseline.`,
    });
  }

  // 2. Highest Spending Category Deep-Dive
  if (summary.highestExpenseCategory) {
    const { category, amount, percentage } = summary.highestExpenseCategory;

    if (category === 'Food & Dining' && percentage > 25) {
      recommendations.push({
        id: 'rec-food-optimization',
        type: 'alert',
        title: 'High Food & Dining Outlay',
        description: `You spent ₹${amount.toLocaleString('en-IN')} on Food & Dining, accounting for ${percentage}% of all expenses. Preparing meal plans or packing canteen lunch twice a week could trim your costs.`,
        potentialSavings: Math.round(amount * 0.25),
        category: 'Food & Dining',
        severity: 'high',
        calculationBasis: `Food represents ${percentage}% of total expenses (₹${amount} out of ₹${summary.totalExpenses}).`,
      });
    } else if (category === 'Shopping' && percentage > 20) {
      recommendations.push({
        id: 'rec-shopping-reduction',
        type: 'warning',
        title: 'Discretionary Shopping Spike',
        description: `Shopping represents ${percentage}% of your expenses (₹${amount.toLocaleString('en-IN')}). Adopting the '30-Day Rule' before non-essential purchases could save significant cash.`,
        potentialSavings: Math.round(amount * 0.3),
        category: 'Shopping',
        severity: 'medium',
        calculationBasis: `Calculated from ${categoryCounts['Shopping'] || 0} shopping transactions totaling ₹${amount}.`,
      });
    } else if (category === 'Transportation' && percentage > 18) {
      recommendations.push({
        id: 'rec-transport-carpool',
        type: 'tip',
        title: 'Transportation Cost Optimization',
        description: `Transportation is your largest expense at ₹${amount.toLocaleString('en-IN')} (${percentage}%). Utilizing student metro passes or shared cab booking can yield immediate savings.`,
        potentialSavings: Math.round(amount * 0.2),
        category: 'Transportation',
        severity: 'medium',
        calculationBasis: `Transport expenses account for ${percentage}% of your monthly outflow.`,
      });
    }
  }

  // 3. Entertainment & Micro-Subscriptions
  const entTotal = categoryTotals['Entertainment'] || 0;
  if (entTotal > 600) {
    recommendations.push({
      id: 'rec-entertainment-audit',
      type: 'tip',
      title: 'Digital Subscription Audit',
      description: `You have spent ₹${entTotal.toLocaleString('en-IN')} on entertainment and subscriptions. Auditing unused streaming services could save you ₹200–₹400 monthly.`,
      potentialSavings: 300,
      category: 'Entertainment',
      severity: 'low',
      calculationBasis: `Aggregated entertainment expenditures across ${categoryCounts['Entertainment'] || 0} transactions.`,
    });
  }

  // 4. Budget Overrun Checks (if budget provided)
  if (budget) {
    Object.entries(budget.categoryBudgets).forEach(([cat, catBudget]) => {
      const spent = categoryTotals[cat] || 0;
      if (catBudget > 0 && spent >= catBudget * 0.9) {
        const percent = Math.round((spent / catBudget) * 100);
        recommendations.push({
          id: `rec-budget-breach-${cat}`,
          type: spent >= catBudget ? 'alert' : 'warning',
          title: spent >= catBudget ? `Budget Exceeded: ${cat}` : `Budget Warning: ${cat}`,
          description: `You have utilized ${percent}% of your allocated ${cat} budget (Spent: ₹${spent.toLocaleString('en-IN')} / Limit: ₹${catBudget.toLocaleString('en-IN')}).`,
          category: cat as Category,
          severity: spent >= catBudget ? 'high' : 'medium',
          calculationBasis: `Real-time comparison: ₹${spent} spent vs ₹${catBudget} limit.`,
        });
      }
    });
  }

  return recommendations;
};

// Generates the personalized natural language summary for the dashboard
export const generateAiFinancialSummary = (transactions: Transaction[]): string => {
  if (!transactions || transactions.length === 0) {
    return 'Welcome to FinWise AI! Add your first income or expense transaction to unlock real-time financial tracking and AI-driven insights.';
  }

  const summary = calculateFinancialSummary(transactions);

  if (summary.totalExpenses === 0 && summary.totalIncome > 0) {
    return `You have recorded total income of ₹${summary.totalIncome.toLocaleString('en-IN')} with no recorded expenses yet. Start logging expenses to track your budget utilization.`;
  }

  if (summary.highestExpenseCategory) {
    const { category, amount, percentage } = summary.highestExpenseCategory;
    const savingsNote =
      summary.savingsRate >= 20
        ? `You maintain a resilient savings rate of ${summary.savingsRate}%.`
        : `Your current savings rate is ${summary.savingsRate}%, which leaves a slim safety buffer.`;

    const recommendationNote =
      category === 'Food & Dining'
        ? `Trimming frequent restaurant and delivery orders could elevate your monthly surplus by up to 15%.`
        : category === 'Shopping'
        ? `Postponing non-essential shopping purchases could boost your net savings this month.`
        : category === 'Transportation'
        ? `Exploring shared rides or public transit can reduce this category's impact.`
        : `Keeping ${category} expenses monitored will help preserve your financial flexibility.`;

    return `You have spent ₹${amount.toLocaleString('en-IN')} on ${category} this period, representing ${percentage}% of your total expenses. ${savingsNote} ${recommendationNote}`;
  }

  return `Total recorded income is ₹${summary.totalIncome.toLocaleString('en-IN')} and total expenses are ₹${summary.totalExpenses.toLocaleString('en-IN')}, leaving a net balance of ₹${summary.netSavings.toLocaleString('en-IN')}.`;
};

// Chart Data Preparation Functions
export const prepareExpenseBreakdownChart = (transactions: Transaction[]) => {
  const expenseMap: Record<string, number> = {};
  EXPENSE_CATEGORIES.forEach((c) => (expenseMap[c] = 0));

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    });

  return Object.entries(expenseMap)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));
};

export interface CashFlowDataPoint {
  name: string;
  Income: number;
  Expenses: number;
}

export const prepareWeeklyOverviewChart = (transactions: Transaction[]): CashFlowDataPoint[] => {
  const result: CashFlowDataPoint[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });

    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      if (tx.date === dateStr) {
        if (tx.type === 'income') income += tx.amount;
        else expenses += tx.amount;
      }
    });

    result.push({
      name: dayName,
      Income: income,
      Expenses: expenses,
    });
  }

  return result;
};

export const prepareMonthlyOverviewChart = (transactions: Transaction[]): CashFlowDataPoint[] => {
  const weeks = [
    { label: 'Week 1', startDay: 1, endDay: 7, Income: 0, Expenses: 0 },
    { label: 'Week 2', startDay: 8, endDay: 14, Income: 0, Expenses: 0 },
    { label: 'Week 3', startDay: 15, endDay: 21, Income: 0, Expenses: 0 },
    { label: 'Week 4', startDay: 22, endDay: 31, Income: 0, Expenses: 0 },
  ];

  transactions.forEach((tx) => {
    const day = parseInt(tx.date.split('-')[2] || '1', 10);
    const targetWeek =
      weeks.find((w) => day >= w.startDay && day <= w.endDay) || weeks[weeks.length - 1];

    if (tx.type === 'income') {
      targetWeek.Income += tx.amount;
    } else {
      targetWeek.Expenses += tx.amount;
    }
  });

  return weeks.map((w) => ({
    name: w.label,
    Income: w.Income,
    Expenses: w.Expenses,
  }));
};
