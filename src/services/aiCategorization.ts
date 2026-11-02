import { ExpenseCategory, IncomeCategory, Category } from '../types';

export interface AICategorizationResult {
  suggestedCategory: Category;
  confidence: number;
  reasoning: string;
  isAiSuggested: boolean;
  alternativeCategories?: Category[];
}

interface CategoryRule {
  category: Category;
  keywords: string[];
  weight: number;
}

const CATEGORY_RULES: CategoryRule[] = [
  // Food & Dining
  {
    category: 'Food & Dining',
    keywords: [
      'canteen', 'lunch', 'dinner', 'breakfast', 'brunch', 'food', 'meal',
      'swiggy', 'zomato', 'restaurant', 'cafe', 'coffee', 'chai', 'tea',
      'snacks', 'pizza', 'burger', 'biryani', 'mcdonalds', 'kfc', 'starbucks',
      'ccd', 'mess', 'groceries', 'mart', 'supermarket', 'bakery', 'subway',
      'thali', 'ice cream', 'dominos', 'eat', 'dine'
    ],
    weight: 1.0,
  },

  // Transportation
  {
    category: 'Transportation',
    keywords: [
      'uber', 'ola', 'rapido', 'auto', 'rickshaw', 'cab', 'taxi',
      'metro', 'bus', 'train', 'irctc', 'railway', 'flight', 'airline',
      'petrol', 'diesel', 'fuel', 'cng', 'toll', 'parking', 'bike',
      'scooter', 'fastag', 'transit', 'commute', 'fare'
    ],
    weight: 1.0,
  },

  // Shopping
  {
    category: 'Shopping',
    keywords: [
      'amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'shopping', 'store',
      'clothes', 'shoes', 'electronics', 'gadget', 'headphones', 'earphones',
      'tshirt', 'jeans', 'dress', 'apparel', 'retail', 'mall', 'purchase',
      'order', 'zara', 'h&m', 'decathlon'
    ],
    weight: 1.0,
  },

  // Education
  {
    category: 'Education',
    keywords: [
      'tuition', 'fee', 'college', 'university', 'school', 'course', 'class',
      'udemy', 'coursera', 'edx', 'book', 'textbook', 'exam', 'certification',
      'seminar', 'workshop', 'coaching', 'stationery', 'notes', 'library',
      'journal', 'admission', 'semester', 'degree'
    ],
    weight: 1.0,
  },

  // Entertainment
  {
    category: 'Entertainment',
    keywords: [
      'netflix', 'spotify', 'prime video', 'hotstar', 'disney', 'movie',
      'cinema', 'pvr', 'inox', 'theatre', 'gaming', 'steam', 'playstation',
      'concert', 'party', 'club', 'event', 'amusement', 'youtube premium',
      'hulu', 'subscription', 'game'
    ],
    weight: 1.0,
  },

  // Healthcare
  {
    category: 'Healthcare',
    keywords: [
      'doctor', 'hospital', 'clinic', 'medicine', 'pharmacy', 'chemist',
      'consultation', 'prescription', 'test', 'lab', 'checkup', 'dental',
      'dentist', 'eye', 'glasses', 'apollo', 'medplus', '1mg', 'pharmeasy',
      'therapy', 'bandage', 'vitamin', 'tablet', 'health'
    ],
    weight: 1.0,
  },

  // Bills & Utilities
  {
    category: 'Bills & Utilities',
    keywords: [
      'electricity', 'power', 'water', 'gas', 'lpg', 'bill', 'bescom',
      'wifi', 'broadband', 'internet', 'jio', 'airtel', 'vi', 'vodafone',
      'mobile recharge', 'dth', 'maintenance', 'rent', 'hostel maintenance',
      'utility', 'trash', 'sewage'
    ],
    weight: 1.0,
  },

  // Income: Allowance / Pocket Money
  {
    category: 'Allowance / Pocket Money',
    keywords: [
      'allowance', 'pocket money', 'parents', 'father', 'mother', 'dad', 'mom',
      'family support', 'monthly support', 'sent by home'
    ],
    weight: 1.2,
  },

  // Income: Salary / Stipend
  {
    category: 'Salary / Stipend',
    keywords: [
      'salary', 'stipend', 'internship', 'payroll', 'wages', 'compensation',
      'company pay', 'monthly salary', 'incentive'
    ],
    weight: 1.2,
  },

  // Income: Freelance
  {
    category: 'Freelance',
    keywords: [
      'freelance', 'contract', 'client', 'gig', 'upwork', 'fiverr',
      'project payment', 'consulting', 'commission', 'design work', 'coding gig'
    ],
    weight: 1.2,
  },

  // Income: Investments
  {
    category: 'Investments',
    keywords: [
      'dividend', 'stock return', 'mutual fund', 'interest earned', 'crypto',
      'fixed deposit', 'fd interest', 'profit', 'capital gain', 'zerodha', 'groww'
    ],
    weight: 1.2,
  },

  // Income: Gifts & Awards
  {
    category: 'Gifts & Awards',
    keywords: [
      'gift', 'cashback', 'reward', 'scholarship', 'prize', 'award',
      'hackathon', 'birthday gift', 'festival bonus'
    ],
    weight: 1.2,
  },
];

export const predictCategory = (
  description: string,
  type: 'income' | 'expense' = 'expense'
): AICategorizationResult => {
  const cleanInput = description.toLowerCase().trim();

  if (!cleanInput || cleanInput.length < 2) {
    return {
      suggestedCategory: type === 'income' ? 'Other Income' : 'Other',
      confidence: 0,
      reasoning: 'Input description too short for reliable categorization.',
      isAiSuggested: false,
    };
  }

  // Tokenize
  const tokens = cleanInput.split(/[\s,.-]+/);

  const scores: { category: Category; score: number; matchedKeywords: string[] }[] = [];

  CATEGORY_RULES.forEach((rule) => {
    // Filter matching rule type
    const isIncomeRule = [
      'Allowance / Pocket Money',
      'Salary / Stipend',
      'Freelance',
      'Investments',
      'Gifts & Awards',
      'Other Income',
    ].includes(rule.category);

    if (type === 'income' && !isIncomeRule) return;
    if (type === 'expense' && isIncomeRule) return;

    let score = 0;
    const matched: string[] = [];

    rule.keywords.forEach((keyword) => {
      // Exact substring or token match
      if (cleanInput.includes(keyword)) {
        // Boost for whole token match
        if (tokens.includes(keyword)) {
          score += 1.5 * rule.weight;
        } else {
          score += 1.0 * rule.weight;
        }
        matched.push(keyword);
      }
    });

    if (score > 0) {
      scores.push({
        category: rule.category,
        score,
        matchedKeywords: matched,
      });
    }
  });

  scores.sort((a, b) => b.score - a.score);

  if (scores.length > 0) {
    const best = scores[0];
    const confidence = Math.min(0.99, Math.max(0.65, 0.7 + best.score * 0.1));
    const reasoning = `NLP heuristic matched keywords [${best.matchedKeywords.slice(0, 3).join(', ')}] with ${(confidence * 100).toFixed(0)}% confidence.`;

    return {
      suggestedCategory: best.category,
      confidence,
      reasoning,
      isAiSuggested: true,
      alternativeCategories: scores.slice(1, 3).map((s) => s.category),
    };
  }

  // Default fallback
  const fallbackCategory = type === 'income' ? 'Other Income' : 'Other';
  return {
    suggestedCategory: fallbackCategory,
    confidence: 0.4,
    reasoning: `No specific category pattern matched. Defaulted to ${fallbackCategory}.`,
    isAiSuggested: false,
  };
};
