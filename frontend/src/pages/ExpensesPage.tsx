import { useEffect, useState, useCallback  } from "react";
import { deleteExpense, fetchExpenses } from "../api";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { Modal } from "../components/Modal";
import {FilterForm} from "../components/FilterForm.tsx";
import { SortForm } from "../components/SortForm";
import { StatsModal } from "../components/StatsModal";
import { type Expense, type FilterParams, type SortParams} from "../types.tsx"

export const ExpensesPage = () => {
  const [isAddOpen, setIsAddOpen]           = useState(false);
  const [isUpdateOpen, setIsUpdateOpen]     = useState(false);
  const [selectionMode, setSelectionMode]   = useState(false);
  const [showFilters, setShowFilters]       = useState(false);
  const [statsOpen, setStatsOpen]           = useState(false);
  const [showSort, setShowSort]             = useState(false);
  const [expenses, setExpenses]             = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedIds, setSelectedIds]       = useState<number[]>([]);
  const [lastUpdatedId, setLastUpdatedId]   = useState<number | null>(null);
  const [sortParams, setSortParams]         = useState<SortParams>({
    field: "datetime",
    direction: "desc",
  });
  const [filters, setFilters]               = useState<FilterParams>({
    startDate: null,
    endDate:   null,
    minPrice:  null,
    maxPrice:  null,
    keywords:  [],
  })
  const comparators: Record<SortParams["field"], (a: Expense, b: Expense) => number> = {
    title: (a, b) => a.title.localeCompare(b.title),
    category: (a, b) => a.category.localeCompare(b.category),
    price: (a, b) => Number(a.price) - Number(b.price),
    location: (a, b) => a.location.localeCompare(b.location),
    datetime: (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
};

  const filteredExpenses = expenses.filter((exp) => {
    const date = new Date(exp.datetime);
    const price = Number(exp.price);

    const inDateRange =
      (!filters.startDate || date >= filters.startDate) &&
      (!filters.endDate || date <= filters.endDate);

    const inPriceRange =
      (!filters.minPrice || price >= filters.minPrice) &&
      (!filters.maxPrice || price <= filters.maxPrice);

    // Новый блок: проверяем каждое ключевое слово
    const inKeyword =
      filters.keywords.length === 0 ||
      filters.keywords.some(term =>
        exp.title.toLowerCase().includes(term) ||
        exp.category.toLowerCase().includes(term) ||
        exp.location.toLowerCase().includes(term)
      );

    return inDateRange && inPriceRange && inKeyword
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const cmp = comparators[sortParams.field]?.(a, b) ?? 0;
    return sortParams.direction === "asc" ? cmp : -cmp;
  });

  const load = async () => {
    const res = await fetchExpenses();
    setExpenses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  // Ленивая подгрузка расходов
  useEffect(() => {
    fetchExpenses().then(res => setExpenses(res.data))
  }, [])

  useEffect(() => {
  if (lastUpdatedId !== null) {
    const timer = setTimeout(() => setLastUpdatedId(null), 2000);
    return () => clearTimeout(timer);
  }
  }, [lastUpdatedId]);

  const handleEditClick = (expense: Expense) => {
    setIsUpdateOpen(true);
    setEditingExpense(expense);
  };

  // При обновлении — заменяем в массиве
  const handleUpdated = (updated: Expense) => {
    setExpenses(prev =>
      prev.map(e => (e.id === updated.id ? updated : e))
    );
    setLastUpdatedId(updated.id);    // запоминаем ID
    setEditingExpense(null);
  };

  // При создании — добавляем в конец
  const handleCreated = (created: Expense) => {
    setExpenses(prev => [...prev, created]);
    setIsAddOpen(false);
  };

  // Функция для применения новых фильтров из модалки
  const handleFilters = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters)
    setShowFilters(false)
  }, [])

  // Запуск режима выбора и отметка первой карточки
  const handleLongPress = (id: number) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedIds([id]);
    }
  };

  // Тоггл выделения карточки
  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Удалить выбранные
  const handleDeleteSelected = async () => {
    // Здесь ваша реализация удаления через API
    await Promise.all(selectedIds.map((id) => deleteExpense(id)));
    await load();
    setSelectionMode(false);
    setSelectedIds([]);
  };

  // Отменить режим выбора
  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  // Новый хендлер «Выделить всё / Снять всё»
  const handleSelectAll = () => {
    if (selectedIds.length === expenses.length) {
      // Если уже всё выбрано → сбросить
      setSelectedIds([]);
    } else {
      // Иначе выбрать все IDs
      setSelectedIds(expenses.map((e) => e.id));
    }
  };

  // 3) Колбэки для открытия/применения сортировки
  const handleSortApply = useCallback((newSort: SortParams) => {
    setSortParams(newSort);
    setShowSort(false);
  }, []);

  return (
    <section >
      {/* ТОП-бар в режиме выбора */}
      {selectionMode && (
        <div className="fixed top-0 left-0 right-0 z-40 p-2 bg-gray-100 shadow-md border-b">
          <div className="flex justify-between items-center">
            <span>{selectedIds.length} выбрано</span>
            <div className="space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                {selectedIds.length === expenses.length ? "Снять всё" : "Выделить всё"}
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Удалить
              </button>
              <button
                onClick={handleCancelSelection}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Ваши расходы</h2>
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

      {/* Кнопка "+" */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white
        font-bold py-2 px-3.5 rounded-full  z-50"
      >
        +
      </button>
      
      {/* Кнопка для фильтрации */}
      <button
        onClick={() => setShowFilters(true)}
        className="fixed bottom-4 right-20 bg-blue-600 hover:bg-blue-700 text-white
        font-bold py-2 px-3.5 rounded-full z-50"
      >
        Фильтры
      </button>

      {/* Кнопка для сортировки */}
      <button
        onClick={() => setShowSort(true)}
        className="fixed bottom-4 right-50 bg-blue-600 hover:bg-blue-700 text-white
        font-bold py-2 px-3.5 rounded-full z-50"
      >
        Сортировка
      </button>

      {/* Кнопка для статистики */}
      <button
        onClick={() => setStatsOpen(true)}
        className="fixed bottom-4 right-90 bg-blue-600 hover:bg-blue-700 text-white
        font-bold py-2 px-3.5 rounded-full z-50"
      >
        Статистика
      </button>

      {/* Modal для добавления */}
      {isAddOpen && (
        <Modal isOpen onClose={() => setIsAddOpen(false)} title="Добавить расход">
          {/* <h3 id="calendar-modal-title" className="text-lg font-semibold mb-3 text-center">
            Добавить расход
          </h3> */}
          <ExpenseForm 
            isOpen={isAddOpen}
            onCreated={handleCreated}
          />
        </Modal>
      )}

      {/* Modal для редактирования */}
      {isUpdateOpen && editingExpense && (
        <Modal isOpen onClose={() => setIsUpdateOpen(false)}>
          <h3 className="text-lg font-semibold mb-3 text-center">
            Редактировать расход
          </h3>
          <ExpenseForm
            isOpen={isUpdateOpen}
            initialData={editingExpense}
            onUpdated={handleUpdated}
          />
        </Modal>
      )}

      {/* Modal для фильтрации */}
      {showFilters && (
        <Modal isOpen onClose={() => setShowFilters(false)}>
          <h3 className="text-lg font-semibold mb-3 text-center">
            Фильтры
          </h3>
          <FilterForm
            isOpen={showFilters}
            initialValues={filters}
            onApply={handleFilters}
          />
        </Modal>
      )}

      {/* 4. Модалка сортировки */}
      {showSort && (
        <Modal isOpen onClose={() => setShowSort(false)}>
          <h3 className="text-lg font-semibold mb-3 text-center">
            Сортировка
          </h3>
          <SortForm
            isOpen={showSort}
            initialValues={sortParams}
            onApply={handleSortApply}
            onClose={() => setShowSort(false)}
          />
        </Modal>
      )}

      {/* Модалка статистики */}
      {statsOpen && (
        <Modal isOpen onClose={() => setStatsOpen(false)}>
          <h3 className="text-lg font-semibold mb-3 text-center">
            Статистика
          </h3>
          <StatsModal
            isOpen={statsOpen}
            onClose={() => setStatsOpen(false)}
            expenses={filteredExpenses} // важно: передаём именно отображаемые элементы
            initialField="category"
            currency="BYN"
          />
        </Modal>
      )}
    </section>
  );
};
