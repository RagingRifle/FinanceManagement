import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';

export default function BudgetForm({ budget, onClose }) {
  const { expenseCategories, budgets, addBudget, updateBudget } = useFinance();
  const { addToast } = useToast();
  const isEditing = !!budget;

  const [formData, setFormData] = useState({
    categoryId: budget?.categoryId || '',
    amount: budget?.amount || '',
    period: budget?.period || 'monthly',
  });

  // Filter out categories that already have budgets (unless editing)
  const availableCategories = expenseCategories.filter(cat =>
    isEditing ? true : !budgets.some(b => b.categoryId === cat.id)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    const selectedCategory = expenseCategories.find(c => c.id === formData.categoryId);
    const budgetData = {
      ...formData,
      amount: Number(formData.amount),
      categoryName: selectedCategory?.name || 'Unknown',
      categoryColor: selectedCategory?.color || '#6b7280',
    };

    if (isEditing) {
      updateBudget({ ...budgetData, id: budget.id });
      addToast(`Budget for "${selectedCategory.name}" updated`, 'success');
    } else {
      addBudget(budgetData);
      addToast(`Budget of ₹${formData.amount} set for "${selectedCategory.name}"`, 'success');
    }
    onClose();
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="budget-category">Category</label>
        <select
          id="budget-category"
          className="form-input"
          value={formData.categoryId}
          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
          required
          disabled={isEditing}
        >
          <option value="">Select category</option>
          {availableCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="budget-amount">Monthly Limit (₹)</label>
        <input
          id="budget-amount"
          type="number"
          className="form-input"
          placeholder="e.g., 5000"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          min="1"
          required
          autoFocus
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn--primary">
          {isEditing ? 'Update' : 'Add'} Budget
        </button>
      </div>
    </form>
  );
}
