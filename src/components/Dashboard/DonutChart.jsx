import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { filterByDateRange, groupByCategory, formatCurrency } from '../../utils/helpers';
import { DATE_RANGES } from '../../utils/constants';

const CustomTooltip = ({ active, payload, currency }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  return (
    <div style={{
      background: 'rgba(16, 18, 40, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px',
      padding: '12px 16px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <p style={{ color: data.payload.color, fontSize: '13px', fontWeight: 600 }}>
        {data.name}
      </p>
      <p style={{ color: '#f0f1f7', fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>
        {formatCurrency(data.value, currency)}
      </p>
      <p style={{ color: '#8b8fb0', fontSize: '11px', marginTop: '2px' }}>
        {data.payload.percentage}%
      </p>
    </div>
  );
};

export default function DonutChart({ dateRange = DATE_RANGES.THIS_MONTH }) {
  const { transactions, settings } = useFinance();

  const chartData = useMemo(() => {
    const expenses = filterByDateRange(transactions, dateRange).filter(t => t.type === 'expense');
    const grouped = groupByCategory(expenses);
    const total = grouped.reduce((sum, g) => sum + g.total, 0);

    return grouped.slice(0, 6).map(g => ({
      name: g.categoryName,
      value: g.total,
      color: g.color,
      percentage: total > 0 ? ((g.total / total) * 100).toFixed(1) : 0,
    }));
  }, [transactions, dateRange]);

  if (chartData.length === 0) {
    return (
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Spending Distribution</h3>
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
        <h3 className="card__title">Spending Distribution</h3>
      </div>
      <div className="donut-chart-container">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              cornerRadius={4}
              stroke="none"
              animationBegin={200}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={settings.currency} />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="donut-chart-legend">
          {chartData.map((entry, index) => (
            <div key={index} className="donut-chart-legend__item">
              <span className="donut-chart-legend__dot" style={{ backgroundColor: entry.color }} />
              <span>{entry.name} ({entry.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
