import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { filterByDateRange, formatCurrency } from '../../utils/helpers';
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from 'date-fns';

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'rgba(16, 18, 40, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px',
      padding: '12px 16px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <p style={{ color: '#8b8fb0', fontSize: '12px', marginBottom: '8px', fontWeight: 500 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
          {entry.name}: {formatCurrency(entry.value, currency)}
        </p>
      ))}
    </div>
  );
};

export default function TrendChart({ dateRange }) {
  const { transactions, settings } = useFinance();

  const chartData = useMemo(() => {
    const now = new Date();
    const daysToShow = 30;
    const start = startOfDay(subDays(now, daysToShow - 1));
    const end = startOfDay(now);

    const days = eachDayOfInterval({ start, end });

    const dailyData = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayTransactions = transactions.filter(t => t.date === dayStr);

      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, 'dd MMM'),
        Income: income,
        Expenses: expense,
      };
    });

    return dailyData;
  }, [transactions]);

  const hasData = chartData.some(d => d.Income > 0 || d.Expenses > 0);

  if (!hasData) {
    return (
      <div className="card trend-chart">
        <div className="card__header">
          <h3 className="card__title">Income vs Expenses — Last 30 Days</h3>
        </div>
        <div className="empty-state">
          <p>Not enough data to show trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card trend-chart">
      <div className="card__header">
        <h3 className="card__title">Income vs Expenses — Last 30 Days</h3>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(80, 85, 150, 0.08)" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#555876', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#555876', fontSize: 11 }}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
          />
          <Tooltip content={<CustomTooltip currency={settings.currency} />} />
          <Area
            type="monotone"
            dataKey="Income"
            stroke="#34d399"
            strokeWidth={2.5}
            fill="url(#incomeGrad)"
            dot={false}
            activeDot={{ r: 5, stroke: '#34d399', strokeWidth: 2, fill: '#0a0a1a' }}
          />
          <Area
            type="monotone"
            dataKey="Expenses"
            stroke="#f87171"
            strokeWidth={2.5}
            fill="url(#expenseGrad)"
            dot={false}
            activeDot={{ r: 5, stroke: '#f87171', strokeWidth: 2, fill: '#0a0a1a' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
