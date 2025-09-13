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
  FiltersState,
  SortParams,
  FormState,
  SortState
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
  sortedExpenses: Expense[];
  form: FormState;
  filtersState: FiltersState;
  sortState: SortState;
  suggestions: string[];
  handleReset: () => void;
  applyFilters: () => void;
  applySorts: () => void;
  closeModal: (modal: keyof Props["modals"]) => void;
  openModal: (modal: keyof Props["modals"]) => void;
  handleCreated: (expense: Expense) => void;
  handleUpdated: (expense: Expense) => void;
  handleAddKeyword: (word: string) => void;
  updateFormField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;};

export const ExpenseModals = ({
  modals,
  suggestions,
  form,
  editingExpense,
  filtersState,
  sortState,
  handleReset,
  sortedExpenses,
  closeModal,
  openModal,
  handleCreated,
  handleUpdated,
  applyFilters,
  applySorts,
  handleAddKeyword,
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
          suggestions={suggestions}
          filtersState={filtersState}
          handleAddKeyword={handleAddKeyword}
          applyFilters={applyFilters} 
          handleReset={handleReset}
          onClose={() => closeModal("filters")}
        />
      </Modal>
    )}

    {modals.sort && (
      <Modal onClose={() => closeModal("sort")} title="Сортировка">
        <SortForm 
          // initialValues={sortParams} 
          sortState={sortState}
          applySorts={applySorts} 
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