// components/ExpenseModals.tsx
import { Modal } from "./Modal";
import { ExpenseForm } from "./ExpenseForm";
import { FilterForm } from "./FilterForm";
import { SortForm } from "./SortForm";
import { StatsModal } from "./StatsModal";
import { CalendarModal } from "./CalendarModal";
import type { 
  Expense, 
  FiltersState,
  FormState,
  SortState,
  Modals
} from "../types";

type Props = {
  modals: Modals;
  editingExpense: Expense | null;
  sortedExpenses: Expense[];
  form: FormState;
  filtersState: FiltersState;
  sortState: SortState;
  suggestions: string[];
  // handleReset: () => void;
  applyFilters: () => void;
  applySorts: () => void;
  closeModal: (modal: keyof Modals) => void;
  openModal: (modal: keyof Modals) => void;
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
  // handleReset,
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
      <Modal onModalClose={() => closeModal("add")} title="Добавить расход">
        <ExpenseForm 
          form={form} 
          onCreated={handleCreated} 
          updateField={updateFormField}
          onCalendaropen={() => openModal("calendar")}
          onModalClose={() => closeModal("add")}
          />
      </Modal>
    )}

    {modals.update && editingExpense && (
      <Modal onModalClose={() => closeModal("update")} title="Редактировать расход">
        <ExpenseForm 
          form={form}
          initialData={editingExpense}
          onUpdated={handleUpdated} 
          updateField={updateFormField}
          onCalendaropen={() => openModal("calendar")}
          onModalClose={() => closeModal("update")}
          />
      </Modal>
    )}

    {modals.filters && (
      <Modal onModalClose={() => closeModal("filters")} title="Фильтры">
        <FilterForm 
          suggestions={suggestions}
          filtersState={filtersState}
          handleAddKeyword={handleAddKeyword}
          applyFilters={applyFilters} 
          // handleReset={handleReset}
          onModalOpen={openModal}
          onModalClose={() => closeModal("filters")}
        />
      </Modal>
    )}

    {modals.calendar && form &&(
      <Modal onModalClose={() => closeModal("calendar")}>
        <CalendarModal 
          value={form.datetime ? new Date(form.datetime) : null}          
          onSave={(date) => updateFormField("datetime", date.toISOString())}          
          onClose={() => closeModal("calendar")}
          />
      </Modal>
    )}

    {modals.startDate && (
      <Modal onModalClose={() => closeModal("startDate")}>
        <CalendarModal 
          value={filtersState.startDate} 
          onSave={(date) => filtersState.setStartDate(date)}          
          onClose={() => closeModal("startDate")}
          />
      </Modal>
    )}

    {modals.endDate && form &&(
      <Modal onModalClose={() => closeModal("endDate")}>
        <CalendarModal 
          value={filtersState.endDate}
          onSave={(date) => filtersState.setEndDate(date)}          
          onClose={() => closeModal("endDate")}
          />
      </Modal>
    )}


    {modals.sort && (
      <Modal onModalClose={() => closeModal("sort")} title="Сортировка">
        <SortForm 
          // initialValues={sortParams} 
          sortState={sortState}
          applySorts={applySorts} 
          onClose={() => closeModal("sort")}
        />
      </Modal>
    )}

    {modals.stats && (
      <Modal onModalClose={() => closeModal("stats")} title="Статистика">
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