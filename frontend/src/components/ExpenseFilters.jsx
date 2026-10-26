import React from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

export const ExpenseFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  datePreset,
  onDatePresetChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="glass-panel controls-panel">
      {/* Top row: Search input and Date / Sort controls */}
      <div className="controls-top-row">
        {/* Search Input */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            id="search-input"
            type="text"
            placeholder="Search expenses by title or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Date presets & Sorting */}
        <div className="date-and-sort-group">
          {/* Date range filter */}
          <select
            id="date-preset-select"
            className="select-control"
            value={datePreset}
            onChange={(e) => onDatePresetChange(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Past 7 Days</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range...</option>
          </select>

          {/* Sort By selector */}
          <select
            id="sort-by-select"
            className="select-control"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
            <option value="title-asc">Title (A - Z)</option>
          </select>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              id="reset-filters-btn"
              className="btn btn-secondary"
              onClick={onResetFilters}
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
              title="Reset all active filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Pickers (Shown only when datePreset === 'custom') */}
      {datePreset === 'custom' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            padding: '0.75rem',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
          }}
        >
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Custom Date Range:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From:</label>
            <input
              id="start-date-input"
              type="date"
              className="select-control"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To:</label>
            <input
              id="end-date-input"
              type="date"
              className="select-control"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Category Pills Row */}
      <div className="filters-row">
        <div className="category-pills">
          <button
            id="cat-pill-all"
            className={`cat-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => onCategoryChange('All')}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                id={`cat-pill-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className={`cat-pill ${isActive ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat.name)}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: cat.color,
                    display: 'inline-block',
                  }}
                />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
