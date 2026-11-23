import { useState } from 'react';
import SummaryCards from '../components/Dashboard/SummaryCards';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown';
import TrendChart from '../components/Dashboard/TrendChart';
import DonutChart from '../components/Dashboard/DonutChart';
import { DATE_RANGES } from '../utils/constants';

const dateRangeLabels = {
  [DATE_RANGES.THIS_WEEK]: 'This Week',
  [DATE_RANGES.THIS_MONTH]: 'This Month',
  [DATE_RANGES.THIS_YEAR]: 'This Year',
  [DATE_RANGES.ALL_TIME]: 'All Time',
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState(DATE_RANGES.THIS_MONTH);

  return (
    <div className="dashboard">
      {/* Period selector */}
      <div className="dashboard__period-selector">
        {Object.entries(dateRangeLabels).map(([value, label]) => (
          <button
            key={value}
            className={`period-btn ${dateRange === value ? 'period-btn--active' : ''}`}
            onClick={() => setDateRange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <SummaryCards dateRange={dateRange} />

      {/* Trend Chart — Full Width */}
      <TrendChart dateRange={dateRange} />

      {/* Content grid */}
      <div className="dashboard__grid">
        <RecentTransactions />
        <DonutChart dateRange={dateRange} />
      </div>

      {/* Category Breakdown — Full Width */}
      <CategoryBreakdown dateRange={dateRange} />
    </div>
  );
}
