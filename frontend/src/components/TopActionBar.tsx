// components/TopActionBar.tsx
import type { Expense } from "../types";

type Props = {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

export const TopActionBar = ({ 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onDelete, 
  onCancel 
}: Props) => (
  <div className="fixed top-0 left-0 right-0 z-40 p-2 bg-gray-100 shadow-md border-b">
    <div className="flex justify-between items-center">
      <span>{selectedCount} выбрано</span>
      <div className="space-x-2">
        <button
          onClick={onSelectAll}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          {selectedCount === totalCount ? "Снять всё" : "Выделить всё"}
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Удалить
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
);