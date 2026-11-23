import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, filterByDateRange, calculateTotals, groupByCategory } from '../utils/helpers';
import { DATE_RANGES } from '../utils/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieIcon, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(16, 18, 40, 0.95)', border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px', padding: '12px 16px', backdropFilter: 'blur(10px)',
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

const dateRangeLabels = {
  [DATE_RANGES.THIS_MONTH]: 'This Month',
  [DATE_RANGES.LAST_30_DAYS]: 'Last 30 Days',
  [DATE_RANGES.LAST_90_DAYS]: 'Last 90 Days',
  [DATE_RANGES.THIS_YEAR]: 'This Year',
  [DATE_RANGES.ALL_TIME]: 'All Time',
};

export default function ReportsPage() {
  const { transactions, settings } = useFinance();
  const [dateRange, setDateRange] = useState(DATE_RANGES.THIS_YEAR);

  const filtered = useMemo(() => filterByDateRange(transactions, dateRange), [transactions, dateRange]);
  const totals = useMemo(() => calculateTotals(filtered), [filtered]);

  // Monthly comparison data (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = eachMonthOfInterval({
      start: subMonths(startOfMonth(now), 5),
      end: startOfMonth(now),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d >= monthStart && d <= monthEnd;
      });

      const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        short: format(month, 'MMM'),
        Income: income,
        Expenses: expenses,
        Savings: income - expenses,
      };
    });
  }, [transactions]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const expenses = filtered.filter(t => t.type === 'expense');
    return groupByCategory(expenses).slice(0, 8);
  }, [filtered]);

  const totalExpenseForPie = categoryData.reduce((s, c) => s + c.total, 0);

  // Top transactions
  const topExpenses = useMemo(() => {
    return [...filtered]
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filtered]);

  const avgDailyExpense = useMemo(() => {
    const expenses = filtered.filter(t => t.type === 'expense');
    if (expenses.length === 0) return 0;
    const days = new Set(expenses.map(t => t.date)).size;
    return days > 0 ? expenses.reduce((s, t) => s + t.amount, 0) / days : 0;
  }, [filtered]);

  const savingsRate = totals.income > 0 ? ((totals.income - totals.expenses) / totals.income * 100) : 0;

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Reports & Analytics</h2>
          <p className="page-subtitle">Deep dive into your financial patterns</p>
        </div>
      </div>

      {/* Period Selector */}
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

      {/* Stats Overview */}
      <div className="report-stats">
        <div className="report-stat">
          <div className="report-stat__icon report-stat__icon--income"><TrendingUp size={18} /></div>
          <div>
            <span className="report-stat__label">Total Income</span>
            <span className="report-stat__value report-stat__value--income">{formatCurrency(totals.income, settings.currency)}</span>
          </div>
        </div>
        <div className="report-stat">
          <div className="report-stat__icon report-stat__icon--expense"><TrendingDown size={18} /></div>
          <div>
            <span className="report-stat__label">Total Expenses</span>
            <span className="report-stat__value report-stat__value--expense">{formatCurrency(totals.expenses, settings.currency)}</span>
          </div>
        </div>
        <div className="report-stat">
          <div className="report-stat__icon report-stat__icon--savings"><BarChart3 size={18} /></div>
          <div>
            <span className="report-stat__label">Savings Rate</span>
            <span className="report-stat__value">{savingsRate.toFixed(1)}%</span>
          </div>
        </div>
        <div className="report-stat">
          <div className="report-stat__icon report-stat__icon--daily"><Calendar size={18} /></div>
          <div>
            <span className="report-stat__label">Avg Daily Expense</span>
            <span className="report-stat__value">{formatCurrency(avgDailyExpense, settings.currency)}</span>
          </div>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="card report-chart">
        <div className="card__header">
          <h3 className="card__title">Monthly Income vs Expenses</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(80, 85, 150, 0.08)" vertical={false} />
            <XAxis dataKey="short" axisLine={false} tickLine={false} tick={{ fill: '#555876', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555876', fontSize: 11 }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
            <Tooltip content={<CustomTooltip currency={settings.currency} />} />
            <Bar dataKey="Income" fill="#34d399" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="Expenses" fill="#f87171" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="reports-grid">
        {/* Savings Trend */}
        <div className="card report-chart">
          <div className="card__header">
            <h3 className="card__title">Savings Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(80, 85, 150, 0.08)" vertical={false} />
              <XAxis dataKey="short" axisLine={false} tickLine={false} tick={{ fill: '#555876', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555876', fontSize: 11 }}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip currency={settings.currency} />} />
              <Area type="monotone" dataKey="Savings" stroke="#6366f1" strokeWidth={2.5} fill="url(#savingsGrad)"
                dot={false} activeDot={{ r: 5, stroke: '#6366f1', strokeWidth: 2, fill: '#0a0a1a' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="card report-chart">
          <div className="card__header">
            <h3 className="card__title">Expense Categories</h3>
          </div>
          {categoryData.length === 0 ? (
            <div className="empty-state"><p>No expenses in this period</p></div>
          ) : (
            <div className="donut-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData.map(c => ({ name: c.categoryName, value: c.total, color: c.color }))}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}
                    dataKey="value" cornerRadius={4} stroke="none">
                    {categoryData.map((c, i) => (
                      <Cell key={i} fill={c.color} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip currency={settings.currency} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-chart-legend">
                {categoryData.map((c, i) => (
                  <div key={i} className="donut-chart-legend__item">
                    <span className="donut-chart-legend__dot" style={{ backgroundColor: c.color }} />
                    <span>{c.categoryName} ({totalExpenseForPie > 0 ? ((c.total / totalExpenseForPie) * 100).toFixed(1) : 0}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Expenses */}
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Top Expenses</h3>
        </div>
        {topExpenses.length === 0 ? (
          <div className="empty-state"><p>No expenses in this period</p></div>
        ) : (
          <div className="top-expenses">
            {topExpenses.map((t, i) => (
              <div key={t.id} className="top-expense-item">
                <span className="top-expense-item__rank">#{i + 1}</span>
                <div className="top-expense-item__dot" style={{ backgroundColor: t.categoryColor }} />
                <div className="top-expense-item__info">
                  <span className="top-expense-item__name">{t.categoryName}</span>
                  <span className="top-expense-item__note">{t.note || t.accountName} · {t.date}</span>
                </div>
                <span className="top-expense-item__amount">{formatCurrency(t.amount, settings.currency)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
