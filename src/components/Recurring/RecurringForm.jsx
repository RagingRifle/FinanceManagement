import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { TRANSACTION_TYPES } from '../../utils/constants';

export default function RecurringForm({ recurring, onClose }) {
  const { expenseCategories, incomeCategories, accounts, addRecurring, updateRecurring } = useFinance();
  const { addToast } = useToast();
  const isEditing = !!recurring;

  const [formData, setFormData] = useState({
    name: recurring?.name || '',
    type: recurring?.type || TRANSACTION_TYPES.EXPENSE,
    amount: recurring?.amount || '',
    categoryId: recurring?.categoryId || '',
    accountId: recurring?.accountId || accounts[0]?.id || '',
    frequency: recurring?.frequency || 'monthly',
  });

  const categories = formData.type === TRANSACTION_TYPES.INCOME ? incomeCategories : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
      ...(name === 'type' ? { categoryId: '' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.categoryId) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    const selectedCategory = categories.find(c => c.id === formData.categoryId);
    const selectedAccount = accounts.find(a => a.id === formData.accountId);

    const data = {
      ...formData,
      amount: Number(formData.amount),
      categoryName: selectedCategory?.name || 'Unknown',
      categoryColor: selectedCategory?.color || '#6b7280',
      accountName: selectedAccount?.name || 'Unknown',
    };

    if (isEditing) {
      updateRecurring({ ...data, id: recurring.id, createdAt: recurring.createdAt });
      addToast(`"${formData.name}" updated`, 'success');
    } else {
      addRecurring(data);
      addToast(`"${formData.name}" added as recurring`, 'success');
    }
    onClose();
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="rec-name">Name</label>
        <input id="rec-name" type="text" name="name" className="form-input"
          placeholder="e.g., Monthly Rent" value={formData.name} onChange={handleChange} required autoFocus />
      </div>

      <div className="form-group">
        <label className="form-label">Type</label>
        <div className="type-toggle">
          <button type="button"
            className={`type-toggle__btn ${formData.type === TRANSACTION_TYPES.EXPENSE ? 'type-toggle__btn--active type-toggle__btn--expense' : ''}`}
            onClick={() => handleChange({ target: { name: 'type', value: TRANSACTION_TYPES.EXPENSE } })}>
            Expense
          </button>
          <button type="button"
            className={`type-toggle__btn ${formData.type === TRANSACTION_TYPES.INCOME ? 'type-toggle__btn--active type-toggle__btn--income' : ''}`}
            onClick={() => handleChange({ target: { name: 'type', value: TRANSACTION_TYPES.INCOME } })}>
            Income
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="rec-amount">Amount (₹)</label>
        <input id="rec-amount" type="number" name="amount" className="form-input"
          placeholder="Enter amount" value={formData.amount} onChange={handleChange} min="1" required />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="rec-frequency">Frequency</label>
        <select id="rec-frequency" name="frequency" className="form-input" value={formData.frequency} onChange={handleChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="rec-category">Category</label>
        <select id="rec-category" name="categoryId" className="form-input" value={formData.categoryId} onChange={handleChange} required>
          <option value="">Select category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="rec-account">Account</label>
        <select id="rec-account" name="accountId" className="form-input" value={formData.accountId} onChange={handleChange} required>
          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn--primary">{isEditing ? 'Update' : 'Add'} Recurring</button>
      </div>
    </form>
  );
}
