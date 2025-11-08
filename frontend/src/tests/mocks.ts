// mocks.ts
import { vi } from 'vitest';
import type { Expense, SortParams } from '../types';

export const mockUseAuth = () => ({
  user: null,
  authError: '',
  setAuthError: vi.fn(),
  authModalOpen: false,
  setAuthModalOpen: vi.fn(),
  isLoginMode: true,
  setIsLoginMode: vi.fn(),
  checkAuth: vi.fn(),
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  logoutUser: vi.fn(),
});

export const mockUseExpenses = () => ({
  expenses: [],
  lastUpdatedId: null,
  loadExpenses: vi.fn(),
  updateExpense: vi.fn(),
  addExpense: vi.fn(),
  removeExpenses: vi.fn(),
});

export const mockUseSelection = () => ({
  selectionMode: false,
  selectedIds: [],
  handleLongPress: vi.fn(),
  handleSelect: vi.fn(),
  handleDeleteSelected: vi.fn(),
  handleCancelSelection: vi.fn(),
  handleSelectAll: vi.fn(),
});

export const mockUseFilterSort = () => ({
  filtersState: {
    keywordInput: '',
    setKeywordInput: vi.fn(),
    keywordsList: [] as string[],
    setKeywordsList: vi.fn(),
    startDate: null as Date | null,
    setStartDate: vi.fn(),
    endDate: null as Date | null,
    setEndDate: vi.fn(),
    minPrice: '',
    setMinPrice: vi.fn(),
    maxPrice: '',
    setMaxPrice: vi.fn(),
    dateError: false,
    priceError: false,
    backup: vi.fn(),
    restoreInitialValues: vi.fn(),
    handleResetFilters: vi.fn(),
  },
  sortState: {
    sortField: 'datetime' as SortParams['field'],
    setSortField: vi.fn(),
    sortDirection: 'DESC' as SortParams['direction'],
    setSortDirection: vi.fn(),
  },
  suggestions: [] as string[],
  applyFilters: vi.fn(),
  applySorts: vi.fn(),
  handleAddKeyword: vi.fn(),
})

export const mockUseExpenseForm = () => ({
  form: {},
  editingExpense: null,
  updateFormField: vi.fn(),
  setFormFromExpense: vi.fn(),
  resetForm: vi.fn(),
});

export const mockExpense: Expense = {
  id: 1,
  title: 'Test Expense',
  category: { id: 1, name: 'Food' },
  price: 100,
  location: { id: 1, name: 'Store' },
  datetime: '2023-01-01T00:00:00Z',
};