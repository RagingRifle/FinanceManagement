import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { calculateTotals, formatCurrency, filterByDateRange } from '../../utils/helpers';
import { DATE_RANGES } from '../../utils/constants';

export default function SummaryCards({ dateRange = DATE_RANGES.THIS_MONTH }) {
  const { transactions, settings } = useFinance();
  const filtered = filterByDateRange(transactions, dateRange);
  const { income, expenses, balance } = calculateTotals(filtered);

  const cards = [
    {
      id: 'income',
      label: 'Total Income',
      amount: income,
      icon: TrendingUp,
      className: 'summary-card--income',
    },
    {
      id: 'expenses',
      label: 'Total Expenses',
      amount: expenses,
      icon: TrendingDown,
      className: 'summary-card--expense',
    },
    {
      id: 'balance',
      label: 'Balance',
      amount: balance,
      icon: Wallet,
      className: 'summary-card--balance',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map(({ id, label, amount, icon: Icon, className }) => (
        <div key={id} className={`summary-card ${className}`}>
          <div className="summary-card__header">
            <span className="summary-card__label">{label}</span>
            <div className="summary-card__icon">
              <Icon size={20} />
            </div>
          </div>
          <div className="summary-card__amount">
            {formatCurrency(amount, settings.currency)}
          </div>
        </div>
      ))}
    </div>
  );
}
