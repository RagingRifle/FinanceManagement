import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import TransactionForm from '../Transactions/TransactionForm';
import Modal from '../common/Modal';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="layout__main">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onAddTransaction={() => setShowAddForm(true)}
        />

        <main className="layout__content">
          <Outlet />
        </main>
      </div>

      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add Transaction">
        <TransactionForm onClose={() => setShowAddForm(false)} />
      </Modal>
    </div>
  );
}
