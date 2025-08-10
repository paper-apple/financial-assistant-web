import { type Expense } from "../types";
import { ExpenseCard } from "./ExpenseCard";

type Props = {
  expenses: Expense[];
  onEdit?: (e: Expense) => void;
  onLongPress?: (id: number) => void;
  onSelect?: (id: number) => void;
  selectionMode?: boolean;
  selectedIds?: number[];
  lastUpdatedId: number | null;
};

export const ExpenseList = ({
  expenses,
  onEdit,
  onLongPress,
  onSelect,
  selectionMode = false,
  selectedIds = [],
  lastUpdatedId,
}: Props) => {
  return (
    <ul className="space-y-2 w-full">
      {expenses.map((e) => (
        <ExpenseCard
          key={e.id}
          expense={e}
          onEdit={onEdit}
          onLongPress={onLongPress}
          onSelect={onSelect}
          selectionMode={selectionMode}
          selected={selectedIds.includes(e.id)}
          highlight={e.id === lastUpdatedId}
      />))}
    </ul>
  );
};
