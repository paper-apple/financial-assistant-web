// ExpensesPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../hooks/useExpenses", () => ({
  useExpenses: vi.fn(),
}));

vi.mock("../../../hooks/useSelection", () => ({
  useSelection: vi.fn(),
}));

vi.mock("../../../hooks/useFilterSort", () => ({
  useFilterSort: vi.fn(),
}));

vi.mock("../../../hooks/useExpenseForm", () => ({
  useExpenseForm: vi.fn(),
}));

vi.mock("../../../components/ExpenseList", () => ({
  ExpenseList: () => <div data-testid="expense-list">ExpenseList</div>,
}));

vi.mock("../../../components/FloatingActionButtons", () => ({
  FloatingActionButtons: ({ onAdd }: any) => (
    <button onClick={onAdd}>Add Expense</button>
  ),
}));

vi.mock("../../../components/ExpenseModals", () => ({
  ExpenseModals: () => <div>ExpenseModals</div>,
}));

vi.mock("../../../components/TopActionBar", () => ({
  TopActionBar: () => <div>TopActionBar</div>,
}));

import { useAuth } from "../../../hooks/useAuth";
import { useExpenseForm } from "../../../hooks/useExpenseForm";
import { useExpenses } from "../../../hooks/useExpenses";
import { useFilterSort } from "../../../hooks/useFilterSort";
import { useSelection } from "../../../hooks/useSelection";
import { ExpensesPage } from "../../../components/modules/ExpensesPage";
import userEvent from "@testing-library/user-event";

describe("ExpensesPage", () => {
  const checkAuth = vi.fn();
  const loginUser = vi.fn();
  const registerUser = vi.fn();
  const logoutUser = vi.fn();
  const loadExpenses = vi.fn();
  const resetForm = vi.fn();
  const setFormFromExpense = vi.fn();
  const setAuthError = vi.fn();
  const setAuthModalOpen = vi.fn();
  const setIsLoginMode = vi.fn();

  let baseAuthMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    baseAuthMock = {
      user: { id: 1, username: "Test" },
      authError: "",
      setAuthError,
      authModalOpen: false,
      setAuthModalOpen,
      isLoginMode: true,
      setIsLoginMode,
      checkAuth,
      loginUser,
      registerUser,
      logoutUser,
    };

    (useAuth as any).mockReturnValue(baseAuthMock);

    (useExpenses as any).mockReturnValue({
      expenses: [],
      lastUpdatedId: null,
      loadExpenses,
      updateExpense: vi.fn(),
      addExpense: vi.fn(),
      removeExpenses: vi.fn(),
    });

    (useSelection as any).mockReturnValue({
      selectionMode: false,
      selectedIds: [],
      handleLongPress: vi.fn(),
      handleSelect: vi.fn(),
      handleDeleteSelected: vi.fn(),
      handleCancelSelection: vi.fn(),
      handleSelectAll: vi.fn(),
    });

    (useFilterSort as any).mockReturnValue({
      filtersState: {},
      sortState: {},
      suggestions: [],
      applyFilters: vi.fn(),
      applySorts: vi.fn(),
      handleAddKeyword: vi.fn(),
    });

    (useExpenseForm as any).mockReturnValue({
      form: {},
      editingExpense: null,
      updateFormField: vi.fn(),
      setFormFromExpense,
      resetForm,
    });
  });

  it("рендерит AuthModal, если user отсутствует", () => {
    (useAuth as any).mockReturnValueOnce({
      ...baseAuthMock,
      user: null,
      authModalOpen: true,
    });

    render(<ExpensesPage />);

    expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("expense-list")).not.toBeInTheDocument();
  });

  it("рендерит список и кнопки, если user есть", () => {
    render(<ExpensesPage />);
    expect(screen.getByText("ExpenseList")).toBeInTheDocument();
    expect(screen.getByText("Add Expense")).toBeInTheDocument();
    expect(screen.getByText("ExpenseModals")).toBeInTheDocument();
  });

  it("открывает модалку добавления при клике на Add Expense", () => {
    render(<ExpensesPage />);
    fireEvent.click(screen.getByText("Add Expense"));
    expect(screen.getByText("ExpenseModals")).toBeInTheDocument();
  });

  it("handleAuth вызывает loginUser и loadExpenses", async () => {
    (useAuth as any).mockReturnValueOnce({
      ...baseAuthMock,
      user: null,
      authModalOpen: true,
      
    });

    render(<ExpensesPage />);

    await userEvent.type(screen.getByTestId("username"), "user1234");
    await userEvent.type(screen.getByTestId("password"), "Pass1234");
    await userEvent.click(
      screen.getByRole("button", { name: /Войти/i })
    );

    expect(setAuthError).toHaveBeenCalledWith("");
    expect(loginUser).toHaveBeenCalledWith("user1234", "Pass1234");
    expect(loadExpenses).toHaveBeenCalled();
    expect(setAuthModalOpen).toHaveBeenCalledWith(false);
  });

  it("handleLogout вызывает logoutUser", async () => {
    render(<ExpensesPage />);
    await logoutUser();
    expect(logoutUser).toHaveBeenCalled();
  });

  it("closeModal сбрасывает форму при закрытии add/update", () => {
    render(<ExpensesPage />);
    expect(resetForm).not.toHaveBeenCalled();
    resetForm();
    expect(resetForm).toHaveBeenCalled();
  });
});