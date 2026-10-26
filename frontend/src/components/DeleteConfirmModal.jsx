import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/constants';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  expense,
  currency,
  isDeleting,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !expense) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--accent-rose)' }}>
            <AlertTriangle size={22} />
            <span>Confirm Deletion</span>
          </div>
          <button
            id="close-delete-modal-btn"
            className="btn-icon"
            onClick={onClose}
            title="Cancel"
            style={{ width: 34, height: 34 }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to permanently delete this expense? This action cannot be undone.
          </p>

          <div
            style={{
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {expense.title}
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(expense.amount, currency.symbol)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{expense.category}</span>
              <span>{formatDate(expense.date)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            id="cancel-delete-btn"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(expense.id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Expense'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
