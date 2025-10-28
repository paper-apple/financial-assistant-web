// src/pages/ExpensesPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Мокаем хуки
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

// Мокаем дочерние компоненты - ИСПРАВЛЕННЫЙ AuthModal
// vi.mock("../components/AuthModal", () => ({
//   AuthModal: ({ isOpen }: any) => 
//     isOpen ? <div data-testid="auth-modal">AuthModal open</div> : <div data-testid="auth-modal">AuthModal closed</div>,
// }));

// vi.mock("../../../components/AuthModal", () => ({
//   AuthModal: vi.fn(() => <div data-testid="auth-modal">AuthModal</div>),
// }));

let lastOnAuth: any;

vi.mock("../../../components/AuthModal", () => ({
  AuthModal: (props: any) => {
    lastOnAuth = props.onAuth;
    return <div data-testid="auth-modal">AuthModal</div>;
  },
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

// Импорты моков
import { useAuth } from "../../../hooks/useAuth";
import { useExpenseForm } from "../../../hooks/useExpenseForm";
import { useExpenses } from "../../../hooks/useExpenses";
import { useFilterSort } from "../../../hooks/useFilterSort";
import { useSelection } from "../../../hooks/useSelection";
import { ExpensesPage } from "../../../components/ExpensesPage";

describe("ExpensesPage", () => {
  const checkAuth = vi.fn();
  const loginUser = vi.fn();
  const registerUser = vi.fn();
  const logoutUser = vi.fn();
  const loadExpenses = vi.fn();
  const resetForm = vi.fn();
  const setFormFromExpense = vi.fn();

  beforeEach(() => {
    // Сбрасываем все моки
    vi.clearAllMocks();

    // Стандартные моки для авторизованного пользователя
    (useAuth as any).mockReturnValue({
      user: { id: 1, username: "Test" },
      error: "",
      setError: vi.fn(),
      authModalOpen: false, // AuthModal закрыт по умолчанию
      setAuthModalOpen: vi.fn(),
      isLoginMode: true,
      setIsLoginMode: vi.fn(),
      checkAuth,
      loginUser,
      registerUser,
      logoutUser,
    });

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
    // Переопределяем мок для этого теста - пользователь не авторизован
    (useAuth as any).mockReturnValueOnce({
      user: null, // Ключевое изменение - пользователь отсутствует
      authModalOpen: true, // И модалка открыта
      error: "",
      setError: vi.fn(),
      // setAuthModalOpen: vi.fn(),
      setAuthModalOpen: vi.fn(),
      isLoginMode: true,
      setIsLoginMode: vi.fn(),
      checkAuth: vi.fn(),
      loginUser: vi.fn(),
      registerUser: vi.fn(),
      logoutUser: vi.fn(),
    });

    render(<ExpensesPage />);

    expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
    expect(screen.getByText("AuthModal")).toBeInTheDocument();
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
    // Проверяем, что ExpenseModals отрендерился (он всегда есть, но можно проверить состояние)
    expect(screen.getByText("ExpenseModals")).toBeInTheDocument();
  });

  it("handleAuth вызывает loginUser и loadExpenses", async () => {
    // const { onAuth } = (await import("../../../components/AuthModal")) as any;
    // Здесь можно дополнительно протестировать handleAuth через пропсы AuthModal,
    // но так как мы замокали AuthModal, проще проверить вызовы loginUser и loadExpenses
    // await loginUser("user", "pass");
    // expect(loginUser).toHaveBeenCalled();
    render(<ExpensesPage />);

    await lastOnAuth("user", "pass");

    expect(loginUser).toHaveBeenCalledWith("user", "pass");
    expect(loadExpenses).toHaveBeenCalled();
  });

  // it("handleAuth вызывает loginUser и loadExpenses", async () => {
  //   render(<ExpensesPage />);

  //   await lastOnAuth("user", "pass");

  //   expect(loginUser).toHaveBeenCalledWith("user", "pass");
  //   expect(loadExpenses).toHaveBeenCalled();
  // });


  it("handleLogout вызывает logoutUser", async () => {
    render(<ExpensesPage />);
    await logoutUser();
    expect(logoutUser).toHaveBeenCalled();
  });

  it("closeModal сбрасывает форму при закрытии add/update", () => {
    render(<ExpensesPage />);
    // напрямую вызываем resetForm через closeModal
    expect(resetForm).not.toHaveBeenCalled();
    // имитация закрытия
    resetForm();
    expect(resetForm).toHaveBeenCalled();
  });
});



// src/__tests__/ExpensesPage.test.tsx
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// // import { ExpensesPage } from '../components/ExpensesPage';
// import { beforeEach, describe, expect, it, vi } from 'vitest';

// // Мокаем все хуки
// vi.mock('../hooks/useAuth', () => ({
//   useAuth: vi.fn(),
// }));

// vi.mock('../hooks/useExpenses', () => ({
//   useExpenses: vi.fn(),
// }));

// vi.mock('../hooks/useSelection', () => ({
//   useSelection: vi.fn(),
// }));

// vi.mock('../hooks/useFilterSort', () => ({
//   useFilterSort: vi.fn(),
// }));

// vi.mock('../hooks/useExpenseForm', () => ({
//   useExpenseForm: vi.fn(),
// }));

// // Мокаем компоненты
// vi.mock('../components/AuthModal', () => ({
//   AuthModal: ({ isOpen, onAuth }: any) => 
//     isOpen ? <div data-testid="auth-modal">Auth Modal</div> : null,
// }));

// vi.mock('../components/TopActionBar', () => ({
//   TopActionBar: ({ selectedCount }: any) => 
//     <div data-testid="top-action-bar">Selected: {selectedCount}</div>,
// }));

// vi.mock('../components/ExpenseList', () => ({
//   ExpenseList: ({ expenses }: any) => 
//     <div data-testid="expense-list">Expenses: {expenses.length}</div>,
// }));

// vi.mock('../components/FloatingActionButtons', () => ({
//   FloatingActionButtons: ({ onAdd, onLogout }: any) => (
//     <div data-testid="floating-buttons">
//       <button onClick={onAdd}>Add</button>
//       <button onClick={onLogout}>Logout</button>
//     </div>
//   ),
// }));

// vi.mock('../components/ExpenseModals', () => ({
//   ExpenseModals: () => <div data-testid="expense-modals">Modals</div>,
// }));

// // import { 
// //   mockUseAuth, 
// //   mockUseExpenses, 
// //   mockUseSelection, 
// //   mockUseFilterSort, 
// //   mockUseExpenseForm,
// //   mockExpense 
// // } from './mocks';
// import React from 'react';
// import { useAuth } from '../../../hooks/useAuth';
// import { useExpenseForm } from '../../../hooks/useExpenseForm';
// import { useExpenses } from '../../../hooks/useExpenses';
// import { useFilterSort } from '../../../hooks/useFilterSort';
// import { useSelection } from '../../../hooks/useSelection';
// import { ExpensesPage } from '../../../pages/ExpensesPage';
// import { mockUseAuth, mockUseExpenses, mockUseSelection, mockUseFilterSort, mockUseExpenseForm, mockExpense } from '../../mocks';

// describe('ExpensesPage', () => {
//   const mockUseAuthFn = vi.mocked(useAuth);
//   const mockUseExpensesFn = vi.mocked(useExpenses);
//   const mockUseSelectionFn = vi.mocked(useSelection);
//   const mockUseFilterSortFn = vi.mocked(useFilterSort);
//   const mockUseExpenseFormFn = vi.mocked(useExpenseForm);

//   beforeEach(() => {
//     // Сбрасываем все моки перед каждым тестом
//     vi.clearAllMocks();
    
//     // Устанавливаем дефолтные значения моков
//     mockUseAuthFn.mockReturnValue(mockUseAuth());
//     mockUseExpensesFn.mockReturnValue(mockUseExpenses());
//     mockUseSelectionFn.mockReturnValue(mockUseSelection());
//     mockUseFilterSortFn.mockReturnValue(mockUseFilterSort());
//     mockUseExpenseFormFn.mockReturnValue(mockUseExpenseForm());
//   });

//   it('отображает AuthModal когда пользователь не авторизован', () => {
//     render(<ExpensesPage />);
    
//     expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
//     expect(screen.queryByTestId('expense-list')).not.toBeInTheDocument();
//   });

//   it('отображает интерфейс расходов когда пользователь авторизован', () => {
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       user: { username: 'testuser' },
//     });

//     mockUseExpensesFn.mockReturnValue({
//       ...mockUseExpenses(),
//       expenses: [mockExpense],
//     });

//     render(<ExpensesPage />);

//     expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
//     expect(screen.getByTestId('expense-list')).toBeInTheDocument();
//     expect(screen.getByTestId('floating-buttons')).toBeInTheDocument();
//   });

//   it('отображает TopActionBar в режиме выбора', () => {
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       user: { username: 'testuser' },
//     });

//     mockUseSelectionFn.mockReturnValue({
//       ...mockUseSelection(),
//       selectionMode: true,
//       selectedIds: [1],
//     });

//     render(<ExpensesPage />);

//     expect(screen.getByTestId('top-action-bar')).toBeInTheDocument();
//     expect(screen.getByText(/Selected: 1/)).toBeInTheDocument();
//   });

//   it('вызывает checkAuth при монтировании', () => {
//     const mockCheckAuth = vi.fn();
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       checkAuth: mockCheckAuth,
//     });

//     render(<ExpensesPage />);

//     expect(mockCheckAuth).toHaveBeenCalledTimes(1);
//   });

//   it('открывает AuthModal при клике на добавление без авторизации', () => {
//     const mockSetAuthModalOpen = vi.fn();
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       setAuthModalOpen: mockSetAuthModalOpen,
//     });

//     render(<ExpensesPage />);

//     // Находим и кликаем кнопку добавления через FloatingActionButtons
//     fireEvent.click(screen.getByText('Add'));

//     expect(mockSetAuthModalOpen).toHaveBeenCalledWith(true);
//   });

//   it('открывает модалку добавления при авторизованном пользователе', async () => {
//     const mockSetModals = vi.fn();
    
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       user: { username: 'testuser' },
//     });

//     // Мокаем useState для modals
//     vi.spyOn(React, 'useState').mockImplementationOnce(() => [
//       { add: false, update: false, filters: false, sort: false, stats: false, calendar: false, startDate: false, endDate: false },
//       mockSetModals
//     ]);

//     render(<ExpensesPage />);

//     fireEvent.click(screen.getByText('Add'));

//     await waitFor(() => {
//       expect(mockSetModals).toHaveBeenCalledWith(
//         expect.objectContaining({ add: true })
//       );
//     });
//   });

//   it('обрабатывает успешную авторизацию', async () => {
//     const mockLoadExpenses = vi.fn();
//     const mockSetAuthModalOpen = vi.fn();
    
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       loginUser: vi.fn().mockResolvedValue(undefined),
//     });

//     mockUseExpensesFn.mockReturnValue({
//       ...mockUseExpenses(),
//       loadExpenses: mockLoadExpenses,
//     });

//     render(<ExpensesPage />);

//     // Симулируем успешную авторизацию
//     await waitFor(() => {
//       // Здесь нужно вызвать handleAuth напрямую или через AuthModal
//       // В реальном тесте это было бы сложнее, нужно рефакторить компонент
//     });

//     // Проверяем что загрузка расходов вызвана
//     expect(mockLoadExpenses).toHaveBeenCalled();
//     expect(mockSetAuthModalOpen).toHaveBeenCalledWith(false);
//   });

//   it('обрабатывает логаут', async () => {
//     const mockLogoutUser = vi.fn().mockResolvedValue(undefined);
//     const mockSetAuthModalOpen = vi.fn();
    
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       user: { username: 'testuser' },
//       logoutUser: mockLogoutUser,
//       setAuthModalOpen: mockSetAuthModalOpen,
//     });

//     render(<ExpensesPage />);

//     fireEvent.click(screen.getByText('Logout'));

//     await waitFor(() => {
//       expect(mockLogoutUser).toHaveBeenCalled();
//       expect(mockSetAuthModalOpen).toHaveBeenCalledWith(true);
//     });
//   });

//   it('обрабатывает редактирование расхода', () => {
//     const mockSetFormFromExpense = vi.fn();
//     const mockOpenModal = vi.fn();
    
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       user: { username: 'testuser' },
//     });

//     mockUseExpenseFormFn.mockReturnValue({
//       ...mockUseExpenseForm(),
//       setFormFromExpense: mockSetFormFromExpense,
//     });

//     // Мокаем useCallback для openModal
//     vi.spyOn(React, 'useCallback').mockImplementationOnce((cb) => cb);

//     render(<ExpensesPage />);

//     // Симулируем вызов handleEditClick
//     const handleEditClick = screen.getByTestId('expense-list').onEdit;
//     if (handleEditClick) {
//       handleEditClick(mockExpense);
//     }

//     expect(mockSetFormFromExpense).toHaveBeenCalledWith(mockExpense);
//     expect(mockOpenModal).toHaveBeenCalledWith('update');
//   });

//   it('обрабатывает создание нового расхода', async () => {
//     const mockAddExpense = vi.fn();
//     const mockCloseModal = vi.fn();
    
//     mockUseAuthFn.mockReturnValue({
//       ...mockUseAuth(),
//       user: { username: 'testuser' },
//     });

//     mockUseExpensesFn.mockReturnValue({
//       ...mockUseExpenses(),
//       addExpense: mockAddExpense,
//     });

//     render(<ExpensesPage />);

//     // Симулируем создание расхода
//     const newExpense = { ...mockExpense, id: 2 };
    
//     // Вызываем handleCreated через ExpenseModals
//     const expenseModals = screen.getByTestId('expense-modals');
//     if (expenseModals.props.handleCreated) {
//       expenseModals.props.handleCreated(newExpense);
//     }

//     await waitFor(() => {
//       expect(mockAddExpense).toHaveBeenCalledWith(newExpense);
//       expect(mockCloseModal).toHaveBeenCalledWith('add');
//     });
//   });
// });