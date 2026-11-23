import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, filterByDateRange, groupByCategory } from '../utils/helpers';
import { DATE_RANGES } from '../utils/constants';
import { Plus, Trash2, Pencil, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import Modal from '../components/common/Modal';
import BudgetForm from '../components/Budgets/BudgetForm';

export default function BudgetsPage() {
  const { budgets, transactions, settings, deleteBudget } = useFinance();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // Calculate spending for each budget
  const budgetData = useMemo(() => {
    const thisMonthTransactions = filterByDateRange(transactions, DATE_RANGES.THIS_MONTH)
      .filter(t => t.type === 'expense');

    return budgets.map(budget => {
      const spent = thisMonthTransactions
        .filter(t => t.categoryId === budget.categoryId)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      const remaining = budget.amount - spent;

      return {
        ...budget,
        spent,
        percentage: Math.min(percentage, 100),
        rawPercentage: percentage,
        remaining,
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'ok',
      };
    });
  }, [budgets, transactions]);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetData.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleDelete = (id, name) => {
    deleteBudget(id);
    addToast(`Budget for "${name}" deleted`, 'info');
  };

  return (
    <div className="budgets-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Budgets</h2>
          <p className="page-subtitle">Track your spending limits this month</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Overview Card */}
      {budgets.length > 0 && (
        <div className="budget-overview">
          <div className="budget-overview__stats">
            <div className="budget-overview__stat">
              <span className="budget-overview__stat-label">Total Budget</span>
              <span className="budget-overview__stat-value">{formatCurrency(totalBudget, settings.currency)}</span>
            </div>
            <div className="budget-overview__stat">
              <span className="budget-overview__stat-label">Total Spent</span>
              <span className="budget-overview__stat-value budget-overview__stat-value--spent">
                {formatCurrency(totalSpent, settings.currency)}
              </span>
            </div>
            <div className="budget-overview__stat">
              <span className="budget-overview__stat-label">Remaining</span>
              <span className={`budget-overview__stat-value ${totalBudget - totalSpent < 0 ? 'budget-overview__stat-value--exceeded' : 'budget-overview__stat-value--remaining'}`}>
                {formatCurrency(Math.abs(totalBudget - totalSpent), settings.currency)}
              </span>
            </div>
          </div>
          <div className="budget-overview__bar-bg">
            <div
              className={`budget-overview__bar-fill ${overallPercentage >= 100 ? 'budget-overview__bar-fill--exceeded' : overallPercentage >= 80 ? 'budget-overview__bar-fill--warning' : ''}`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
          <span className="budget-overview__percentage">{overallPercentage.toFixed(1)}% used</span>
        </div>
      )}

      {/* Budget List */}
      {budgetData.length === 0 ? (
        <div className="empty-state">
          <p>No budgets set yet</p>
          <p className="empty-state__hint">Create a budget to track your spending limits by category</p>
        </div>
      ) : (
        <div className="budget-grid">
          {budgetData.map(budget => (
            <div key={budget.id} className={`budget-card budget-card--${budget.status}`}>
              <div className="budget-card__header">
                <div className="budget-card__category">
                  <div className="budget-card__dot" style={{ backgroundColor: budget.categoryColor }} />
                  <span className="budget-card__name">{budget.categoryName}</span>
                </div>
                <div className="budget-card__actions">
                  <button className="icon-btn" onClick={() => { setEditingBudget(budget); setShowForm(true); }}>
                    <Pencil size={13} />
                  </button>
                  <button className="icon-btn icon-btn--danger" onClick={() => handleDelete(budget.id, budget.categoryName)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="budget-card__amounts">
                <span className="budget-card__spent">{formatCurrency(budget.spent, settings.currency)}</span>
                <span className="budget-card__limit">/ {formatCurrency(budget.amount, settings.currency)}</span>
              </div>

              <div className="budget-card__bar-bg">
                <div
                  className="budget-card__bar-fill"
                  style={{
                    width: `${budget.percentage}%`,
                    backgroundColor: budget.status === 'exceeded' ? 'var(--expense-color)' :
                      budget.status === 'warning' ? 'var(--warning-color)' : budget.categoryColor,
                  }}
                />
              </div>

              <div className="budget-card__footer">
                {budget.status === 'exceeded' ? (
                  <span className="budget-card__status budget-card__status--exceeded">
                    <AlertTriangle size={13} /> Over by {formatCurrency(Math.abs(budget.remaining), settings.currency)}
                  </span>
                ) : budget.status === 'warning' ? (
                  <span className="budget-card__status budget-card__status--warning">
                    <AlertTriangle size={13} /> {budget.rawPercentage.toFixed(0)}% used
                  </span>
                ) : (
                  <span className="budget-card__status budget-card__status--ok">
                    <CheckCircle size={13} /> {formatCurrency(budget.remaining, settings.currency)} left
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Budget Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingBudget(null); }}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <BudgetForm
          budget={editingBudget}
          onClose={() => { setShowForm(false); setEditingBudget(null); }}
        />
      </Modal>
    </div>
  );
}
