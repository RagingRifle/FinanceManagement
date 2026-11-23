import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import { filterByDateRange } from '../utils/helpers';
import { DATE_RANGES } from '../utils/constants';

export default function TransactionsPage() {
  const { transactions } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(DATE_RANGES.ALL_TIME);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    let filtered = filterByDateRange(transactions, dateRange);

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.categoryId === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.categoryName.toLowerCase().includes(query) ||
          t.note?.toLowerCase().includes(query) ||
          t.accountName.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, dateRange, typeFilter, categoryFilter, searchQuery]);

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2 className="page-title">Transactions</h2>
        <span className="page-count">{filteredTransactions.length} transactions</span>
      </div>

      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      <TransactionList transactions={filteredTransactions} />
    </div>
  );
}
