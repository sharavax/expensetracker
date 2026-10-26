import React from 'react';
import { PieChart, BarChart3, ArrowRight } from 'lucide-react';
import { CATEGORIES, formatCurrency } from '../utils/constants';

export const AnalyticsSection = ({
  summary,
  currency,
  selectedCategory,
  onSelectCategory,
}) => {
  const categoryBreakdown = summary?.categoryBreakdown || {};
  const monthlyBreakdown = summary?.monthlyBreakdown || {};
  const totalAmount = Number(summary?.totalAmount) || 1;

  // Convert category breakdown into sorted list
  const categoryEntries = Object.entries(categoryBreakdown).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  );

  // Convert monthly breakdown into list
  const monthlyEntries = Object.entries(monthlyBreakdown);
  const maxMonthlyAmount = Math.max(
    ...monthlyEntries.map((m) => Number(m[1]) || 0),
    1
  );

  const getCategoryMeta = (catName) => {
    return (
      CATEGORIES.find((c) => c.name.toLowerCase() === (catName || '').toLowerCase()) ||
      CATEGORIES.find((c) => c.name === 'Other')
    );
  };

  return (
    <div className="analytics-section">
      {/* Category Breakdown Card */}
      <div className="glass-panel chart-card">
        <div className="card-title">
          <span>
            <PieChart size={20} style={{ color: 'var(--accent-primary)' }} />
            Category Distribution
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {categoryEntries.length} Categories
          </span>
        </div>

        {categoryEntries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
            No expense categories recorded yet.
          </p>
        ) : (
          <div className="category-bars-list">
            {categoryEntries.map(([catName, amount]) => {
              const meta = getCategoryMeta(catName);
              const percentage = Math.min(
                100,
                Math.round((Number(amount) / totalAmount) * 100)
              );
              const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();

              return (
                <div
                  key={catName}
                  className="category-bar-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectCategory(isSelected ? 'All' : catName)}
                  title={`Click to filter by ${catName}`}
                >
                  <div className="category-bar-info">
                    <span className="category-bar-name">
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: meta.color,
                          display: 'inline-block',
                        }}
                      />
                      <span>{catName}</span>
                      {isSelected && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                          (Active Filter)
                        </span>
                      )}
                    </span>
                    <span className="category-bar-amount">
                      {formatCurrency(amount, currency.symbol)} ({percentage}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: meta.color,
                        boxShadow: `0 0 10px ${meta.color}40`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Trends Visualization */}
      <div className="glass-panel chart-card">
        <div className="card-title">
          <span>
            <BarChart3 size={20} style={{ color: 'var(--accent-cyan)' }} />
            Monthly Spending Trajectory
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Overview
          </span>
        </div>

        {monthlyEntries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
            No monthly data points available yet.
          </p>
        ) : (
          <div className="monthly-chart-container">
            {monthlyEntries.map(([monthLabel, amount]) => {
              const heightPercent = Math.max(
                15,
                Math.round((Number(amount) / maxMonthlyAmount) * 100)
              );

              return (
                <div key={monthLabel} className="monthly-col">
                  <div className="col-tooltip">
                    {monthLabel}: {formatCurrency(amount, currency.symbol)}
                  </div>
                  <div
                    className="col-bar"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="col-label">{monthLabel}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsSection;
