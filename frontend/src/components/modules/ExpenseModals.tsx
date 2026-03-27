// ExpenseModals.tsx
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
} from "../../types";
import { SettingsModal } from "./SettingsModal";

type Props = {
  modals: Modals;
  editingExpense: Expense | null;
  sortedExpenses: Expense[];
  form: FormState;
  filtersState: FiltersState;
  sortState: SortState;
  suggestions: string[];
  applyFilters: () => void;
  applySorts: () => void;
  closeModal: (modal: keyof Modals) => void;
  openModal: (modal: keyof Modals) => void;
  handleCreated: (expense: Expense) => void;
  handleLogout: () => void;
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
  sortedExpenses,
  closeModal,
  openModal,
  handleCreated,
  handleLogout,
  handleUpdated,
  applyFilters,
  applySorts,
  handleAddKeyword,
  updateFormField
}: Props) => (
  <>
    {modals.add && (
      <Modal onModalClose={() => closeModal("add")} title="expense_adding">
        <ExpenseForm 
          form={form} 
          onCreated={handleCreated} 
          updateField={updateFormField}
          onModalOpen={openModal}
          onModalClose={() => closeModal("add")}
        />
      </Modal>
    )}

    {modals.update && editingExpense && (
      <Modal onModalClose={() => closeModal("update")} title="expense_editing">
        <ExpenseForm 
          form={form}
          initialData={editingExpense}
          onCreated={handleCreated} 
          onUpdated={handleUpdated} 
          updateField={updateFormField}
          onModalOpen={openModal}
          onModalClose={() => closeModal("update")}
          />
      </Modal>
    )}

    {modals.filters && (
      <Modal onModalClose={() => closeModal("filters")} title="filters">
        <FilterForm 
          suggestions={suggestions}
          filtersState={filtersState}
          handleAddKeyword={handleAddKeyword}
          applyFilters={applyFilters} 
          onModalOpen={openModal}
          onModalClose={() => closeModal("filters")}
        />
      </Modal>
    )}

    {modals.calendar && form &&(
      <Modal onModalClose={() => closeModal("calendar")} calendar>
        <CalendarModal 
          value={form.datetime ? new Date(form.datetime) : null}          
          onSave={(date) => updateFormField("datetime", date.toISOString())}          
          onClose={() => closeModal("calendar")}
          />
      </Modal>
    )}

    {modals.startDate && (
      <Modal onModalClose={() => closeModal("startDate")} calendar>
        <CalendarModal 
          value={filtersState.startDate} 
          onSave={(date) => filtersState.setStartDate(date)}          
          onClose={() => closeModal("startDate")}
          />
      </Modal>
    )}

    {modals.endDate &&(
      <Modal onModalClose={() => closeModal("endDate")} calendar>
        <CalendarModal 
          value={filtersState.endDate}
          onSave={(date) => filtersState.setEndDate(date)}          
          onClose={() => closeModal("endDate")}
          />
      </Modal>
    )}

    {modals.sort && (
      <Modal onModalClose={() => closeModal("sort")} title="sort">
        <SortForm 
          sortState={sortState}
          applySorts={applySorts} 
          onClose={() => closeModal("sort")}
        />
      </Modal>
    )}

    {modals.stats && (
      <Modal onModalClose={() => closeModal("stats")} title="stats">
        <StatsModal 
          expenses={sortedExpenses} 
          initialField="category" 
          onClose={() => closeModal("stats")} 
        />
      </Modal>
    )}

    {modals.settings && (
      <Modal onModalClose={() => closeModal("settings")} title="settings">
        <SettingsModal 
          onClose={() => closeModal("settings")}
          logout={handleLogout}
        />
      </Modal>
    )}
  </>
);