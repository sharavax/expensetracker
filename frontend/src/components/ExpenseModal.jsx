import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Sparkles } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/constants';

export const ExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  currency,
  isSubmitting,
}) => {
  const isEditing = Boolean(initialData && initialData.id);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setCategory(initialData.category || 'Food & Dining');
      setDate(initialData.date || new Date().toISOString().slice(0, 10));
      setPaymentMethod(initialData.paymentMethod || 'Credit Card');
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('Credit Card');
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title || !title.trim()) {
      errs.title = 'Title is required and cannot be empty.';
    } else if (title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters.';
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      errs.amount = 'Amount is required.';
    } else if (numAmount <= 0) {
      errs.amount = 'Amount must be greater than zero.';
    }

    if (!category || !category.trim()) {
      errs.category = 'Please select a category.';
    }

    if (!date) {
      errs.date = 'Date is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      amount: parseFloat(amount),
      category: category.trim(),
      date,
      paymentMethod,
      notes: notes.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>{isEditing ? 'Edit Expense Record' : 'Record New Expense'}</span>
          </div>
          <button
            id="close-modal-btn"
            className="btn-icon"
            onClick={onClose}
            title="Close dialog"
            style={{ width: 34, height: 34 }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title Field */}
            <div className="form-group">
              <label htmlFor="expense-title-input" className="form-label">
                <span>Expense Title *</span>
                {errors.title && <span className="error-text">{errors.title}</span>}
              </label>
              <input
                id="expense-title-input"
                type="text"
                placeholder="e.g. Organic Groceries, Subway Metro, Dinner"
                className={`form-input ${errors.title ? 'has-error' : ''}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
                autoFocus
              />
            </div>

            {/* Amount & Date in row */}
            <div className="form-row">
              {/* Amount */}
              <div className="form-group">
                <label htmlFor="expense-amount-input" className="form-label">
                  <span>Amount ({currency.symbol}) *</span>
                  {errors.amount && <span className="error-text">{errors.amount}</span>}
                </label>
                <input
                  id="expense-amount-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={`form-input ${errors.amount ? 'has-error' : ''}`}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                  }}
                />
              </div>

              {/* Date */}
              <div className="form-group">
                <label htmlFor="expense-date-input" className="form-label">
                  <span>Date *</span>
                  {errors.date && <span className="error-text">{errors.date}</span>}
                </label>
                <input
                  id="expense-date-input"
                  type="date"
                  className={`form-input ${errors.date ? 'has-error' : ''}`}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
                  }}
                />
              </div>
            </div>

            {/* Category Quick Selector */}
            <div className="form-group">
              <label className="form-label">
                <span>Category *</span>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </label>
              <div className="category-picker-grid">
                {CATEGORIES.map((cat) => {
                  const isSelected = category.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <div
                      key={cat.id}
                      className={`category-tile ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        setCategory(cat.name);
                        if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: cat.color,
                        }}
                      />
                      <span>{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label htmlFor="expense-payment-input" className="form-label">
                <span>Payment Method</span>
              </label>
              <select
                id="expense-payment-input"
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label htmlFor="expense-notes-input" className="form-label">
                <span>Notes / Description (Optional)</span>
              </label>
              <textarea
                id="expense-notes-input"
                rows="2"
                placeholder="Optional tags, vendor details or memo..."
                className="form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              id="cancel-modal-btn"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-expense-submit-btn"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Check size={18} />
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
