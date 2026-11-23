import { Search, Filter } from 'lucide-react';
import { DATE_RANGES } from '../../utils/constants';
import { useFinance } from '../../context/FinanceContext';

const dateRangeLabels = {
  [DATE_RANGES.TODAY]: 'Today',
  [DATE_RANGES.THIS_WEEK]: 'This Week',
  [DATE_RANGES.THIS_MONTH]: 'This Month',
  [DATE_RANGES.THIS_YEAR]: 'This Year',
  [DATE_RANGES.LAST_30_DAYS]: 'Last 30 Days',
  [DATE_RANGES.LAST_90_DAYS]: 'Last 90 Days',
  [DATE_RANGES.ALL_TIME]: 'All Time',
};

export default function TransactionFilters({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
}) {
  const { expenseCategories, incomeCategories } = useFinance();
  const allCategories = [...expenseCategories, ...incomeCategories];

  return (
    <div className="transaction-filters">
      {/* Search */}
      <div className="filter-search">
        <Search size={18} className="filter-search__icon" />
        <input
          type="text"
          className="form-input filter-search__input"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-row">
        {/* Date Range */}
        <select
          className="form-input filter-select"
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
        >
          {Object.entries(dateRangeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          className="form-input filter-select"
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category Filter */}
        <select
          className="form-input filter-select"
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
