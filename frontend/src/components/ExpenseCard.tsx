// components/ExpenseCard
import { useRef } from "react";
import type { Expense } from "../types";

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

  // Флаг, что longPress был совершен
  const longPressTriggered = useRef(false);

  const startPress = () => {
    if (!onLongPress) return;
    movedRef.current = false;
    longPressTriggered.current = false;  // сброс перед новым прессом
    timerRef.current = window.setTimeout(() => {
      if (!movedRef.current) {
        onLongPress(expense.id);
        longPressTriggered.current = true;
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
    // Если только что отработал longPress — игнорируем этот «клик»
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    
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
      data-testid={`expense-card-${expense.id}`}
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
        data-testid={`highlight-${expense.id}`}
        className={`absolute inset-0 rounded bg-green-100 pointer-events-none
          transition-opacity duration-700
          ${highlight ? "opacity-100" : "opacity-0"}`}
      />

        {/* Контент */}
        <div className="relative z-10">
          {selectionMode && selected && (
            <span className="absolute top-1 right-1 text-blue-600">✔️</span>
          )}
          <div className="font-semibold" data-testid="expense-title">{expense.title}</div>
          <div className="text-sm text-blue-600" data-testid="expense-category">{expense.category.name}</div>
          <div className="text-xs text-gray-700 leading-tight" data-testid="expense-location">{expense.location.name}</div>
          <div className="flex justify-between text-xs text-gray-800 mt-1" data-testid="expense-price">
            <span className="font-medium">{expense.price} ₽</span>
            <span className="text-gray-500" data-testid="expense-datetime">{new Date(expense.datetime).toLocaleString()}</span>
          </div>
        </div>
    </li>
  );
};
