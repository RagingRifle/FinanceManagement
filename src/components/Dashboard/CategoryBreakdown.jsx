import { useFinance } from '../../context/FinanceContext';
import { filterByDateRange, groupByCategory, formatCurrency } from '../../utils/helpers';
import { DATE_RANGES } from '../../utils/constants';

export default function CategoryBreakdown({ dateRange = DATE_RANGES.THIS_MONTH }) {
  const { transactions, settings } = useFinance();

  const expenses = filterByDateRange(transactions, dateRange).filter(t => t.type === 'expense');
  const grouped = groupByCategory(expenses);
  const totalExpenses = grouped.reduce((sum, g) => sum + g.total, 0);

  if (grouped.length === 0) {
    return (
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Spending by Category</h3>
        </div>
        <div className="empty-state">
          <p>No expenses this period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <h3 className="card__title">Spending by Category</h3>
      </div>
      <div className="category-breakdown">
        {grouped.map((group) => {
          const percentage = totalExpenses > 0 ? (group.total / totalExpenses) * 100 : 0;
          return (
            <div key={group.categoryId} className="category-breakdown__item">
              <div className="category-breakdown__header">
                <div className="category-breakdown__left">
                  <div
                    className="category-breakdown__dot"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="category-breakdown__name">{group.categoryName}</span>
                </div>
                <span className="category-breakdown__amount">
                  {formatCurrency(group.total, settings.currency)}
                </span>
              </div>
              <div className="category-breakdown__bar-bg">
                <div
                  className="category-breakdown__bar-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: group.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
