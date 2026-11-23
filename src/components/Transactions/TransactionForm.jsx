import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { formatDateForInput } from '../../utils/helpers';
import { TRANSACTION_TYPES } from '../../utils/constants';

export default function TransactionForm({ transaction, onClose }) {
  const {
    expenseCategories,
    incomeCategories,
    accounts,
    addTransaction,
    updateTransaction,
  } = useFinance();
  const { addToast } = useToast();

  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    type: transaction?.type || TRANSACTION_TYPES.EXPENSE,
    amount: transaction?.amount || '',
    categoryId: transaction?.categoryId || '',
    accountId: transaction?.accountId || accounts[0]?.id || '',
    date: transaction?.date || formatDateForInput(new Date()),
    note: transaction?.note || '',
  });

  const categories =
    formData.type === TRANSACTION_TYPES.INCOME ? incomeCategories : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
      ...(name === 'type' ? { categoryId: '' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.categoryId || !formData.accountId) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    const selectedCategory = categories.find(c => c.id === formData.categoryId);
    const selectedAccount = accounts.find(a => a.id === formData.accountId);

    const transactionData = {
      ...formData,
      amount: Number(formData.amount),
      categoryName: selectedCategory?.name || 'Unknown',
      categoryColor: selectedCategory?.color || '#6b7280',
      accountName: selectedAccount?.name || 'Unknown',
    };

    if (isEditing) {
      updateTransaction({ ...transactionData, id: transaction.id });
      addToast('Transaction updated successfully', 'success');
    } else {
      addTransaction(transactionData);
      addToast(`${formData.type === 'income' ? 'Income' : 'Expense'} of ₹${formData.amount} added`, 'success');
    }

    onClose();
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {/* Type selector */}
      <div className="form-group">
        <label className="form-label">Type</label>
        <div className="type-toggle">
          <button
            type="button"
            className={`type-toggle__btn ${
              formData.type === TRANSACTION_TYPES.EXPENSE ? 'type-toggle__btn--active type-toggle__btn--expense' : ''
            }`}
            onClick={() => handleChange({ target: { name: 'type', value: TRANSACTION_TYPES.EXPENSE } })}
          >
            Expense
          </button>
          <button
            type="button"
            className={`type-toggle__btn ${
              formData.type === TRANSACTION_TYPES.INCOME ? 'type-toggle__btn--active type-toggle__btn--income' : ''
            }`}
            onClick={() => handleChange({ target: { name: 'type', value: TRANSACTION_TYPES.INCOME } })}
          >
            Income
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="form-group">
        <label className="form-label" htmlFor="amount">Amount (₹)</label>
        <input
          id="amount"
          type="number"
          name="amount"
          className="form-input"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          autoFocus
        />
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label" htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          className="form-input"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Account */}
      <div className="form-group">
        <label className="form-label" htmlFor="accountId">Account</label>
        <select
          id="accountId"
          name="accountId"
          className="form-input"
          value={formData.accountId}
          onChange={handleChange}
          required
        >
          <option value="">Select account</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          className="form-input"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      {/* Note */}
      <div className="form-group">
        <label className="form-label" htmlFor="note">Note (optional)</label>
        <input
          id="note"
          type="text"
          name="note"
          className="form-input"
          placeholder="e.g., Lunch at restaurant"
          value={formData.note}
          onChange={handleChange}
        />
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {isEditing ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
}
