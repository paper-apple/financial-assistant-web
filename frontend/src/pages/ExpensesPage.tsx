import { useState, useEffect, useCallback } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { useSelection } from "../hooks/useSelection";
import { useFilterSort } from "../hooks/useFilterSort";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { FloatingActionButtons } from "../components/FloatingActionButtons";
import { ExpenseModals } from "../components/ExpenseModals";
import { TopActionBar } from "../components/TopActionBar";
import { AuthModal } from "../components/AuthModal";
import type{ Expense } from "../types";
import { useAuth } from "../hooks/useAuth";

export const ExpensesPage = () => {
  const {
    user,
    error: authError, setError,
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
    loadExpenses,
    updateExpense,
    addExpense,
    removeExpenses
  } = useExpenses();

  const {
    selectionMode,
    selectedIds,
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
    handleResetFilters,
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
    calendar: false,
  });

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    checkAuth();
  }, []);

  const handleAuth = async (username: string, password: string) => {
    try {
      setError("");
      const fn = isLoginMode ? loginUser : registerUser;
      await fn(username, password);
      loadExpenses();
      console.log('qweqwe')
      setAuthModalOpen(false);
    } catch (error: any) {
      console.error("Ошибка:", error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setAuthModalOpen(true);
  };

  const openModal = useCallback((modal: keyof typeof modals) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setModals(prev => ({ ...prev, [modal]: true }));
  }, [user]);

  const closeModal = useCallback((modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
    if (modal === "update" || modal === "add") {
      resetForm();
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
    closeModal("add");
  }, [addExpense, closeModal]);

  // Редактирование расхода
  const handleUpdated = useCallback((updated: Expense) => {
    updateExpense(updated);
    closeModal("update");
  }, [updateExpense, closeModal]);

  return (
    <section>
      <AuthModal
        isOpen={authModalOpen}
        isLoginMode={isLoginMode}
        error={authError}
        onAuth={handleAuth}
        onToggleMode={() => setIsLoginMode(!isLoginMode)}
        onClose={() => setAuthModalOpen(false)}
      />

      {user && (
        <>
          {selectionMode && (
            <TopActionBar
              selectedCount={selectedIds.length}
              totalCount={expenses.length}
              onSelectAll={handleSelectAll}
              onDelete={() => handleDeleteSelected(removeExpenses)}
              onCancel={handleCancelSelection}
            />
          )}

          <div className="mt-4 mx-auto">
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditClick}
              onLongPress={handleLongPress}
              onSelect={handleSelect}
              selectionMode={selectionMode}
              selectedIds={selectedIds}
              lastUpdatedId={lastUpdatedId}
            />
          </div>
          
          {/* <div className="mt-4 mx-auto"> */}
          <FloatingActionButtons
            onAdd={() => openModal("add")}
            onFilter={() => openModal("filters")}
            onSort={() => openModal("sort")}
            onStats={() => openModal("stats")}
            onLogout={() => handleLogout()}
          />
          {/* </div> */}

          <ExpenseModals
            form={form}
            modals={modals}
            editingExpense={editingExpense}
            sortedExpenses={expenses}
            filtersState={filtersState}
            sortState={sortState}
            suggestions={suggestions}
            handleReset={handleResetFilters}
            closeModal={closeModal}
            openModal={openModal}
            handleCreated={handleCreated}
            handleUpdated={handleUpdated}
            applyFilters={applyFilters}
            applySorts={applySorts}
            handleAddKeyword={handleAddKeyword}
            updateFormField={updateFormField}
          />
        </>
      )}
    </section>
  );
};