# FinWise AI – Your Personal AI Financial Assistant

**FinWise AI** is an AI-powered personal finance management web application specifically engineered for students, young earners, and individuals. Built for an academic **AI for Finance (CIA-2)** coursework evaluation and live demonstration, it solves real-world personal finance friction through intelligent automation, dynamic cash flow analytics, and context-aware conversational guidance.

---

## 🌟 Key Capabilities & Features

### 1. Financial Dashboard
- **Dynamic Ledger Summary Cards:** Real-time calculation of Total Balance, Total Income, Total Expenses, and Net Savings Rate directly from stored transaction records in Indian Rupees (₹).
- **Cash Flow Overview Chart:** Interactive Recharts bar visualization comparing incoming cash against expenses with **Last 7 Days (Weekly)** and **Monthly (4 Weeks)** toggle filters.
- **Expense Breakdown Donut Chart:** Visualizes category distribution across Food & Dining, Transportation, Shopping, Education, Entertainment, Healthcare, Bills & Utilities, and Other with interactive tooltips and center metrics.
- **Recent Transactions Feed:** Five most recent entries with transaction category badge, relative timestamp, and AI classification indicator.
- **AI Financial Snapshot Banner:** Synthesizes a real-time natural language summary of highest expense impact and savings health calculated dynamically from stored data.

### 2. Transaction Management & AI Categorization
- **Full CRUD Operations:** Add, edit, and delete transactions with instant calculation updates.
- **AI Automatic Category Classification:** As you type the transaction description (e.g., *"Lunch at college canteen"*, *"Uber ride to campus"*, *"Amazon textbook"*), the built-in Natural Language Processing heuristic engine predicts the category in real time, displays confidence scores, and documents the reasoning.
- **Manual Verification & Override:** Users can manually select or correct any category; manual selections are never silently overwritten.
- **Filter, Search, & Sort:** Search across description, notes, and merchant names. Filter by type (Income vs Expense), filter by category, sort by amount/date, and export filtered ledgers to CSV.

### 3. AI-Powered Financial Insights
- **Data-Driven Recommendations:** Identifies excessive spending in categories exceeding 20%–25% of total outflow, detects savings margin anomalies, and calculates actionable rupee savings potential.
- **50 / 30 / 20 Budget Health Analysis:** Compares user's actual spending ratio (Needs vs Wants vs Savings) against the classic 50/30/20 standard with visual progress gauges.
- **Academic AI Demarcation:** Prominently explains the architectural distinction between deterministic rule calculations and AI natural language intelligence.

### 4. Smart Budget Planner
- **Monthly Target Budgeting:** Set and adjust overall monthly budget limits.
- **Category-Specific Budget Allocations:** Configure individual limits for all 8 spending categories.
- **Real-Time Threshold Alerts:** Automatically flags categories with visual progress indicators:
  - **Normal** (<70% – Emerald)
  - **Caution** (70%–89% – Amber)
  - **Urgent Warning** (90%–99% – Rose)
  - **Exceeded** (≥100% – Pulsing Red Alert)

### 5. FinWise Assistant (Context-Aware Conversational AI)
- **Personalized Context Injection:** When asked *"How can I save more money?"* or *"Am I overspending?"*, the chatbot analyzes the user's actual balance, income, expenses, and top spending category before responding.
- **Financial Literacy Domains:** Answers questions on the 50/30/20 rule, monthly ₹2,000 savings goals, Fixed Deposits vs Mutual Funds, Compound Interest formulas ($A = P(1 + r/n)^{nt}$), Emergency Funds, and CIBIL Credit Scores.
- **Financial Safety Guardrails:** Strictly maintains educational posture, avoids guaranteeing investment returns, never asks for banking credentials/OTPs, and recommends certified professionals for high-stakes decisions.

### 6. Demonstration Mode & Persistence
- **Realistic Sample Dataset:** Preloaded with 20 realistic Indian Rupee (₹) student transactions across all categories with dynamically computed relative dates.
- **Load / Reset Demo Data Button:** Quickly reloads sample transactions from the sidebar or settings without overwriting user changes during normal page reloads.
- **Persistent LocalStorage:** All transactions, budget limits, and user preferences persist locally in browser storage.
- **Zero Paid Dependencies:** Fully functional out-of-the-box with no required third-party paid API keys.

---

## 🛠️ Technology Stack

- **Framework:** React 19 with TypeScript
- **Bundler:** Vite 8.3
- **Styling:** Tailwind CSS 3.4 (Custom dark fintech aesthetic with Navy `#080C14` & Indigo `#6366F1`)
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **Storage:** Browser LocalStorage

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Run
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle and test
npm run build
npm run preview
```

Open `http://localhost:5173` (or the URL displayed in your terminal) to explore FinWise AI.
