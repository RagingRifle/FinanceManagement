import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Modal from '../common/Modal';
import TransactionForm from './TransactionForm';

export default function TransactionList({ transactions }) {
  const { deleteTransaction, settings } = useFinance();
  const { addToast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions found</p>
        <p className="empty-state__hint">Try adjusting your filters or add a new transaction</p>
      </div>
    );
  }

  // Group by date
  const grouped = {};
  transactions.forEach((t) => {
    const dateKey = t.date;
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(t);
  });

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirm(null);
    addToast('Transaction deleted', 'info');
  };

  return (
    <>
      <div className="transaction-list">
        {sortedDates.map((dateKey) => (
          <div key={dateKey} className="transaction-group">
            <div className="transaction-group__date">
              {formatDate(dateKey, 'EEEE, dd MMM yyyy')}
            </div>
            {grouped[dateKey].map((t, index) => (
              <div
                key={t.id}
                className="transaction-item"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div
                  className="transaction-item__icon"
                  style={{ backgroundColor: t.categoryColor + '18', color: t.categoryColor }}
                >
                  {t.type === 'income' ? (
                    <ArrowUpRight size={18} />
                  ) : (
                    <ArrowDownRight size={18} />
                  )}
                </div>

                <div className="transaction-item__info">
                  <span className="transaction-item__category">{t.categoryName}</span>
                  <span className="transaction-item__meta">
                    {t.accountName}{t.note ? ` · ${t.note}` : ''}
                  </span>
                </div>

                <div className="transaction-item__right">
                  <span
                    className={`transaction-item__amount ${
                      t.type === 'income'
                        ? 'transaction-item__amount--income'
                        : 'transaction-item__amount--expense'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount, settings.currency)}
                  </span>

                  <div className="transaction-item__actions">
                    <button
                      className="icon-btn"
                      onClick={() => setEditingTransaction(t)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="icon-btn icon-btn--danger"
                      onClick={() => setDeleteConfirm(t.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaction"
      >
        {editingTransaction && (
          <TransactionForm
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Transaction"
      >
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
          <div className="form-actions">
            <button className="btn btn--secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button className="btn btn--danger" onClick={() => handleDelete(deleteConfirm)}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
