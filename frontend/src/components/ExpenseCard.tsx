// components/ExpenseCard
import { useRef } from "react";
import type { Expense } from "../api";

console.log("ExpenseCard loaded");

export const ExpenseCard = ({
  expense,
  onEdit,
  onLongPress,
  onSelect,
  selectionMode,
  selected,
  highlight,
}: {
  expense: Expense;
  onEdit?: (e: Expense) => void;
  onLongPress?: (id: number) => void;
  onSelect?: (id: number) => void;
  selectionMode: boolean;
  selected: boolean;
  highlight?: boolean;
}) => {
  const timerRef = useRef<number | null>(null);
  const movedRef = useRef(false);

  const startPress = () => {
    if (!onLongPress) return;
    movedRef.current = false;
    timerRef.current = window.setTimeout(() => {
      if (!movedRef.current) {
        onLongPress(expense.id);
      }
    }, 400);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (selectionMode && onSelect) {
      onSelect(expense.id);
    } else {
      onEdit?.(expense);
    }
  };

  const handleTouchMove = () => {
    movedRef.current = true;
    cancelPress();
  };

  return (
    <li
      key={expense.id}
      className={`relative cursor-pointer p-4 rounded-lg border overflow-hidden
      shadow-md hover:shadow-lg transition-shadow duration-300 select-none
      ${selected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
      onMouseDown={startPress}
      onTouchStart={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchEnd={cancelPress}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
    >
      {/* Подсветка обновления */}
      <div
        className={`absolute inset-0 rounded bg-green-100 pointer-events-none
          transition-opacity duration-700
          ${highlight ? "opacity-100" : "opacity-0"}`}
      />

        {/* Контент */}
        <div className="relative z-10">
          {selectionMode && selected && (
            <span className="absolute top-1 right-1 text-blue-600">✔️</span>
          )}
          <div className="font-semibold">{expense.title}</div>
          <div className="text-sm text-blue-600">{expense.category}</div>
          <div className="text-xs text-gray-700 leading-tight">{expense.location}</div>
          <div className="flex justify-between text-xs text-gray-800 mt-1">
            <span className="font-medium">{expense.price.toFixed(2)} ₽</span>
            <span className="text-gray-500">{new Date(expense.datetime).toLocaleString()}</span>
        </div>
      </div>
    </li>
  );
};
