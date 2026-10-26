import React from 'react';
import {
  Edit3,
  Trash2,
  Receipt,
  CreditCard,
  Calendar,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { CATEGORIES, formatCurrency, formatDate } from '../utils/constants';

export const ExpenseTable = ({
  expenses,
  filteredTotal,
  currency,
  onEdit,
  onDelete,
  onAddNew,
  isLoading,
}) => {
  const getCategoryClass = (categoryName) => {
    const lower = (categoryName || '').toLowerCase();
    if (lower.includes('food')) return 'badge-food';
    if (lower.includes('travel')) return 'badge-travel';
    if (lower.includes('shop')) return 'badge-shopping';
    if (lower.includes('bill')) return 'badge-bills';
    if (lower.includes('entertain')) return 'badge-entertainment';
    if (lower.includes('health')) return 'badge-health';
    if (lower.includes('educat')) return 'badge-education';
    return 'badge-other';
  };

  const getCategoryColor = (categoryName) => {
    const found = CATEGORIES.find(
      (c) => c.name.toLowerCase() === (categoryName || '').toLowerCase()
    );
    return found ? found.color : '#64748b';
  };

  return (
    <div className="glass-panel table-panel">
      {/* Header bar above table */}
      <div className="table-header-meta">
        <div className="table-title">
          <Receipt size={20} style={{ color: 'var(--accent-primary)' }} />
          <span>Expense Records</span>
          <span className="table-stats-badge">
            {expenses.length} {expenses.length === 1 ? 'record' : 'records'}
          </span>
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Filtered Total:{' '}
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>
            {formatCurrency(filteredTotal, currency.symbol)}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="empty-state">
          <div className="empty-state-icon spin-animation">
            <Receipt size={32} />
          </div>
          <h3>Loading your expenses...</h3>
          <p>Connecting to Spring Boot backend database.</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Receipt size={32} />
          </div>
          <h3>No expenses found</h3>
          <p>
            No expenses match your search query or category filter. Try clearing filters or add a new record.
          </p>
          <button
            id="empty-state-add-btn"
            className="btn btn-primary"
            onClick={onAddNew}
            style={{ marginTop: '0.5rem' }}
          >
            <PlusCircle size={17} />
            <span>Record an Expense</span>
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="expense-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Title & Details</th>
                <th style={{ width: '20%' }}>Category</th>
                <th style={{ width: '16%' }}>Date</th>
                <th style={{ width: '14%' }}>Amount</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const badgeClass = getCategoryClass(expense.category);
                const dotColor = getCategoryColor(expense.category);

                return (
                  <tr key={expense.id} id={`expense-row-${expense.id}`}>
                    {/* Title & Notes */}
                    <td>
                      <div className="expense-item-main">
                        <span className="expense-title-text">{expense.title}</span>
                        {expense.notes && (
                          <span className="expense-notes-text">{expense.notes}</span>
                        )}
                        {expense.paymentMethod && (
                          <span className="expense-payment-tag">
                            <CreditCard size={11} />
                            <span>{expense.paymentMethod}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td>
                      <span className={`badge-category ${badgeClass}`}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: dotColor,
                            display: 'inline-block',
                          }}
                        />
                        <span>{expense.category}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>{formatDate(expense.date)}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td>
                      <span className="expense-amount-text">
                        {formatCurrency(expense.amount, currency.symbol)}
                      </span>
                    </td>

                    {/* Action buttons (Edit & Delete) */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          id={`edit-btn-${expense.id}`}
                          className="btn-icon"
                          onClick={() => onEdit(expense)}
                          title="Edit this expense"
                          style={{ width: 34, height: 34 }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          id={`delete-btn-${expense.id}`}
                          className="btn-icon btn-danger-outline"
                          onClick={() => onDelete(expense)}
                          title="Delete this expense"
                          style={{ width: 34, height: 34 }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
