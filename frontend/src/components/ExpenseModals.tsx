// components/ExpenseModals.tsx
import { Modal } from "./Modal";
import { ExpenseForm } from "./ExpenseForm";
import { FilterForm } from "./FilterForm";
import { SortForm } from "./SortForm";
import { StatsModal } from "./StatsModal";
import type { 
  Expense, 
  FilterParams, 
  SortParams 
} from "../types";

type Props = {
  modals: {
    add: boolean;
    update: boolean;
    filters: boolean;
    sort: boolean;
    stats: boolean;
  };
  editingExpense: Expense | null;
  filters: FilterParams;
  sortParams: SortParams;
  expenses: Expense[];
  onClose: (modal: keyof Props["modals"]) => void;
  onCreated: (expense: Expense) => void;
  onUpdated: (expense: Expense) => void;
  onFiltersApply: (filters: FilterParams) => void;
  onSortApply: (sort: SortParams) => void;
};

export const ExpenseModals = ({
  modals,
  editingExpense,
  filters,
  sortParams,
  expenses,
  onClose,
  onCreated,
  onUpdated,
  onFiltersApply,
  onSortApply
}: Props) => (
  <>
    {modals.add && (
      <Modal onClose={() => onClose("add")} title="Добавить расход">
        <ExpenseForm onCreated={onCreated} />
      </Modal>
    )}

    {modals.update && editingExpense && (
      <Modal onClose={() => onClose("update")} title="Редактировать расход">
        <ExpenseForm initialData={editingExpense} onUpdated={onUpdated} />
      </Modal>
    )}

    {modals.filters && (
      <Modal onClose={() => onClose("filters")} title="Фильтры">
        <FilterForm 
          initialValues={filters} 
          onApply={onFiltersApply} 
        />
      </Modal>
    )}

    {modals.sort && (
      <Modal onClose={() => onClose("sort")} title="Сортировка">
        <SortForm 
          initialValues={sortParams} 
          onApply={onSortApply} 
        />
      </Modal>
    )}

    {modals.stats && (
      <Modal onClose={() => onClose("stats")} title="Статистика">
        <StatsModal 
          expenses={expenses} 
          initialField="category" 
          currency="BYN" 
        />
      </Modal>
    )}
  </>
);