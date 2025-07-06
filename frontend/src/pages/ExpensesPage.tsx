import { useEffect, useState } from "react";
import { deleteExpense, fetchExpenses, type Expense } from "../api";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { Modal } from "../components/Modal";

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const load = async () => {
    const res = await fetchExpenses();
    setExpenses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddComplete = () => {
    load();
    setIsOpen(false);
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
  };

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

  return (
    <section className="relative max-w-md mx-auto px-2">
      {/* ТОП-бар в режиме выбора */}
      {selectionMode && (
        <div className="flex justify-between items-center p-2 bg-gray-100 mb-2 rounded">
          <span>{selectedIds.length} выбрано</span>
          <div className="space-x-2">
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
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Ваши расходы</h2>
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditClick}
          onLongPress={handleLongPress}
          onSelect={handleSelect}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
        />
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white
                   font-bold py-3 px-4 rounded-full shadow-lg"
      >
        +
      </button>

      {/* Modal для добавления */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)}>
          <h3 className="text-lg font-semibold mb-3 text-center">
            Добавить расход
          </h3>
          <ExpenseForm onCreated={handleAddComplete} />
        </Modal>
      )}

      {/* Modal для редактирования */}
      {editingExpense && (
        <Modal
          isOpen={true}
          onClose={() => setEditingExpense(null)}
        >
          <h3 className="text-lg font-semibold mb-3 text-center">
            Редактировать расход
          </h3>
          <ExpenseForm
            initialData={editingExpense}
            onCreated={() => {
              load();
              setEditingExpense(null);
            }}
          />
        </Modal>
      )}
    </section>
  );
};
