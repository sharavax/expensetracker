import axios from 'axios';

// API base URL supports relative proxy in dev or custom deployment URL via environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/expenses';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const expenseApi = {
  // Get all expenses with optional filtering
  getExpenses: async (params = {}) => {
    try {
      const response = await apiClient.get('', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch expenses',
      };
    }
  },

  // Get single expense
  getExpenseById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch expense details',
      };
    }
  },

  // Create new expense
  createExpense: async (expenseData) => {
    try {
      const response = await apiClient.post('', expenseData);
      return { success: true, data: response.data };
    } catch (error) {
      const validationErrors = error.response?.data?.validationErrors;
      const message = error.response?.data?.message || error.message || 'Failed to create expense';
      return {
        success: false,
        error: message,
        validationErrors,
      };
    }
  },

  // Update existing expense
  updateExpense: async (id, expenseData) => {
    try {
      const response = await apiClient.put(`/${id}`, expenseData);
      return { success: true, data: response.data };
    } catch (error) {
      const validationErrors = error.response?.data?.validationErrors;
      const message = error.response?.data?.message || error.message || 'Failed to update expense';
      return {
        success: false,
        error: message,
        validationErrors,
      };
    }
  },

  // Delete expense
  deleteExpense: async (id) => {
    try {
      await apiClient.delete(`/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete expense',
      };
    }
  },

  // Get summary analytics
  getSummary: async () => {
    try {
      const response = await apiClient.get('/summary');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch spending summary',
      };
    }
  },

  // Get available categories
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch categories',
      };
    }
  },

  // Check health
  checkHealth: async () => {
    try {
      await apiClient.get('/categories');
      return true;
    } catch {
      return false;
    }
  },
};

export default expenseApi;
