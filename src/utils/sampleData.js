import { subDays, format } from 'date-fns';
import { generateId } from './helpers';

function daysAgo(n) {
  return format(subDays(new Date(), n), 'yyyy-MM-dd');
}

export const SAMPLE_TRANSACTIONS = [
  // Recent income
  { id: generateId(), type: 'income', amount: 75000, categoryId: 'salary', categoryName: 'Salary', categoryColor: '#22c55e', accountId: 'bank', accountName: 'Bank Account', date: daysAgo(1), note: 'March salary', },
  { id: generateId(), type: 'income', amount: 15000, categoryId: 'freelance', categoryName: 'Freelance', categoryColor: '#3b82f6', accountId: 'upi', accountName: 'UPI', date: daysAgo(5), note: 'Website project payment', },
  { id: generateId(), type: 'income', amount: 2500, categoryId: 'investments', categoryName: 'Investments', categoryColor: '#8b5cf6', accountId: 'bank', accountName: 'Bank Account', date: daysAgo(10), note: 'Dividend payout', },

  // Recent expenses
  { id: generateId(), type: 'expense', amount: 450, categoryId: 'food', categoryName: 'Food & Dining', categoryColor: '#f97316', accountId: 'upi', accountName: 'UPI', date: daysAgo(0), note: 'Lunch at restaurant', },
  { id: generateId(), type: 'expense', amount: 15000, categoryId: 'rent', categoryName: 'Rent', categoryColor: '#14b8a6', accountId: 'bank', accountName: 'Bank Account', date: daysAgo(2), note: 'March rent', },
  { id: generateId(), type: 'expense', amount: 2300, categoryId: 'groceries', categoryName: 'Groceries', categoryColor: '#22c55e', accountId: 'upi', accountName: 'UPI', date: daysAgo(3), note: 'Weekly groceries', },
  { id: generateId(), type: 'expense', amount: 800, categoryId: 'transport', categoryName: 'Transport', categoryColor: '#3b82f6', accountId: 'upi', accountName: 'UPI', date: daysAgo(3), note: 'Uber rides', },
  { id: generateId(), type: 'expense', amount: 199, categoryId: 'subscriptions', categoryName: 'Subscriptions', categoryColor: '#a855f7', accountId: 'credit_card', accountName: 'Credit Card', date: daysAgo(4), note: 'Netflix subscription', },
  { id: generateId(), type: 'expense', amount: 3500, categoryId: 'shopping', categoryName: 'Shopping', categoryColor: '#ec4899', accountId: 'credit_card', accountName: 'Credit Card', date: daysAgo(6), note: 'New shoes', },
  { id: generateId(), type: 'expense', amount: 1200, categoryId: 'bills', categoryName: 'Bills & Utilities', categoryColor: '#eab308', accountId: 'bank', accountName: 'Bank Account', date: daysAgo(7), note: 'Electricity bill', },
  { id: generateId(), type: 'expense', amount: 500, categoryId: 'entertainment', categoryName: 'Entertainment', categoryColor: '#8b5cf6', accountId: 'cash', accountName: 'Cash', date: daysAgo(8), note: 'Movie tickets', },
  { id: generateId(), type: 'expense', amount: 1500, categoryId: 'health', categoryName: 'Health & Medical', categoryColor: '#ef4444', accountId: 'upi', accountName: 'UPI', date: daysAgo(12), note: 'Doctor visit', },
  { id: generateId(), type: 'expense', amount: 350, categoryId: 'food', categoryName: 'Food & Dining', categoryColor: '#f97316', accountId: 'cash', accountName: 'Cash', date: daysAgo(14), note: 'Coffee & snacks', },
  { id: generateId(), type: 'expense', amount: 1800, categoryId: 'groceries', categoryName: 'Groceries', categoryColor: '#22c55e', accountId: 'upi', accountName: 'UPI', date: daysAgo(16), note: 'Monthly groceries', },

  // Older transactions
  { id: generateId(), type: 'income', amount: 75000, categoryId: 'salary', categoryName: 'Salary', categoryColor: '#22c55e', accountId: 'bank', accountName: 'Bank Account', date: daysAgo(30), note: 'February salary', },
  { id: generateId(), type: 'expense', amount: 15000, categoryId: 'rent', categoryName: 'Rent', categoryColor: '#14b8a6', accountId: 'bank', accountName: 'Bank Account', date: daysAgo(32), note: 'February rent', },
  { id: generateId(), type: 'expense', amount: 5000, categoryId: 'travel', categoryName: 'Travel', categoryColor: '#0ea5e9', accountId: 'credit_card', accountName: 'Credit Card', date: daysAgo(20), note: 'Weekend trip', },
  { id: generateId(), type: 'expense', amount: 2000, categoryId: 'education', categoryName: 'Education', categoryColor: '#06b6d4', accountId: 'upi', accountName: 'UPI', date: daysAgo(25), note: 'Online course', },
];
