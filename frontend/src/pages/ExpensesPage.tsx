// import { useState, useEffect } from "react";
// import { ExpenseList } from "../components/ExpenseList";
// import { TopActionBar } from "../components/TopActionBar";
// import { FloatingActionButtons } from "../components/FloatingActionButtons";
// import { ExpenseModals } from "../components/ExpenseModals";
// import { useExpenses } from "../hooks/useExpenses";
// import { useSelection } from "../hooks/useSelection";
// import { useFilterSort } from "../hooks/useFilterSort";
// import type { 
//   Expense,
//   FormState,
// } from "../types";

// export const ExpensesPage = () => {
//   // Управление расходами
//   const {
//     expenses,         // Весь список расходов (без фильтрации и сортировки)
//     lastUpdatedId,    // ID последнего обновленного расхода (для анимации)
//     updateExpense,    // Функция для обновления расхода
//     addExpense,       // Функция для добавления нового расхода
//     removeExpenses    // Функция для удаления нескольких расходов
//   } = useExpenses();

//   // Управление выделением
//   const {
//     selectionMode,       // Режим выбора (вкл/выкл)
//     selectedIds,         // Массив выбранных ID
//     handleLongPress,     // Обработчик долгого нажатия (включает режим выбора и выделяет карточку)
//     handleSelect,        // Обработчик выбора карточки (в режиме выбора)
//     handleDeleteSelected, // Обработчик удаления выбранных карточек (но не выполняет удаление, а вызывает функцию removeExpenses)
//     handleCancelSelection, // Отмена режима выбора
//     handleSelectAll       // Выделить все / снять выделение
//   } = useSelection(expenses); // Передаем общий список расходов (для выделения всех)

//   // Фильтрация и сортировка
//   const {
//     sortedExpenses,   // Отфильтрованные и отсортированные расходы (то, что показывается)
//     filters,          // Текущие параметры фильтрации
//     sortParams,       // Текущие параметры сортировки
//     handleFilters,    // Функция для применения новых фильтров
//     handleSortApply   // Функция для применения новой сортировки
//   } = useFilterSort(expenses); // Исходные расходы

//   // Состояния модальных окон
//   const [modals, setModals] = useState({
//     add: false,
//     update: false,
//     filters: false,
//     sort: false,
//     stats: false,
//     calendar: false,
//   });

//   function initFormFromExpense(expense?: Expense): FormState {
//     return {
//       title: expense?.title || "",
//       category: expense?.category || "",
//       price: expense ? String(expense.price) : "",
//       location: expense?.location || "",
//       datetime: expense?.datetime || new Date().toISOString(),
//     };
//   }

//   // Редактируемый расход
//   const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

//   const [form, setForm] = useState<FormState>(() => initFormFromExpense());

//   useEffect(() => {
//     setForm(initFormFromExpense(editingExpense ?? undefined));
//   }, [editingExpense]);

//   const updateFormField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };

//   // Обработчики для модалок
//   const openModal = (modal: keyof typeof modals) => {
//     setModals(prev => ({ ...prev, [modal]: true }));
//   };

//   const closeModal = (modal: keyof typeof modals) => {
//     setModals(prev => ({ ...prev, [modal]: false }));
//     if (modal === "update" || "add") {
//       setEditingExpense(null);
//       setForm(initFormFromExpense(undefined));
//     }
//   };

//   // устанавливает расход для редактирования и открывает модалку редактирования
//   const handleEditClick = (expense: Expense) => {
//     setEditingExpense(expense);
//     openModal("update");
//   };

//   // вызывается после успешного создания расхода (добавляет расход и закрывает модалку)
//   const handleCreated = (created: Expense) => {
//     addExpense(created);
//     closeModal("add");
//   };

//   // вызывается после успешного обновления расхода (обновляет расход и закрывает модалку)
//   const handleUpdated = (updated: Expense) => {
//     updateExpense(updated);
//     closeModal("update");
//   };

//   return (
//     <section>
//       {/* Панель действий в режиме выбора */}
//       {selectionMode && (
//         <TopActionBar
//           selectedCount={selectedIds.length}
//           totalCount={expenses.length}
//           onSelectAll={handleSelectAll}
//           onDelete={() => handleDeleteSelected(removeExpenses)}
//           onCancel={handleCancelSelection}
//         />
//       )}

//       {/* Основной контент */}
//       <div className={`${selectionMode ? 'mt-12' : 'mt-6'}`}>
//         <h2 className="text-xl font-semibold">Ваши расходы</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           <ExpenseList
//             expenses={sortedExpenses}
//             onEdit={handleEditClick}
//             onLongPress={handleLongPress}
//             onSelect={handleSelect}
//             selectionMode={selectionMode}
//             selectedIds={selectedIds}
//             lastUpdatedId={lastUpdatedId}
//           />
//         </div>
//       </div>

//       {/* Плавающие кнопки */}
//       <FloatingActionButtons
//         onAdd={() => openModal("add")}
//         onFilter={() => openModal("filters")}
//         onSort={() => openModal("sort")}
//         onStats={() => openModal("stats")}
//       />

//       {/* Все модальные окна */}
//       <ExpenseModals
//         modals={modals}
//         editingExpense={editingExpense}
//         form={form}
//         filters={filters}
//         sortParams={sortParams}
//         expenses={sortedExpenses}
//         onClose={closeModal}
//         onOpen={openModal}
//         onCreated={handleCreated}
//         onUpdated={handleUpdated}
//         onFiltersApply={handleFilters}
//         onSortApply={handleSortApply}
//         updateField={updateFormField}
//       />
//     </section>
//   );
// };


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

  const [modals, setModals] = useState({
    add: false,
    update: false,
    filters: false,
    sort: false,
    stats: false,
    calendar: false,
  });

  const {
    form,
    editingExpense,
    updateFormField,
    setFormFromExpense,
    resetForm,
  } = useExpenseForm();

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

  // Редактировани расхода
  const handleUpdated = useCallback((updated: Expense) => {
    updateExpense(updated);
    closeModal("update");
  }, []);

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