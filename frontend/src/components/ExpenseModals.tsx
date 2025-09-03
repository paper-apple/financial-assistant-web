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
  sortedExpenses: Expense[];
  closeModal: (modal: keyof Props["modals"]) => void;
  openModal: (modal: keyof Props["modals"]) => void;
  handleCreated: (expense: Expense) => void;
  handleUpdated: (expense: Expense) => void;
  handleFilters: (filters: FilterParams) => void;
  handleSortApply: (sort: SortParams) => void;
  updateFormField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;};

export const ExpenseModals = ({
  modals,
  form,
  editingExpense,
  filters,
  sortParams,
  sortedExpenses,
  closeModal,
  openModal,
  handleCreated,
  handleUpdated,
  handleFilters,
  handleSortApply,
  updateFormField
}: Props) => (
  <>
    {modals.add && (
      <Modal onClose={() => closeModal("add")} title="Добавить расход">
        <ExpenseForm 
          form={form} 
          onCreated={handleCreated} 
          updateField={updateFormField}
          onOpen={() => openModal("calendar")}
          />
      </Modal>
    )}

    {modals.update && editingExpense && (
      <Modal onClose={() => closeModal("update")} title="Редактировать расход">
        <ExpenseForm 
          form={form}
          initialData={editingExpense}
          onUpdated={handleUpdated} 
          updateField={updateFormField}
          onOpen={() => openModal("calendar")}
          />
      </Modal>
    )}

    {modals.calendar && form &&(
      <Modal onClose={() => closeModal("calendar")} title="Календарь">
        <CalendarModal 
          currentExpense={form} 
          updateField={updateFormField}
          onClose={() => closeModal("calendar")}
          />
      </Modal>
    )}
    
    {modals.filters && (
      <Modal onClose={() => closeModal("filters")} title="Фильтры">
        <FilterForm 
          initialValues={filters} 
          onApply={handleFilters} 
          onClose={() => closeModal("filters")}
        />
      </Modal>
    )}

    {modals.sort && (
      <Modal onClose={() => closeModal("sort")} title="Сортировка">
        <SortForm 
          initialValues={sortParams} 
          onApply={handleSortApply} 
          onClose={() => closeModal("sort")}
        />
      </Modal>
    )}

    {modals.stats && (
      <Modal onClose={() => closeModal("stats")} title="Статистика">
        <StatsModal 
          expenses={sortedExpenses} 
          initialField="category" 
          currency="BYN"
          onClose={() => closeModal("stats")} 
        />
      </Modal>
    )}
  </>
);