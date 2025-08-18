// components/ExpenseModals.tsx
import { Modal } from "./Modal";
import { ExpenseForm } from "./ExpenseForm";
import { FilterForm } from "./FilterForm";
import { SortForm } from "./SortForm";
import { StatsModal } from "./StatsModal";
import { CalendarModal } from "./CalendarModal";
import type { 
  Expense, 
  FilterParams, 
  SortParams,
  FormState
} from "../types";

type Props = {
  modals: {
    add: boolean;
    update: boolean;
    filters: boolean;
    sort: boolean;
    stats: boolean;
    calendar: boolean;
  };
  editingExpense: Expense | null;
  form: FormState;
  filters: FilterParams;
  sortParams: SortParams;
  expenses: Expense[];
  onClose: (modal: keyof Props["modals"]) => void;
  onOpen: (modal: keyof Props["modals"]) => void;
  onCreated: (expense: Expense) => void;
  onUpdated: (expense: Expense) => void;
  onFiltersApply: (filters: FilterParams) => void;
  onSortApply: (sort: SortParams) => void;
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;};

export const ExpenseModals = ({
  modals,
  form,
  editingExpense,
  filters,
  sortParams,
  expenses,
  onClose,
  onOpen,
  onCreated,
  onUpdated,
  onFiltersApply,
  onSortApply,
  updateField
}: Props) => (
  <>
    {modals.add && (
      <Modal onClose={() => onClose("add")} title="Добавить расход">
        <ExpenseForm 
          form={form} 
          onCreated={onCreated} 
          updateField={updateField}
          onOpen={() => onOpen("calendar")}
          />
      </Modal>
    )}

    {modals.update && editingExpense && (
      <Modal onClose={() => onClose("update")} title="Редактировать расход">
        <ExpenseForm 
          form={form} 
          initialData={editingExpense} 
          onUpdated={onUpdated} 
          updateField={updateField}
          onOpen={() => onOpen("calendar")}
          />
      </Modal>
    )}

    {modals.calendar && form &&(
      <Modal onClose={() => onClose("calendar")} title="Календарь">
        <CalendarModal 
          currentExpense={form} 
          updateField={updateField}
          onClose={() => onClose("calendar")}
          />
      </Modal>
    )}
    
    {modals.filters && (
      <Modal onClose={() => onClose("filters")} title="Фильтры">
        <FilterForm 
          initialValues={filters} 
          onApply={onFiltersApply} 
          onClose={() => onClose("filters")}
        />
      </Modal>
    )}

    {modals.sort && (
      <Modal onClose={() => onClose("sort")} title="Сортировка">
        <SortForm 
          initialValues={sortParams} 
          onApply={onSortApply} 
          onClose={() => onClose("sort")}
        />
      </Modal>
    )}

    {modals.stats && (
      <Modal onClose={() => onClose("stats")} title="Статистика">
        <StatsModal 
          expenses={expenses} 
          initialField="category" 
          currency="BYN"
          onClose={() => onClose("stats")} 
        />
      </Modal>
    )}
  </>
);