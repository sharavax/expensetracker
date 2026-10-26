import React from 'react';
import {
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  Receipt,
  Layers,
} from 'lucide-react';
import { formatCurrency } from '../utils/constants';

export const StatsCards = ({
  summary,
  filteredTotal,
  totalItemsCount,
  filteredCount,
  currency,
  isFiltered,
}) => {
  const totalAmount = isFiltered ? filteredTotal : (summary?.totalAmount || 0);
  const thisMonthAmount = summary?.thisMonthAmount || 0;
  const todayAmount = summary?.todayAmount || 0;
  const averageAmount = summary?.averageAmount || 0;
  const highestExpense = summary?.highestExpense;

  return (
    <div className="stats-grid">
      {/* Total Spending Card */}
      <div className="glass-panel stat-card">
        <div className="stat-header">
          <span className="stat-title">
            {isFiltered ? 'Filtered Spending' : 'Total Spending'}
          </span>
          <div className="stat-icon-wrapper">
            <DollarSign size={22} />
          </div>
        </div>
        <div>
          <div className="stat-value">
            {formatCurrency(totalAmount, currency.symbol)}
          </div>
          <div className="stat-subtext">
            <Receipt size={14} />
            <span>
              {isFiltered
                ? `${filteredCount} of ${totalItemsCount} expenses filtered`
                : `${totalItemsCount} total recorded expenses`}
            </span>
          </div>
        </div>
      </div>

      {/* Month Spending Card */}
      <div className="glass-panel stat-card emerald">
        <div className="stat-header">
          <span className="stat-title">This Month</span>
          <div className="stat-icon-wrapper">
            <Calendar size={22} />
          </div>
        </div>
        <div>
          <div className="stat-value">
            {formatCurrency(thisMonthAmount, currency.symbol)}
          </div>
          <div className="stat-subtext">
            <TrendingUp size={14} />
            <span>Current calendar month activity</span>
          </div>
        </div>
      </div>

      {/* Today's Spending Card */}
      <div className="glass-panel stat-card sunset">
        <div className="stat-header">
          <span className="stat-title">Today's Spending</span>
          <div className="stat-icon-wrapper">
            <Clock size={22} />
          </div>
        </div>
        <div>
          <div className="stat-value">
            {formatCurrency(todayAmount, currency.symbol)}
          </div>
          <div className="stat-subtext">
            <span>Expenses recorded today</span>
          </div>
        </div>
      </div>

      {/* Average / Highest Spending Card */}
      <div className="glass-panel stat-card ocean">
        <div className="stat-header">
          <span className="stat-title">Spending Insights</span>
          <div className="stat-icon-wrapper">
            <Layers size={22} />
          </div>
        </div>
        <div>
          <div className="stat-value">
            {formatCurrency(averageAmount, currency.symbol)}
          </div>
          <div className="stat-subtext" title={highestExpense ? `Highest: ${highestExpense.title} (${formatCurrency(highestExpense.amount, currency.symbol)})` : ''}>
            <span>
              {highestExpense
                ? `Max: ${formatCurrency(highestExpense.amount, currency.symbol)} (${highestExpense.category})`
                : 'Avg per transaction'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
