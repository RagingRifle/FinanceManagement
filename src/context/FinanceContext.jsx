import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_ACCOUNTS,
  STORAGE_KEYS,
} from '../utils/constants';
import { SAMPLE_TRANSACTIONS } from '../utils/sampleData';
import { generateId } from '../utils/helpers';

const FinanceContext = createContext(null);

const ACTIONS = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  ADD_ACCOUNT: 'ADD_ACCOUNT',
  DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  // Budgets
  ADD_BUDGET: 'ADD_BUDGET',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',
  SET_BUDGETS: 'SET_BUDGETS',
  // Recurring
  ADD_RECURRING: 'ADD_RECURRING',
  UPDATE_RECURRING: 'UPDATE_RECURRING',
  DELETE_RECURRING: 'DELETE_RECURRING',
  SET_RECURRING: 'SET_RECURRING',
};

function financeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case ACTIONS.ADD_TRANSACTION:
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case ACTIONS.UPDATE_TRANSACTION:
      return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case ACTIONS.DELETE_TRANSACTION:
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case ACTIONS.ADD_CATEGORY: {
      const { categoryType, category } = action.payload;
      const key = categoryType === 'income' ? 'incomeCategories' : 'expenseCategories';
      return { ...state, [key]: [...state[key], category] };
    }
    case ACTIONS.DELETE_CATEGORY: {
      const { categoryType: cType, categoryId } = action.payload;
      const catKey = cType === 'income' ? 'incomeCategories' : 'expenseCategories';
      return { ...state, [catKey]: state[catKey].filter(c => c.id !== categoryId) };
    }
    case ACTIONS.ADD_ACCOUNT:
      return { ...state, accounts: [...state.accounts, action.payload] };
    case ACTIONS.DELETE_ACCOUNT:
      return { ...state, accounts: state.accounts.filter(a => a.id !== action.payload) };
    case ACTIONS.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    // Budgets
    case ACTIONS.SET_BUDGETS:
      return { ...state, budgets: action.payload };
    case ACTIONS.ADD_BUDGET:
      return { ...state, budgets: [...state.budgets, action.payload] };
    case ACTIONS.UPDATE_BUDGET:
      return { ...state, budgets: state.budgets.map(b => b.id === action.payload.id ? action.payload : b) };
    case ACTIONS.DELETE_BUDGET:
      return { ...state, budgets: state.budgets.filter(b => b.id !== action.payload) };
    // Recurring
    case ACTIONS.SET_RECURRING:
      return { ...state, recurringTransactions: action.payload };
    case ACTIONS.ADD_RECURRING:
      return { ...state, recurringTransactions: [...state.recurringTransactions, action.payload] };
    case ACTIONS.UPDATE_RECURRING:
      return { ...state, recurringTransactions: state.recurringTransactions.map(r => r.id === action.payload.id ? action.payload : r) };
    case ACTIONS.DELETE_RECURRING:
      return { ...state, recurringTransactions: state.recurringTransactions.filter(r => r.id !== action.payload) };
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [savedTransactions, setSavedTransactions] = useLocalStorage(STORAGE_KEYS.TRANSACTIONS, null);
  const [savedCategories, setSavedCategories] = useLocalStorage(STORAGE_KEYS.CATEGORIES, null);
  const [savedAccounts, setSavedAccounts] = useLocalStorage(STORAGE_KEYS.ACCOUNTS, null);
  const [savedSettings, setSavedSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, { currency: 'INR', userName: 'User' });
  const [savedBudgets, setSavedBudgets] = useLocalStorage('pfm_budgets', []);
  const [savedRecurring, setSavedRecurring] = useLocalStorage('pfm_recurring', []);

  const initialState = {
    transactions: savedTransactions || SAMPLE_TRANSACTIONS,
    expenseCategories: savedCategories?.expense || DEFAULT_EXPENSE_CATEGORIES,
    incomeCategories: savedCategories?.income || DEFAULT_INCOME_CATEGORIES,
    accounts: savedAccounts || DEFAULT_ACCOUNTS,
    settings: savedSettings,
    budgets: savedBudgets || [],
    recurringTransactions: savedRecurring || [],
  };

  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Persist
  useEffect(() => { setSavedTransactions(state.transactions); }, [state.transactions]);
  useEffect(() => { setSavedCategories({ expense: state.expenseCategories, income: state.incomeCategories }); }, [state.expenseCategories, state.incomeCategories]);
  useEffect(() => { setSavedAccounts(state.accounts); }, [state.accounts]);
  useEffect(() => { setSavedSettings(state.settings); }, [state.settings]);
  useEffect(() => { setSavedBudgets(state.budgets); }, [state.budgets]);
  useEffect(() => { setSavedRecurring(state.recurringTransactions); }, [state.recurringTransactions]);

  // Transaction actions
  const addTransaction = (transaction) => {
    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: { ...transaction, id: generateId() } });
  };
  const updateTransaction = (transaction) => {
    dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: transaction });
  };
  const deleteTransaction = (id) => {
    dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  };

  // Category actions
  const addCategory = (categoryType, category) => {
    dispatch({ type: ACTIONS.ADD_CATEGORY, payload: { categoryType, category: { ...category, id: generateId() } } });
  };
  const deleteCategory = (categoryType, categoryId) => {
    dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: { categoryType, categoryId } });
  };

  // Account actions
  const addAccount = (account) => {
    dispatch({ type: ACTIONS.ADD_ACCOUNT, payload: { ...account, id: generateId() } });
  };
  const deleteAccount = (id) => {
    dispatch({ type: ACTIONS.DELETE_ACCOUNT, payload: id });
  };

  // Settings
  const updateSettings = (settings) => {
    dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: settings });
  };

  // Budget actions
  const addBudget = (budget) => {
    dispatch({ type: ACTIONS.ADD_BUDGET, payload: { ...budget, id: generateId() } });
  };
  const updateBudget = (budget) => {
    dispatch({ type: ACTIONS.UPDATE_BUDGET, payload: budget });
  };
  const deleteBudget = (id) => {
    dispatch({ type: ACTIONS.DELETE_BUDGET, payload: id });
  };

  // Recurring actions
  const addRecurring = (recurring) => {
    dispatch({ type: ACTIONS.ADD_RECURRING, payload: { ...recurring, id: generateId(), createdAt: new Date().toISOString() } });
  };
  const updateRecurring = (recurring) => {
    dispatch({ type: ACTIONS.UPDATE_RECURRING, payload: recurring });
  };
  const deleteRecurring = (id) => {
    dispatch({ type: ACTIONS.DELETE_RECURRING, payload: id });
  };

  // Data management
  const clearAllData = () => {
    dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: [] });
  };
  const loadSampleData = () => {
    dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: SAMPLE_TRANSACTIONS });
  };

  // Import transactions
  const importTransactions = useCallback((newTransactions) => {
    dispatch({
      type: ACTIONS.SET_TRANSACTIONS,
      payload: [...state.transactions, ...newTransactions.map(t => ({ ...t, id: generateId() }))],
    });
  }, [state.transactions]);

  // Export transactions as CSV
  const exportAsCSV = useCallback(() => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Account', 'Note'];
    const rows = state.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(t => [t.date, t.type, t.categoryName, t.amount, t.accountName, t.note || '']);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeflow_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.transactions]);

  // Export as JSON
  const exportAsJSON = useCallback(() => {
    const data = {
      transactions: state.transactions,
      budgets: state.budgets,
      recurringTransactions: state.recurringTransactions,
      categories: { expense: state.expenseCategories, income: state.incomeCategories },
      accounts: state.accounts,
      settings: state.settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const value = {
    ...state,
    addTransaction, updateTransaction, deleteTransaction,
    addCategory, deleteCategory,
    addAccount, deleteAccount,
    updateSettings,
    addBudget, updateBudget, deleteBudget,
    addRecurring, updateRecurring, deleteRecurring,
    clearAllData, loadSampleData,
    importTransactions, exportAsCSV, exportAsJSON,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
}
