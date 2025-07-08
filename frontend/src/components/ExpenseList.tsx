// components/ExpenseList
import { type Expense } from "../api";
// import { useRef } from "react";
import { ExpenseCard } from "./ExpenseCard";

type Props = {
  expenses: Expense[];
  onEdit?: (e: Expense) => void;
  onLongPress?: (id: number) => void;
  onSelect?: (id: number) => void;
  selectionMode?: boolean;
  selectedIds?: number[];
};

export const ExpenseList = ({
  expenses,
  onEdit,
  onLongPress,
  onSelect,
  selectionMode = false,
  selectedIds = [],
}: Props) => {
  return (
    <ul className="space-y-2">
      {expenses.map((e) => (
        <ExpenseCard
          key={e.id}
          expense={e}
          onEdit={onEdit}
          onLongPress={onLongPress}
          onSelect={onSelect}
          selectionMode={selectionMode}
          selected={selectedIds.includes(e.id)}
      />))}
    </ul>

  );
};
