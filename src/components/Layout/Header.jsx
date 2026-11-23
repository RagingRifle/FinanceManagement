import { Menu, Plus } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getGreeting } from '../../utils/helpers';

export default function Header({ onMenuClick, onAddTransaction }) {
  const { settings } = useFinance();

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="header__greeting">
          <h1 className="header__title">{getGreeting()}</h1>
          <p className="header__subtitle">
            Here's your financial overview
          </p>
        </div>
      </div>

      <div className="header__right">
        <button className="btn btn--primary" onClick={onAddTransaction}>
          <Plus size={18} />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
}
