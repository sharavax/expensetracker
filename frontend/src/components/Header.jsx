import React from 'react';
import {
  Wallet,
  PlusCircle,
  Download,
  RotateCw,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CURRENCIES } from '../utils/constants';

export const Header = ({
  onAddClick,
  onExportClick,
  onRefreshClick,
  isLoading,
  apiOnline,
  currency,
  onCurrencyChange,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="app-header glass-panel">
      <div className="brand-section">
        <div className="brand-logo">
          <Wallet size={26} />
        </div>
        <div className="brand-text">
          <h1>SpendWise</h1>
          <p className="brand-subtitle">Smart Personal Expense Tracker</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Spring Boot API Status Pill */}
        <div className={`api-badge ${apiOnline ? '' : 'offline'}`} title="Spring Boot REST API Status">
          <span className={`pulse-dot ${apiOnline ? '' : 'offline'}`} />
          <span>{apiOnline ? 'Spring Boot Online' : 'API Reconnecting'}</span>
        </div>

        {/* Currency Switcher */}
        <select
          id="currency-selector"
          className="select-control"
          value={currency.code}
          onChange={(e) => {
            const found = CURRENCIES.find((c) => c.code === e.target.value);
            if (found) onCurrencyChange(found);
          }}
          title="Select display currency"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Theme Toggle (Dark/Light) */}
        <button
          id="theme-toggle-btn"
          className="btn-icon"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Refresh Data */}
        <button
          id="refresh-btn"
          className="btn-icon"
          onClick={onRefreshClick}
          disabled={isLoading}
          title="Refresh expense records"
        >
          <RotateCw size={18} className={isLoading ? 'spin-animation' : ''} />
        </button>

        {/* Export CSV */}
        <button
          id="export-csv-btn"
          className="btn btn-secondary"
          onClick={onExportClick}
          title="Download expenses report as CSV spreadsheet"
        >
          <Download size={17} />
          <span>Export CSV</span>
        </button>

        {/* Primary Add Expense CTA */}
        <button
          id="add-expense-btn"
          className="btn btn-primary"
          onClick={onAddClick}
        >
          <PlusCircle size={18} />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
