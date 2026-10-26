export const CATEGORIES = [
  { id: 'Food & Dining', name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#f97316', bg: 'var(--cat-food-bg)' },
  { id: 'Travel & Transport', name: 'Travel & Transport', icon: 'Plane', color: '#06b6d4', bg: 'var(--cat-travel-bg)' },
  { id: 'Shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', bg: 'var(--cat-shopping-bg)' },
  { id: 'Bills & Utilities', name: 'Bills & Utilities', icon: 'Zap', color: '#8b5cf6', bg: 'var(--cat-bills-bg)' },
  { id: 'Entertainment', name: 'Entertainment', icon: 'Film', color: '#f43f5e', bg: 'var(--cat-entertainment-bg)' },
  { id: 'Health & Fitness', name: 'Health & Fitness', icon: 'HeartPulse', color: '#10b981', bg: 'var(--cat-health-bg)' },
  { id: 'Education', name: 'Education', icon: 'GraduationCap', color: '#3b82f6', bg: 'var(--cat-education-bg)' },
  { id: 'Other', name: 'Other', icon: 'Tag', color: '#64748b', bg: 'var(--cat-other-bg)' },
];

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'UPI',
  'Bank Transfer',
  'Other',
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
];

export const formatCurrency = (amount, symbol = '$') => {
  const num = Number(amount) || 0;
  return `${symbol}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const exportToCSV = (expenses, currencySymbol = '$') => {
  if (!expenses || expenses.length === 0) return;

  const headers = ['ID', 'Title', `Amount (${currencySymbol})`, 'Category', 'Date', 'Payment Method', 'Notes'];
  const rows = expenses.map(e => [
    e.id,
    `"${(e.title || '').replace(/"/g, '""')}"`,
    e.amount,
    `"${e.category || ''}"`,
    e.date,
    `"${e.paymentMethod || ''}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Expense_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
