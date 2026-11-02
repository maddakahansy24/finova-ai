import { ChatMessage, FinancialSummary, BudgetConfig, Transaction } from '../types';

export interface ChatContext {
  summary: FinancialSummary;
  budget: BudgetConfig;
  transactions: Transaction[];
  userName: string;
}

export const SUGGESTED_QUESTIONS = [
  'How can I save ₹2,000 every month?',
  'What is the 50/30/20 budgeting rule?',
  'What is the difference between a Fixed Deposit and a Mutual Fund?',
  'How can I reduce my monthly expenses based on my data?',
  'What is an emergency fund and how much should I have?',
  'How do credit scores work in India?',
  'How does compound interest work?',
  'Am I currently overspending on my budget?',
];

// Safety disclaimer appended or displayed
export const FINANCIAL_SAFETY_DISCLAIMER =
  'FinWise AI provides educational guidance based on financial best practices. It does not provide certified financial advice or guarantee investment returns. Never share your OTP, banking PINs, or passwords.';

export const generateAssistantResponse = (
  userMessage: string,
  context: ChatContext
): { text: string; contextUsed?: any } => {
  const query = userMessage.toLowerCase().trim();
  const { summary, budget, userName } = context;

  // 1. Personalized question: "How can I reduce my expenses?" or "How can I save more money?" or "Am I overspending?"
  if (
    query.includes('save') &&
    (query.includes('more') || query.includes('reduce') || query.includes('my') || query.includes('expense') || query.includes('cut'))
  ) {
    const topCat = summary.highestExpenseCategory;
    const foodSpend = context.transactions
      .filter((t) => t.type === 'expense' && t.category === 'Food & Dining')
      .reduce((acc, t) => acc + t.amount, 0);

    const shoppingSpend = context.transactions
      .filter((t) => t.type === 'expense' && t.category === 'Shopping')
      .reduce((acc, t) => acc + t.amount, 0);

    let specificTips = '';
    if (topCat) {
      specificTips = `\n\n📌 **Data-Driven Analysis for ${userName}:**\n` +
        `• **Your Highest Expense:** You have spent **₹${topCat.amount.toLocaleString('en-IN')}** on **${topCat.category}** (${topCat.percentage}% of all your recorded expenses).\n` +
        `• **Current Savings Rate:** **${summary.savingsRate}%** (Net savings: ₹${summary.netSavings.toLocaleString('en-IN')}).\n` +
        `• **Immediate Action:** If you reduce ${topCat.category} spending by just 15%, you will retain an extra **₹${Math.round(topCat.amount * 0.15).toLocaleString('en-IN')}** this month!`;
    }

    return {
      text:
        `Hello ${userName}! Here is your personalized action plan to boost savings:${specificTips}\n\n` +
        `**Top 3 Proven Strategies:**\n` +
        `1. **The 48-Hour Rule for Shopping:** Before buying non-essentials (currently ₹${shoppingSpend.toLocaleString('en-IN')} spent), wait 48 hours to distinguish impulse from genuine need.\n` +
        `2. **Meal Prep & Canteen Caps:** Food & Dining stands at ₹${foodSpend.toLocaleString('en-IN')}. Setting a daily cap of ₹150 for cafe/delivery orders saves an estimated ₹1,200 monthly.\n` +
        `3. **Pay Yourself First:** Move 15% of any income or allowance to a separate savings account on the exact day you receive it, before starting routine spends.`,
      contextUsed: {
        totalBalance: summary.totalBalance,
        highestExpenseCategory: topCat?.category,
        savingsRate: summary.savingsRate,
      },
    };
  }

  // 2. "How can I save ₹2,000 every month?" or specific amount savings
  if (query.includes('save') && (query.includes('2000') || query.includes('2,000') || query.includes('target'))) {
    return {
      text:
        `Saving **₹2,000 every month** is a very realistic and achievable target for students and young earners! Here is a breakdown of how to achieve it:\n\n` +
        `• **Daily Micro-Goal:** ₹2,000 / 30 days = **~₹67 per day**. Just skipping one packaged snack, boba, or auto ride covers this.\n` +
        `• **Targeted Spending Trims:**\n` +
        `  1. *Food & Delivery:* Cook or eat mess food 2 extra days a week → **Saves ₹800/month**.\n` +
        `  2. *Subscriptions:* Swap solo OTT/music accounts for student or family plans → **Saves ₹300/month**.\n` +
        `  3. *Transport:* Use Metro or student bus passes instead of ride-hailing apps → **Saves ₹600/month**.\n` +
        `  4. *Discretionary Shopping:* Avoid 1 impulse purchase → **Saves ₹500/month**.\n\n` +
        `💡 **Pro Tip:** Set up an automated recurring deposit (RD) or mutual fund SIP of ₹500 every Monday. Automated savings prevent unintentional spending!`,
    };
  }

  // 3. 50/30/20 Budgeting Rule
  if (query.includes('50/30/20') || (query.includes('rule') && query.includes('budget'))) {
    const { needsVsWantsRatio, totalIncome } = summary;
    const idealNeeds = Math.round(totalIncome * 0.5);
    const idealWants = Math.round(totalIncome * 0.3);
    const idealSavings = Math.round(totalIncome * 0.2);

    return {
      text:
        `The **50/30/20 Rule** is a gold-standard budgeting framework popularised by Senator Elizabeth Warren:\n\n` +
        `1. **50% for Needs (Essentials):** Rent, groceries, utility bills, health, basic commute, and tuition. These are non-negotiable living costs.\n` +
        `2. **30% for Wants (Lifestyle):** Dining out, Netflix, shopping, hobbies, weekend trips, and electronics.\n` +
        `3. **20% for Savings & Debt Repayment:** Emergency fund, Mutual Fund SIPs, Fixed Deposits, and loan prepayments.\n\n` +
        `📊 **Your Current Allocation (based on your ₹${totalIncome.toLocaleString('en-IN')} income):**\n` +
        `• **Your Needs:** ~${needsVsWantsRatio.needs}% (Ideal: 50% = ₹${idealNeeds.toLocaleString('en-IN')})\n` +
        `• **Your Wants:** ~${needsVsWantsRatio.wants}% (Ideal: 30% = ₹${idealWants.toLocaleString('en-IN')})\n` +
        `• **Your Savings:** ~${needsVsWantsRatio.savings}% (Ideal: 20% = ₹${idealSavings.toLocaleString('en-IN')})\n\n` +
        `*Note: As a student, your percentages may flex, but keeping Wants under 30% is key to staying financially secure.*`,
      contextUsed: {
        totalBalance: summary.totalBalance,
        savingsRate: summary.savingsRate,
      },
    };
  }

  // 4. Fixed Deposit vs Mutual Fund
  if (
    (query.includes('fixed deposit') || query.includes('fd')) &&
    (query.includes('mutual fund') || query.includes('mf') || query.includes('difference'))
  ) {
    return {
      text:
        `Here is a clear comparison between **Fixed Deposits (FD)** and **Mutual Funds (MF)**:\n\n` +
        `| Feature | Fixed Deposit (FD) | Mutual Funds (MF) |\n` +
        `| :--- | :--- | :--- |\n` +
        `| **Safety / Risk** | Very Low (RBI insured up to ₹5 Lakhs) | Moderate to High (Market-linked) |\n` +
        `| **Expected Returns** | Fixed: ~6.5% – 7.5% per annum | Historical 11% – 14% (Equity index over 5+ yrs) |\n` +
        `| **Inflation Protection** | Poor (Often lags real inflation) | Strong (Historically beats inflation) |\n` +
        `| **Liquidity** | High (Penalty on early withdrawal) | High (Redeemable in 1-3 business days) |\n` +
        `| **Best Used For** | Emergency fund, short-term goals (<1-2 yrs) | Wealth creation, long-term goals (3-10+ yrs) |\n\n` +
        `💡 **Student Recommendation:** Keep your emergency cash in a high-yield savings account or FD, and start investing small surplus amounts (e.g., ₹500/month) in an Equity Index Mutual Fund (Nifty 50) via SIP for compounding.`,
    };
  }

  // 5. Compound Interest
  if (query.includes('compound') || query.includes('compounding')) {
    return {
      text:
        `**Compound interest** is earning interest not just on your principal capital, but also on the accumulated interest from previous periods — earning "interest on interest"!\n\n` +
        `The mathematical formula is:\n` +
        `$$A = P \\left(1 + \\frac{r}{n}\\right)^{nt}$$\n\n` +
        `**Real-Life Example for a 20-Year-Old:**\n` +
        `• If you invest **₹1,000 every month** at an average return of **12% per year**:\n` +
        `  - After 10 years: You invested ₹1.2 Lakhs → Value is **₹2.3 Lakhs**\n` +
        `  - After 20 years: You invested ₹2.4 Lakhs → Value is **₹10.0 Lakhs**\n` +
        `  - After 30 years: You invested ₹3.6 Lakhs → Value is **₹35.3 Lakhs**! 🚀\n\n` +
        `Notice how the final 10 years generated over ₹25 Lakhs of pure interest. **Time in the market is your greatest financial superpower!**`,
    };
  }

  // 6. Emergency Fund
  if (query.includes('emergency') || query.includes('rainy day')) {
    const monthlyExpenses = summary.totalExpenses > 0 ? summary.totalExpenses : budget.monthlyTotalBudget;
    const target3Months = monthlyExpenses * 3;
    const target6Months = monthlyExpenses * 6;

    return {
      text:
        `An **Emergency Fund** is a cash buffer reserved exclusively for unplanned, critical events — such as medical emergencies, urgent tech repairs (laptop/phone), sudden travel, or job/allowance interruptions.\n\n` +
        `📌 **How Much Do You Need?**\n` +
        `• **Baseline Rule:** 3 to 6 months of mandatory living expenses.\n` +
        `• **Based on your data:** Your current monthly spending is approximately **₹${monthlyExpenses.toLocaleString('en-IN')}**.\n` +
        `  - 3-Month Emergency Fund Target: **₹${target3Months.toLocaleString('en-IN')}**\n` +
        `  - 6-Month Emergency Fund Target: **₹${target6Months.toLocaleString('en-IN')}**\n\n` +
        `**Where to Park It?**\n` +
        `Keep this money in a separate high-interest savings account, sweep-in FD, or liquid mutual fund. Never invest emergency money in volatile stocks or lock it in long-term lock-in instruments!`,
      contextUsed: {
        totalBalance: summary.totalBalance,
      },
    };
  }

  // 7. Credit Scores & CIBIL
  if (query.includes('credit') || query.includes('cibil') || query.includes('score')) {
    return {
      text:
        `A **Credit Score** (in India, known as the **CIBIL Score**) is a 3-digit number ranging from **300 to 900** that represents your creditworthiness to lenders.\n\n` +
        `• **Score Ranges:**\n` +
        `  - 750 – 900: Excellent (Eligible for lowest loan interest rates and top credit cards)\n` +
        `  - 700 – 749: Good\n` +
        `  - 650 – 699: Fair / Average\n` +
        `  - Below 650: Poor (Difficult to get loans or approved credit)\n\n` +
        `**5 Factors Influencing Your Score:**\n` +
        `1. **Payment History (35%):** Never miss an EMI or credit card due date.\n` +
        `2. **Credit Utilization Ratio (30%):** Keep spending under 30% of your total credit limit.\n` +
        `3. **Credit Age (15%):** The longer your credit history, the better.\n` +
        `4. **Credit Mix (10%):** Healthy mix of secured (auto/home) and unsecured (credit card) credit.\n` +
        `5. **Hard Inquiries (10%):** Avoid applying for multiple credit cards at once.\n\n` +
        `💡 *Student Tip: Once you turn 18, you can build your credit score early by getting a secured credit card backed by a Fixed Deposit (FD).*`,
    };
  }

  // 8. Loans & Education Debt
  if (query.includes('loan') || query.includes('emi') || query.includes('debt')) {
    return {
      text:
        `Understanding loans is essential for making smart borrowing decisions:\n\n` +
        `• **Good Debt vs. Bad Debt:**\n` +
        `  - *Good Debt:* Education loans or affordable business loans that increase your future earning potential.\n` +
        `  - *Bad Debt:* High-interest consumer loans, BNPL (Buy Now Pay Later) for fashion, or revolving credit card debt carrying 36%–42% annual interest!\n\n` +
        `• **What is an EMI?**\n` +
        `  *Equated Monthly Installment* is the fixed payment amount made by a borrower to a lender at a specified date every month. Each EMI includes both principal and interest portions.\n\n` +
        `• **Key Rules for Borrowing:**\n` +
        `  1. Total EMIs should never exceed 35%–40% of your net monthly earnings.\n` +
        `  2. Always verify the APR (Annual Percentage Rate) and processing fees, not just nominal interest rates.\n` +
        `  3. Check for prepayment penalties before signing.`,
    };
  }

  // 9. Budget Status / Overspending Check
  if (query.includes('budget') || query.includes('overspending') || query.includes('status')) {
    const totalBudget = budget.monthlyTotalBudget;
    const totalSpent = summary.totalExpenses;
    const remaining = totalBudget - totalSpent;
    const utilization = Math.round((totalSpent / totalBudget) * 100);

    let statusText = '';
    if (utilization < 70) {
      statusText = `✅ You are well within your limits! You have used **${utilization}%** of your ₹${totalBudget.toLocaleString('en-IN')} budget.`;
    } else if (utilization < 90) {
      statusText = `⚠️ Moderate Caution: You have utilized **${utilization}%** of your ₹${totalBudget.toLocaleString('en-IN')} budget. Pace your spending for the remainder of the month.`;
    } else if (utilization <= 100) {
      statusText = `🚨 Critical Warning: You are at **${utilization}%** of your total monthly budget with only ₹${remaining.toLocaleString('en-IN')} remaining.`;
    } else {
      statusText = `⛔ Budget Exceeded: You have surpassed your monthly budget by **₹${Math.abs(remaining).toLocaleString('en-IN')}** (${utilization}% utilization).`;
    }

    return {
      text:
        `Here is your real-time budget status, ${userName}:\n\n` +
        `${statusText}\n\n` +
        `• **Total Monthly Budget:** ₹${totalBudget.toLocaleString('en-IN')}\n` +
        `• **Total Amount Spent:** ₹${totalSpent.toLocaleString('en-IN')}\n` +
        `• **Remaining Balance:** ₹${remaining.toLocaleString('en-IN')}\n` +
        `• **Daily Spending Pace:** ~₹${summary.dailyAverageExpense.toLocaleString('en-IN')}/day\n\n` +
        `Head over to the **Budget Planner** tab to inspect and tweak individual category limits!`,
      contextUsed: {
        totalBalance: summary.totalBalance,
        monthlyBudgetSpentPercent: utilization,
      },
    };
  }

  // 10. General / Fallback conversational financial answer
  return {
    text:
      `Thank you for asking, ${userName}! As your personal financial assistant, I can help you with:\n\n` +
      `• **Personalized Budgeting:** Ask *"How is my budget doing?"* or *"Am I overspending?"*\n` +
      `• **Saving Strategies:** Ask *"How can I save ₹2,000 every month?"* or *"How to cut expenses?"*\n` +
      `• **Financial Literacy:** Ask about the 50/30/20 rule, Emergency Funds, Compound Interest, Credit Scores, or FDs vs Mutual Funds.\n` +
      `• **Expense Reduction:** Ask *"Which category should I cut back on?"* to analyze your actual recorded transactions.\n\n` +
      `What financial question can I clarify for you today?`,
    contextUsed: {
      totalBalance: summary.totalBalance,
    },
  };
};
