import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import AnalyticsSection from './components/AnalyticsSection';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseTable from './components/ExpenseTable';
import ExpenseModal from './components/ExpenseModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import expenseApi from './services/api';
import { CURRENCIES, exportToCSV } from './utils/constants';

export function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('spendwise_theme') || 'dark';
  });

  // Currency state
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  // Data states
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [datePreset, setDatePreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme to HTML attribute & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spendwise_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load all expenses and summary from Spring Boot backend
  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const [expensesRes, summaryRes] = await Promise.all([
        expenseApi.getExpenses(),
        expenseApi.getSummary(),
      ]);

      if (expensesRes.success) {
        setExpenses(expensesRes.data || []);
        setApiOnline(true);
      } else {
        setApiOnline(false);
        addToast(expensesRes.error, 'error');
      }

      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      setApiOnline(false);
      addToast('Cannot connect to Spring Boot backend API', 'error');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [addToast]);

  // Initial load on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle date preset change
  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'week') {
      const pastWeek = new Date(today);
      pastWeek.setDate(today.getDate() - 7);
      setStartDate(pastWeek.toISOString().slice(0, 10));
      setEndDate(todayStr);
    } else if (preset === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(firstDay.toISOString().slice(0, 10));
      setEndDate(todayStr);
    } else if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedCategory !== 'All' ||
    datePreset !== 'all' ||
    startDate ||
    endDate ||
    sortBy !== 'date-desc'
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setSortBy('date-desc');
  };

  // Client-side filtering and sorting for instant reactivity
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (e) => (e.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter (title or notes)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          (e.title || '').toLowerCase().includes(q) ||
          (e.notes || '').toLowerCase().includes(q)
      );
    }

    // Date range filter
    if (startDate) {
      result = result.filter((e) => e.date >= startDate);
    }
    if (endDate) {
      result = result.filter((e) => e.date <= endDate);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date) || (b.id - a.id);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date) || (a.id - b.id);
      }
      if (sortBy === 'amount-desc') {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === 'amount-asc') {
        return Number(a.amount) - Number(b.amount);
      }
      if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return result;
  }, [expenses, selectedCategory, searchQuery, startDate, endDate, sortBy]);

  // Compute filtered total amount
  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [filteredExpenses]);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  // Save (Create or Update) Expense
  const handleSaveExpense = async (expenseData) => {
    setIsSubmitting(true);

    try {
      if (editingExpense && editingExpense.id) {
        // UPDATE existing expense via PUT
        const res = await expenseApi.updateExpense(editingExpense.id, expenseData);
        if (res.success) {
          addToast(`"${expenseData.title}" updated successfully!`, 'success');
          setIsModalOpen(false);
          setEditingExpense(null);
          loadData(false);
        } else {
          addToast(res.error || 'Failed to update expense', 'error');
        }
      } else {
        // CREATE new expense via POST
        const res = await expenseApi.createExpense(expenseData);
        if (res.success) {
          addToast(`"${expenseData.title}" added to expenses!`, 'success');
          setIsModalOpen(false);
          loadData(false);

          // Confetti celebration!
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#6366f1', '#8b5cf6', '#10b981', '#06b6d4'],
          });
        } else {
          addToast(res.error || 'Failed to create expense', 'error');
        }
      }
    } catch {
      addToast('An unexpected error occurred while saving', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prompt delete modal
  const handlePromptDelete = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete via DELETE endpoint
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await expenseApi.deleteExpense(id);
      if (res.success) {
        addToast(`Expense removed successfully`, 'success');
        setIsDeleteModalOpen(false);
        setExpenseToDelete(null);
        loadData(false);
      } else {
        addToast(res.error || 'Failed to delete expense', 'error');
      }
    } catch {
      addToast('Failed to delete expense', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Export filtered expenses as CSV
  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      addToast('No expenses available to export', 'info');
      return;
    }
    exportToCSV(filteredExpenses, currency.symbol);
    addToast(`Exported ${filteredExpenses.length} expense records to CSV`, 'success');
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <Header
        onAddClick={handleOpenAddModal}
        onExportClick={handleExportCSV}
        onRefreshClick={() => loadData(true)}
        isLoading={isLoading}
        apiOnline={apiOnline}
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main KPI Stats Dashboard */}
      <StatsCards
        summary={summary}
        filteredTotal={filteredTotal}
        totalItemsCount={expenses.length}
        filteredCount={filteredExpenses.length}
        currency={currency}
        isFiltered={hasActiveFilters}
      />

      {/* Visual Analytics: Category Breakdown & Monthly Trajectory */}
      <AnalyticsSection
        summary={summary}
        currency={currency}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Controls & Filter Bar */}
      <ExpenseFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        datePreset={datePreset}
        onDatePresetChange={handleDatePresetChange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Expenses Table */}
      <ExpenseTable
        expenses={filteredExpenses}
        filteredTotal={filteredTotal}
        currency={currency}
        onEdit={handleOpenEditModal}
        onDelete={handlePromptDelete}
        onAddNew={handleOpenAddModal}
        isLoading={isLoading}
      />

      {/* Add / Edit Expense Modal Dialog */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSaveExpense}
        initialData={editingExpense}
        currency={currency}
        isSubmitting={isSubmitting}
      />

      {/* Safe Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        expense={expenseToDelete}
        currency={currency}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="app-footer">
        <div>
          SpendWise — Built with <strong>React.js</strong> & <strong>Java Spring Boot REST API</strong>.
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          H2 Persistent File Database • Data persists across restarts in <code>backend/data/expensedb</code>
        </div>
      </footer>
    </div>
  );
}

export default App;
