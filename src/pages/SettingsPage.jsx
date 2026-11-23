import { useState, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { CURRENCIES } from '../utils/constants';
import { Trash2, Plus, Database, RefreshCw, Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';

export default function SettingsPage() {
  const {
    settings, updateSettings,
    expenseCategories, incomeCategories, accounts,
    addCategory, deleteCategory, addAccount, deleteAccount,
    clearAllData, loadSampleData,
    exportAsCSV, exportAsJSON, importTransactions,
  } = useFinance();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366f1');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountColor, setNewAccountColor] = useState('#3b82f6');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryType, { name: newCategoryName.trim(), color: newCategoryColor, icon: 'Tag' });
    addToast(`Category "${newCategoryName.trim()}" added`, 'success');
    setNewCategoryName('');
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;
    addAccount({ name: newAccountName.trim(), color: newAccountColor, icon: 'Wallet' });
    addToast(`Account "${newAccountName.trim()}" added`, 'success');
    setNewAccountName('');
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) { addToast('CSV file is empty', 'error'); return; }

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
        const dateIdx = headers.findIndex(h => h === 'date');
        const typeIdx = headers.findIndex(h => h === 'type');
        const catIdx = headers.findIndex(h => h.includes('category'));
        const amtIdx = headers.findIndex(h => h === 'amount');
        const accIdx = headers.findIndex(h => h.includes('account'));
        const noteIdx = headers.findIndex(h => h === 'note' || h === 'description');

        const transactions = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          if (values.length < 4) continue;

          transactions.push({
            date: values[dateIdx] || new Date().toISOString().split('T')[0],
            type: (values[typeIdx] || 'expense').toLowerCase(),
            categoryId: 'other_expense',
            categoryName: values[catIdx] || 'Other',
            categoryColor: '#6b7280',
            amount: parseFloat(values[amtIdx]) || 0,
            accountId: 'bank',
            accountName: values[accIdx] || 'Bank Account',
            note: values[noteIdx] || '',
          });
        }

        if (transactions.length > 0) {
          importTransactions(transactions);
          addToast(`Imported ${transactions.length} transactions`, 'success');
        } else {
          addToast('No valid transactions found', 'error');
        }
      } catch (err) {
        addToast('Failed to parse CSV file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
      </div>

      {/* General */}
      <div className="card settings-section">
        <h3 className="card__title">General</h3>
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label" htmlFor="userName">Your Name</label>
          <input id="userName" type="text" className="form-input"
            value={settings.userName || ''} onChange={(e) => updateSettings({ userName: e.target.value })}
            placeholder="Enter your name" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="currency">Currency</label>
          <select id="currency" className="form-input" value={settings.currency}
            onChange={(e) => { updateSettings({ currency: e.target.value }); addToast(`Currency changed to ${e.target.value}`, 'info'); }}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>)}
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="card settings-section">
        <h3 className="card__title">Expense Categories</h3>
        <div className="settings-tags">
          {expenseCategories.map(cat => (
            <div key={cat.id} className="settings-tag" style={{ borderColor: cat.color + '40' }}>
              <span className="settings-tag__dot" style={{ backgroundColor: cat.color }} />
              <span>{cat.name}</span>
              <button className="settings-tag__remove" onClick={() => { deleteCategory('expense', cat.id); addToast(`"${cat.name}" removed`, 'info'); }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <h3 className="card__title" style={{ marginTop: '1.5rem' }}>Income Categories</h3>
        <div className="settings-tags">
          {incomeCategories.map(cat => (
            <div key={cat.id} className="settings-tag" style={{ borderColor: cat.color + '40' }}>
              <span className="settings-tag__dot" style={{ backgroundColor: cat.color }} />
              <span>{cat.name}</span>
              <button className="settings-tag__remove" onClick={() => { deleteCategory('income', cat.id); addToast(`"${cat.name}" removed`, 'info'); }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <form className="settings-add-form" onSubmit={handleAddCategory}>
          <select className="form-input" value={newCategoryType} onChange={(e) => setNewCategoryType(e.target.value)}
            style={{ width: '130px', flex: 'none' }}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input type="text" className="form-input" placeholder="Category name"
            value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
          <input type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="color-picker" />
          <button type="submit" className="btn btn--primary btn--sm"><Plus size={16} /> Add</button>
        </form>
      </div>

      {/* Accounts */}
      <div className="card settings-section">
        <h3 className="card__title">Accounts</h3>
        <div className="settings-tags">
          {accounts.map(acc => (
            <div key={acc.id} className="settings-tag" style={{ borderColor: acc.color + '40' }}>
              <span className="settings-tag__dot" style={{ backgroundColor: acc.color }} />
              <span>{acc.name}</span>
              <button className="settings-tag__remove" onClick={() => { deleteAccount(acc.id); addToast(`"${acc.name}" removed`, 'info'); }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
        <form className="settings-add-form" onSubmit={handleAddAccount}>
          <input type="text" className="form-input" placeholder="Account name"
            value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} />
          <input type="color" value={newAccountColor} onChange={(e) => setNewAccountColor(e.target.value)} className="color-picker" />
          <button type="submit" className="btn btn--primary btn--sm"><Plus size={16} /> Add</button>
        </form>
      </div>

      {/* Export & Import */}
      <div className="card settings-section">
        <h3 className="card__title">Export & Import</h3>
        <p className="settings-desc">Export your data for backup or import transactions from CSV files.</p>
        <div className="settings-actions">
          <button className="btn btn--secondary" onClick={() => { exportAsCSV(); addToast('Transactions exported as CSV', 'success'); }}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button className="btn btn--secondary" onClick={() => { exportAsJSON(); addToast('Full backup exported as JSON', 'success'); }}>
            <FileJson size={16} /> Export JSON
          </button>
          <button className="btn btn--secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} /> Import CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
        </div>
      </div>

      {/* Data Management */}
      <div className="card settings-section">
        <h3 className="card__title">Data Management</h3>
        <div className="settings-actions">
          <button className="btn btn--secondary" onClick={() => { loadSampleData(); addToast('Sample data loaded', 'success'); }}>
            <RefreshCw size={16} /> Load Sample Data
          </button>
          <button className="btn btn--danger" onClick={() => {
            if (window.confirm('Delete ALL transactions? This cannot be undone.')) { clearAllData(); addToast('All transactions cleared', 'info'); }
          }}>
            <Database size={16} /> Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
