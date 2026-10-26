import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {isSuccess && (
              <CheckCircle2 size={19} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
            )}
            {isError && (
              <AlertCircle size={19} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />
            )}
            {!isSuccess && !isError && (
              <Info size={19} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            )}

            <div className="toast-message">{toast.message}</div>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 2,
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
