// Default categories for expenses and income
export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#f97316' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'Receipt', color: '#eab308' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Gamepad2', color: '#8b5cf6' },
  { id: 'health', name: 'Health & Medical', icon: 'Heart', color: '#ef4444' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: '#06b6d4' },
  { id: 'rent', name: 'Rent', icon: 'Home', color: '#14b8a6' },
  { id: 'groceries', name: 'Groceries', icon: 'Apple', color: '#22c55e' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'CreditCard', color: '#a855f7' },
  { id: 'travel', name: 'Travel', icon: 'Plane', color: '#0ea5e9' },
  { id: 'other_expense', name: 'Other', icon: 'MoreHorizontal', color: '#6b7280' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'Briefcase', color: '#22c55e' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: '#3b82f6' },
  { id: 'investments', name: 'Investments', icon: 'TrendingUp', color: '#8b5cf6' },
  { id: 'gifts', name: 'Gifts', icon: 'Gift', color: '#ec4899' },
  { id: 'refunds', name: 'Refunds', icon: 'RotateCcw', color: '#f97316' },
  { id: 'other_income', name: 'Other', icon: 'MoreHorizontal', color: '#6b7280' },
];

export const DEFAULT_ACCOUNTS = [
  { id: 'cash', name: 'Cash', icon: 'Wallet', color: '#22c55e' },
  { id: 'bank', name: 'Bank Account', icon: 'Landmark', color: '#3b82f6' },
  { id: 'credit_card', name: 'Credit Card', icon: 'CreditCard', color: '#ef4444' },
  { id: 'upi', name: 'UPI', icon: 'Smartphone', color: '#8b5cf6' },
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const DATE_RANGES = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_YEAR: 'this_year',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  ALL_TIME: 'all_time',
  CUSTOM: 'custom',
};

export const STORAGE_KEYS = {
  TRANSACTIONS: 'pfm_transactions',
  CATEGORIES: 'pfm_categories',
  ACCOUNTS: 'pfm_accounts',
  SETTINGS: 'pfm_settings',
};
