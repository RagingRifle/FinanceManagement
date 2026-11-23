import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, isWithinInterval, subDays } from 'date-fns';
import { CURRENCIES, DATE_RANGES } from './constants';

// Format currency amount
export function formatCurrency(amount, currencyCode = 'INR') {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency.symbol}${formatted}`;
}

// Format date for display
export function formatDate(date, formatStr = 'dd MMM yyyy') {
  return format(new Date(date), formatStr);
}

// Format date for input fields
export function formatDateForInput(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}

// Get date range boundaries
export function getDateRange(rangeType) {
  const now = new Date();
  switch (rangeType) {
    case DATE_RANGES.TODAY:
      return { start: startOfDay(now), end: endOfDay(now) };
    case DATE_RANGES.THIS_WEEK:
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfDay(now) };
    case DATE_RANGES.THIS_MONTH:
      return { start: startOfMonth(now), end: endOfDay(now) };
    case DATE_RANGES.THIS_YEAR:
      return { start: startOfYear(now), end: endOfDay(now) };
    case DATE_RANGES.LAST_30_DAYS:
      return { start: startOfDay(subDays(now, 30)), end: endOfDay(now) };
    case DATE_RANGES.LAST_90_DAYS:
      return { start: startOfDay(subDays(now, 90)), end: endOfDay(now) };
    case DATE_RANGES.ALL_TIME:
    default:
      return { start: new Date(2000, 0, 1), end: endOfDay(now) };
  }
}

// Filter transactions by date range
export function filterByDateRange(transactions, rangeType) {
  if (rangeType === DATE_RANGES.ALL_TIME) return transactions;
  const { start, end } = getDateRange(rangeType);
  return transactions.filter(t =>
    isWithinInterval(new Date(t.date), { start, end })
  );
}

// Calculate totals from transactions
export function calculateTotals(transactions) {
  return transactions.reduce(
    (totals, t) => {
      if (t.type === 'income') {
        totals.income += t.amount;
      } else {
        totals.expenses += t.amount;
      }
      totals.balance = totals.income - totals.expenses;
      return totals;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
}

// Group transactions by category
export function groupByCategory(transactions) {
  const groups = {};
  transactions.forEach(t => {
    if (!groups[t.categoryId]) {
      groups[t.categoryId] = {
        categoryId: t.categoryId,
        categoryName: t.categoryName,
        total: 0,
        count: 0,
        color: t.categoryColor || '#6b7280',
      };
    }
    groups[t.categoryId].total += t.amount;
    groups[t.categoryId].count += 1;
  });
  return Object.values(groups).sort((a, b) => b.total - a.total);
}

// Generate a unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Get greeting based on time of day
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
