import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function RecentTransactions() {
  const { transactions, settings } = useFinance();

  // Sort by date and take the 8 most recent
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  if (recent.length === 0) {
    return (
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Recent Transactions</h3>
        </div>
        <div className="empty-state">
          <p>No transactions yet. Add your first transaction!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <h3 className="card__title">Recent Transactions</h3>
      </div>
      <div className="recent-transactions">
        {recent.map((t) => (
          <div key={t.id} className="recent-transaction">
            <div
              className="recent-transaction__category-dot"
              style={{ backgroundColor: t.categoryColor }}
            />
            <div className="recent-transaction__info">
              <span className="recent-transaction__name">{t.categoryName}</span>
              <span className="recent-transaction__note">{t.note || 'No note'}</span>
            </div>
            <div className="recent-transaction__right">
              <span
                className={`recent-transaction__amount ${
                  t.type === 'income'
                    ? 'recent-transaction__amount--income'
                    : 'recent-transaction__amount--expense'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount, settings.currency)}
              </span>
              <span className="recent-transaction__date">
                {formatDate(t.date, 'dd MMM')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
