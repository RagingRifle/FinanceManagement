import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Plus, Trash2, Pencil, RefreshCw, ArrowUpRight, ArrowDownRight, Pause, Play } from 'lucide-react';
import Modal from '../components/common/Modal';
import RecurringForm from '../components/Recurring/RecurringForm';

const frequencyLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export default function RecurringPage() {
  const { recurringTransactions, deleteRecurring, addTransaction } = useFinance();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState(null);

  const handleDelete = (id, name) => {
    deleteRecurring(id);
    addToast(`Recurring "${name}" deleted`, 'info');
  };

  const handleApplyNow = (rec) => {
    addTransaction({
      type: rec.type,
      amount: rec.amount,
      categoryId: rec.categoryId,
      categoryName: rec.categoryName,
      categoryColor: rec.categoryColor,
      accountId: rec.accountId,
      accountName: rec.accountName,
      date: new Date().toISOString().split('T')[0],
      note: `${rec.name} (recurring)`,
    });
    addToast(`Added ${rec.type} of ₹${rec.amount} for "${rec.name}"`, 'success');
  };

  const incomeRecurring = recurringTransactions.filter(r => r.type === 'income');
  const expenseRecurring = recurringTransactions.filter(r => r.type === 'expense');
  const totalMonthlyIncome = incomeRecurring.reduce((sum, r) => {
    if (r.frequency === 'monthly') return sum + r.amount;
    if (r.frequency === 'weekly') return sum + r.amount * 4;
    if (r.frequency === 'daily') return sum + r.amount * 30;
    if (r.frequency === 'yearly') return sum + r.amount / 12;
    return sum;
  }, 0);
  const totalMonthlyExpense = expenseRecurring.reduce((sum, r) => {
    if (r.frequency === 'monthly') return sum + r.amount;
    if (r.frequency === 'weekly') return sum + r.amount * 4;
    if (r.frequency === 'daily') return sum + r.amount * 30;
    if (r.frequency === 'yearly') return sum + r.amount / 12;
    return sum;
  }, 0);

  return (
    <div className="recurring-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Recurring</h2>
          <p className="page-subtitle">Manage your regular income & expenses</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          <span>Add Recurring</span>
        </button>
      </div>

      {/* Summary */}
      {recurringTransactions.length > 0 && (
        <div className="recurring-summary">
          <div className="recurring-summary__item">
            <span className="recurring-summary__label">Monthly Income</span>
            <span className="recurring-summary__value recurring-summary__value--income">
              +{formatCurrency(totalMonthlyIncome, 'INR')}
            </span>
          </div>
          <div className="recurring-summary__divider" />
          <div className="recurring-summary__item">
            <span className="recurring-summary__label">Monthly Expenses</span>
            <span className="recurring-summary__value recurring-summary__value--expense">
              -{formatCurrency(totalMonthlyExpense, 'INR')}
            </span>
          </div>
          <div className="recurring-summary__divider" />
          <div className="recurring-summary__item">
            <span className="recurring-summary__label">Net Monthly</span>
            <span className={`recurring-summary__value ${totalMonthlyIncome - totalMonthlyExpense >= 0 ? 'recurring-summary__value--income' : 'recurring-summary__value--expense'}`}>
              {formatCurrency(Math.abs(totalMonthlyIncome - totalMonthlyExpense), 'INR')}
            </span>
          </div>
        </div>
      )}

      {/* List */}
      {recurringTransactions.length === 0 ? (
        <div className="empty-state">
          <p>No recurring transactions set up</p>
          <p className="empty-state__hint">Add recurring items like salary, rent, subscriptions to track them</p>
        </div>
      ) : (
        <div className="recurring-list">
          {recurringTransactions.map(rec => (
            <div key={rec.id} className="recurring-item">
              <div className="recurring-item__icon" style={{
                backgroundColor: rec.categoryColor + '18',
                color: rec.categoryColor,
              }}>
                {rec.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              </div>

              <div className="recurring-item__info">
                <span className="recurring-item__name">{rec.name}</span>
                <span className="recurring-item__meta">
                  {rec.categoryName} · {rec.accountName} · {frequencyLabels[rec.frequency]}
                </span>
              </div>

              <div className="recurring-item__right">
                <span className={`recurring-item__amount ${rec.type === 'income' ? 'recurring-item__amount--income' : 'recurring-item__amount--expense'}`}>
                  {rec.type === 'income' ? '+' : '-'}{formatCurrency(rec.amount, 'INR')}
                </span>
                <div className="recurring-item__freq">{frequencyLabels[rec.frequency]}</div>
              </div>

              <div className="recurring-item__actions">
                <button className="icon-btn" onClick={() => handleApplyNow(rec)} title="Apply now">
                  <Play size={13} />
                </button>
                <button className="icon-btn" onClick={() => { setEditingRecurring(rec); setShowForm(true); }} title="Edit">
                  <Pencil size={13} />
                </button>
                <button className="icon-btn icon-btn--danger" onClick={() => handleDelete(rec.id, rec.name)} title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingRecurring(null); }}
        title={editingRecurring ? 'Edit Recurring' : 'Add Recurring'}
      >
        <RecurringForm
          recurring={editingRecurring}
          onClose={() => { setShowForm(false); setEditingRecurring(null); }}
        />
      </Modal>
    </div>
  );
}
