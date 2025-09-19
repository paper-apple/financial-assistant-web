// components/ExpenseCard
import type { Expense } from "../types";
import { useLongPress } from "../hooks/useLongPress";
import {
  CalendarDateRangeIcon,
  RectangleStackIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/solid";

type Props = {
  expense: Expense;
  onEdit?: (e: Expense) => void;
  onLongPress?: (id: number) => void;
  onSelect?: (id: number) => void;
  selectionMode: boolean;
  selected: boolean;
  highlight?: boolean;
};

const InfoRow = ({
  icon: Icon,
  text,
  className = "text-sm",
}: {
  icon?: React.ElementType;
  text: string | number;
  className?: string;
}) => (
  <div className={`${className} flex items-center gap-1`}>
    {Icon && (
      <Icon className="w-4 h-4 text-blue-300" />)
    }
    {text}
  </div>
);

export const ExpenseCard = ({
  expense,
  onEdit,
  onLongPress,
  onSelect,
  selectionMode,
  selected,
  highlight,
}: Props) => {
  const { start, cancel, move, wasLongPress } = useLongPress({
    onLongPress: () => onLongPress?.(expense.id),
    delay: 400,
  });

  const handleClick = () => {
    if (wasLongPress()) return;
    if (selectionMode && onSelect) {
      onSelect(expense.id);
    } else {
      onEdit?.(expense);
    }
  };

  return (
    <li
      key={expense.id}
      data-testid={`expense-card-${expense.id}`}
      className={`relative cursor-pointer p-3 rounded-lg border overflow-hidden
        shadow-md hover:bg-blue-50 transition-shadow duration-300 select-none
        ${selected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
      onMouseDown={start}
      onTouchStart={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onTouchEnd={cancel}
      onTouchMove={move}
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
      <div className="relative z-10 space-y-2">

        <InfoRow
          // icon={TagIcon}
          text={expense.title}
          className="font-bold text-sm"
        />

        <div className="hidden sm:block space-y-2">
          <InfoRow icon={RectangleStackIcon} text={expense.category.name} />
          <InfoRow icon={MapPinIcon} text={expense.location.name} />
        </div>

        <div className="flex justify-between text-xs text-gray-800 mt-1">
          <InfoRow
            icon={CurrencyDollarIcon}
            text={expense.price}
            className="flex items-center gap-1 font-medium"
          />
          <InfoRow
            icon={CalendarDateRangeIcon}
            text={new Date(expense.datetime).toLocaleString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            className="flex items-center gap-1 font-medium"
          />
        </div>
      </div>
    </li>
  );
};
 
