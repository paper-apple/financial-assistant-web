// // components/ExpenseCard
// import { useRef } from "react";
// import type { Expense } from "../types";
// import { 
//   CalendarDateRangeIcon, 
//   CircleStackIcon,
//   RectangleStackIcon,
//   MapPinIcon,
//   TagIcon 
// } from '@heroicons/react/24/solid';

// export const ExpenseCard = ({
//   expense,
//   onEdit,
//   onLongPress,
//   onSelect,
//   selectionMode,
//   selected,
//   highlight,
// }: {
//   expense: Expense;
//   onEdit?: (e: Expense) => void;
//   onLongPress?: (id: number) => void;
//   onSelect?: (id: number) => void;
//   selectionMode: boolean;
//   selected: boolean;
//   highlight?: boolean;
// }) => {
//   const timerRef = useRef<number | null>(null);
//   const movedRef = useRef(false);

//   // Флаг, что longPress был совершен
//   const longPressTriggered = useRef(false);

//   const startPress = () => {
//     if (!onLongPress) return;
//     movedRef.current = false;
//     longPressTriggered.current = false;  // сброс перед новым прессом
//     timerRef.current = window.setTimeout(() => {
//       if (!movedRef.current) {
//         onLongPress(expense.id);
//         longPressTriggered.current = true;
//       }
//     }, 400);
//   };

//   const cancelPress = () => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//       timerRef.current = null;
//     }
//   };

//   const handleClick = () => {
//     // Если только что отработал longPress — игнорируем этот «клик»
//     if (longPressTriggered.current) {
//       longPressTriggered.current = false;
//       return;
//     }
    
//     if (selectionMode && onSelect) {
//       onSelect(expense.id);
//     } else {
//       onEdit?.(expense);
//     }
//   };

//   const handleTouchMove = () => {
//     movedRef.current = true;
//     cancelPress();
//   };

//   return (
//     <li
//       key={expense.id}
//       data-testid={`expense-card-${expense.id}`}
//       className={`relative cursor-pointer p-4 rounded-lg border overflow-hidden
//       shadow-md hover:shadow-lg transition-shadow duration-300 select-none
//       ${selected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
//       onMouseDown={startPress}
//       onTouchStart={startPress}
//       onMouseUp={cancelPress}
//       onMouseLeave={cancelPress}
//       onTouchEnd={cancelPress}
//       onTouchMove={handleTouchMove}
//       onClick={handleClick}
      
//     >
//       {/* Подсветка обновления */}
//       <div
//         data-testid={`highlight-${expense.id}`}
//         className={`absolute inset-0 rounded bg-green-100 pointer-events-none
//           transition-opacity duration-700
//           ${highlight ? "opacity-100" : "opacity-0"}`}
//       />

//         {/* Контент */}
//         <div className="relative z-10 space-y-2">
//           {selectionMode && selected && (
//             <span className="absolute top-1 right-1 text-blue-600">✔️</span>
//           )}
//           <div className="font-semibold text-sm flex items-center gap-1" data-testid="expense-title">
//             <TagIcon className="w-4 h-4 text-gray-500" />
//             {expense.title}
//           </div>
//           <div className="hidden sm:block space-y-2">
//             <div className="text-sm flex items-center gap-1" data-testid="expense-category">
//               <RectangleStackIcon className="w-4 h-4 text-gray-500" />
//               {expense.category.name}
//             </div>
//             <div className="text-sm flex items-center gap-1" data-testid="expense-location">
//               <MapPinIcon className="w-4 h-4 text-gray-500" />
//               {expense.location.name}
//             </div>
//           </div>
//           <div className="flex justify-between text-xs text-gray-800 mt-1" data-testid="expense-price">
//             {/* <span className="font-medium"> */}
//             <span className="flex items-center gap-1 font-medium">
//               <CircleStackIcon className="w-4 h-4 text-gray-500" />
//               {expense.price}
//             </span>
//             <span className="flex items-center gap-1 font-medium">
//               <CalendarDateRangeIcon className="w-4 h-4 text-gray-500" />
//               {new Date(expense.datetime).toLocaleString("ru-RU", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit"
//               })}
//             </span>
//           </div>
//         </div>
//     </li>
//   );
// };

import { useRef } from "react";
import type { Expense } from "../types";
import {
  CalendarDateRangeIcon,
  CircleStackIcon,
  RectangleStackIcon,
  MapPinIcon,
  TagIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/solid";
import { useLongPress } from "../hooks/useLongPress";

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
  // const timerRef = useRef<number | null>(null);
  // const movedRef = useRef(false);
  // const longPressTriggered = useRef(false);

  // const startPress = () => {
  //   if (!onLongPress) return;
  //   movedRef.current = false;
  //   longPressTriggered.current = false;
  //   timerRef.current = window.setTimeout(() => {
  //     if (!movedRef.current) {
  //       onLongPress(expense.id);
  //       longPressTriggered.current = true;
  //     }
  //   }, 400);
  // };

  // const cancelPress = () => {
  //   if (timerRef.current) {
  //     clearTimeout(timerRef.current);
  //     timerRef.current = null;
  //   }
  // };

  // const handleClick = () => {
  //   if (longPressTriggered.current) {
  //     longPressTriggered.current = false;
  //     return;
  //   }
  //   if (selectionMode && onSelect) {
  //     onSelect(expense.id);
  //   } else {
  //     onEdit?.(expense);
  //   }
  // };

  // const handleTouchMove = () => {
  //   movedRef.current = true;
  //   cancelPress();
  // };

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
      className={`relative cursor-pointer p-4 rounded-lg border overflow-hidden
        shadow-md hover:shadow-lg transition-shadow duration-300 select-none
        ${selected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
      // onMouseDown={startPress}
      // onTouchStart={startPress}
      // onMouseUp={cancelPress}
      // onMouseLeave={cancelPress}
      // onTouchEnd={cancelPress}
      // onTouchMove={handleTouchMove}
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
 
