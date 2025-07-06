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
}: {
  expense: Expense;
  onEdit?: (e: Expense) => void;
  onLongPress?: (id: number) => void;
  onSelect?: (id: number) => void;
  selectionMode: boolean;
  selected: boolean;
}) => {
  const timerRef = useRef<number | null>(null);

  const startPress = () => {
    if (!onLongPress) return;
    timerRef.current = window.setTimeout(() => {
      onLongPress(expense.id);
    }, 1000);
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

  return (
    <li
      key={expense.id}
      className={`relative cursor-pointer p-2 rounded border ${
        selected ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"
      }`}
      onMouseDown={startPress}
      onTouchStart={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchEnd={cancelPress}
      onClick={handleClick}
    >
      {selectionMode && selected && (
        <span className="absolute top-1 right-1 text-blue-600">✔️</span>
      )}
      <div className="font-semibold">{expense.title}</div>
      <div className="text-sm text-gray-600">{expense.category}</div>
      {/* … другие поля */}
    </li>
  );
};

