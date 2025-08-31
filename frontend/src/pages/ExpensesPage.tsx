import { useState, useEffect, useCallback } from "react";
import { ExpenseList } from "../components/ExpenseList";
import { TopActionBar } from "../components/TopActionBar";
import { FloatingActionButtons } from "../components/FloatingActionButtons";
import { ExpenseModals } from "../components/ExpenseModals";
import { useExpenses } from "../hooks/useExpenses";
import { useSelection } from "../hooks/useSelection";
import { useFilterSort } from "../hooks/useFilterSort";
import { useExpenseForm } from "../hooks/useExpenseForm";
import type { Expense } from "../types";
import { fetchExpenses, logout } from "../api";
import AuthForm from "../components/AuthForm";
import type { AxiosResponse } from "axios";

const PAGE_TITLE = "Ваши расходы";

export const ExpensesPage = () => {
  const {
    expenses,
    lastUpdatedId,
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
    sortedExpenses,
    filters,
    sortParams,
    handleFilters,
    handleSortApply
  } = useFilterSort(expenses);

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

  const openModal = useCallback((modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  }, []);

  const closeModal = useCallback((modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
    if (modal === "update" || modal === "add") {
      resetForm();
    }
  }, []);

  // Выбор катрочки
  const handleEditClick = useCallback((expense: Expense) => {
    setFormFromExpense(expense);
    openModal("update");
  }, []);

  // Создание расхода
  const handleCreated = useCallback((created: Expense) => {
    addExpense(created);
    closeModal("add");
  }, []);

  // Редактирование расхода
  const handleUpdated = useCallback((updated: Expense) => {
    updateExpense(updated);
    closeModal("update");
  }, []);

  // const [user, setUser] = useState<any>(null);
  // const [authExpenses, setAuthExpenses] = useState<Expense[]>([]);
  // const [isLogin, setIsLogin] = useState(true);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const checkAuth = async () => {
  //   try {
  //     console.log("1");
  //     const response = await fetchExpenses();
  //     console.log("2")
  //     setUser({ username: 'Авторизован' }); // Простая проверка
  //     setAuthExpenses(response.data);
  //   } catch (error) {
  //     setUser(null);
  //   }
  // };

  // const handleAuth = (authData: any) => {
  //   setUser(authData.user);
  //   checkAuth();
  // };

  // const handleLogout = async () => {
  //   await logout();
  //   setUser(null);
  //   setAuthExpenses([]);
  // };

  // if (!user) {
  //   return (
  //     <div>
  //       <AuthForm 
  //         onAuth={handleAuth} 
  //         isLogin={isLogin}
  //       />
  //       <button onClick={() => setIsLogin(!isLogin)}>
  //         {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
  //       </button>
  //     </div>
  //   );
  // }
  
  // return (
  //   <div>
  //     <div>
  //       <span>Привет, {user.username}!</span>
  //       <button onClick={handleLogout}>Выйти</button>
  //     </div>
  //     <ul>
  //       {expenses.map((e: any) => (
  //         <li key={e.id}>{e.title} — {e.price}</li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  return (
    <section>
      {selectionMode && (
        <TopActionBar
          selectedCount={selectedIds.length}
          totalCount={expenses.length}
          onSelectAll={handleSelectAll}
          onDelete={() => handleDeleteSelected(removeExpenses)}
          onCancel={handleCancelSelection}
        />
      )}

      <div className={`${selectionMode ? 'mt-12' : 'mt-6'}`}>
        <h2 className="text-xl font-semibold">{PAGE_TITLE}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ExpenseList
            expenses={sortedExpenses}
            onEdit={handleEditClick}
            onLongPress={handleLongPress}
            onSelect={handleSelect}
            selectionMode={selectionMode}
            selectedIds={selectedIds}
            lastUpdatedId={lastUpdatedId}
          />
        </div>
      </div>

      <FloatingActionButtons
        onAdd={() => openModal("add")}
        onFilter={() => openModal("filters")}
        onSort={() => openModal("sort")}
        onStats={() => openModal("stats")}
      />

      <ExpenseModals
        modals={modals}
        editingExpense={editingExpense}
        form={form}
        filters={filters}
        sortParams={sortParams}
        expenses={sortedExpenses}
        onClose={closeModal}
        onOpen={openModal}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        onFiltersApply={handleFilters}
        onSortApply={handleSortApply}
        updateField={updateFormField}
      />
    </section>
  );
};