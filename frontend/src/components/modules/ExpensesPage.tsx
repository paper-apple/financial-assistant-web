// ExpensesPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useExpenses } from "../../hooks/useExpenses";
import { useSelection } from "../../hooks/useSelection";
import { useFilterSort } from "../../hooks/useFilterSort";
import { useExpenseForm } from "../../hooks/useExpenseForm";
import { ExpenseList } from "./ExpenseList";
import { FloatingActionButtons } from "./FloatingActionButtons";
import { ExpenseModals } from "./ExpenseModals";
import { TopActionBar } from "./TopActionBar";
import { AuthModal } from "./AuthModal";
import type { Expense } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "../../hooks/useTranslation";

export const ExpensesPage = () => {
  const {
    user,
    authError,
    authModalOpen, setAuthModalOpen,
    isLoginMode, setIsLoginMode,
    checkAuth,
    loginUser,
    registerUser,
    logoutUser
  } = useAuth();

  const {
    expenses,
    lastUpdatedId,
    setExpenses,
    loadExpenses,
    updateExpense,
    addExpense,
    removeExpenses
  } = useExpenses();

  const {
    selectionMode,
    selectedIds,
    setSelectionMode,
    handleLongPress,
    handleSelect,
    handleDeleteSelected,
    handleCancelSelection,
    handleSelectAll
  } = useSelection(expenses);

  const {
    filtersState,
    sortState,
    suggestions,
    applyFilters,
    applySorts,
    handleAddKeyword,
  } = useFilterSort(loadExpenses);

  const {
    form,
    editingExpense,
    updateFormField,
    setFormFromExpense,
    resetForm,
  } = useExpenseForm();
  
  const [modals, setModals] = useState({
    add: false,
    update: false,
    filters: false,
    sort: false,
    stats: false,
    settings: false,
    calendar: false,
    startDate: false,
    endDate: false,
  });

  // Первоначальная проверка, что пользователь в системе
  useEffect(() => {
    checkAuth();
  }, []);

  const { t } = useTranslation()

  const handleAuth = async (username: string, password: string) => {
    try {
      let fn = loginUser;
      if (username != "testuser") {
        fn = isLoginMode ? loginUser : registerUser;
      }
      await fn(username, password);
      loadExpenses();
      setAuthModalOpen(false);
      setIsLoginMode(true);
    } catch (error: any) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    filtersState.handleResetFilters();
    setExpenses([]);
    await logoutUser();
    setAuthModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(true)
  const [isCalendarOpen, setIsCalendarOpen] = useState(true)

  const handleCloseCalendar = async () => {
    setIsCalendarOpen(false)
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false)
  };

  const openModal = useCallback((modal: keyof typeof modals) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setModals(prev => ({ ...prev, [modal]: true }));

  }, [user]);

  const closeModal = useCallback((modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }))
    setIsModalOpen(true)
    setIsCalendarOpen(true)
    if (modal === "update" || modal === "add") {
      setTimeout(() => {resetForm()}, 100);
    }
    else if (modal === "filters") {
      filtersState.setKeywordInput('');
    }
  }, []);

  // Выбор карточки
  const handleEditClick = useCallback((expense: Expense) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setFormFromExpense(expense);
    openModal("update");
  }, [user, openModal, setFormFromExpense]);

  // Создание расхода
  const handleCreated = useCallback((created: Expense) => {
    addExpense(created);
    loadExpenses();
    closeModal("add");
  }, [addExpense, closeModal]);

  // Редактирование расхода
  const handleUpdated = useCallback((updated: Expense) => {
    updateExpense(updated);
    loadExpenses();
    closeModal("update");
  }, [updateExpense, closeModal]);

  return (
    <section>
      <h1 className="upper-text">
        {t('financial_assistant')}
      </h1>
      <AuthModal
        isOpen={authModalOpen}
        isLoginMode={isLoginMode}
        error={authError}
        onAuth={handleAuth}
        onToggleMode={() => setIsLoginMode(!isLoginMode)}
      />

      <FloatingActionButtons
        onAdd={() => openModal("add")}
        onFilter={() => openModal("filters")}
        onSort={() => openModal("sort")}
        onStats={() => openModal("stats")}
        onSettings={() => openModal("settings")}
        closeSelection={() => handleCancelSelection()} 
      />
      {user && (
        <>
          <TopActionBar
            selectedCount={selectedIds.length}
            totalCount={expenses.length}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
            onSelectAll={handleSelectAll}
            onDelete={() => handleDeleteSelected(removeExpenses)}
            onCancel={handleCancelSelection}
          />

          <ExpenseList
            expenses={expenses}
            onEdit={handleEditClick}
            onLongPress={handleLongPress}
            onSelect={handleSelect}
            selectionMode={selectionMode}
            selectedIds={selectedIds}
            lastUpdatedId={lastUpdatedId}
          />

          <ExpenseModals
            form={form}
            modals={modals}
            editingExpense={editingExpense}
            sortedExpenses={expenses}
            filtersState={filtersState}
            sortState={sortState}
            suggestions={suggestions}
            closeModal={closeModal}
            openModal={openModal}
            handleCreated={handleCreated}
            handleLogout={handleLogout}
            handleUpdated={handleUpdated}
            applyFilters={applyFilters}
            applySorts={applySorts}
            handleAddKeyword={handleAddKeyword}
            updateFormField={updateFormField}
            isModalOpen={isModalOpen}
            isCalendarOpen={isCalendarOpen}
            handleCloseModal={handleCloseModal}
            handleCloseCalendar={handleCloseCalendar}
          />
        </>
      )}
    </section>
  );
};