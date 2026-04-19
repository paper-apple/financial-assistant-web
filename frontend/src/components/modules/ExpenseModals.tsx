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
  Modals,
  GroupField,
  StatsState
} from "../../types";
import { SettingsModal } from "./SettingsModal";

type Props = {
  modals: Modals;
  editingExpense: Expense | null;
  sortedExpenses: Expense[];
  form: FormState;
  filtersState: FiltersState;
  sortState: SortState;
  statsState: StatsState;
  suggestions: string[];
  applyFilters: () => void;
  applySorts: () => void;
  closeModal: (modal: keyof Modals) => void;
  openModal: (modal: keyof Modals) => void;
  handleCreated: (expense: Expense) => void;
  handleLogout: () => void;
  handleUpdated: (expense: Expense) => void;
  handleAddKeyword: (word: string) => void;
  updateFormField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  isModalOpen: boolean;
  isCalendarOpen: boolean;
  handleCloseModal: () => void;
  handleCloseCalendar: () => void;
};
  
export const ExpenseModals = ({
  modals,
  suggestions,
  form,
  editingExpense,
  filtersState,
  sortState,
  statsState,
  sortedExpenses,
  closeModal,
  openModal,
  handleCreated,
  handleLogout,
  handleUpdated,
  applyFilters,
  applySorts,
  handleAddKeyword,
  updateFormField,
  isModalOpen,
  isCalendarOpen,
  handleCloseModal,
  handleCloseCalendar,
}: Props) => (
  <>
    {modals.add && (
      <Modal onRemoveModal={() => closeModal("add")} title="expense_adding" isModalOpen={isModalOpen} onModalClose={handleCloseModal}>
        <ExpenseForm 
          form={form} 
          onCreated={handleCreated} 
          updateField={updateFormField}
          onModalOpen={openModal}
          onModalClose={handleCloseModal}
        />
      </Modal>
    )}

    {modals.update && editingExpense && (
      <Modal onRemoveModal={() => closeModal("update")} title="expense_editing" isModalOpen={isModalOpen} onModalClose={handleCloseModal}>
        <ExpenseForm 
          form={form}
          initialData={editingExpense}
          onCreated={handleCreated} 
          onUpdated={handleUpdated} 
          updateField={updateFormField}
          onModalOpen={openModal}
          onModalClose={handleCloseModal}
          />
      </Modal>
    )}

    {modals.filters && (
      <Modal onRemoveModal={() => closeModal("filters")} title="filters" isModalOpen={isModalOpen} onModalClose={handleCloseModal}>
        <FilterForm 
          suggestions={suggestions}
          filtersState={filtersState}
          handleAddKeyword={handleAddKeyword}
          applyFilters={applyFilters} 
          onModalOpen={openModal}
          onModalClose={handleCloseModal}
        />
      </Modal>
    )}

    {modals.calendar && form &&(
      <Modal onRemoveModal={() => closeModal("calendar")} isModalOpen={isCalendarOpen} calendar onModalClose={handleCloseCalendar}>
        <CalendarModal 
          value={form.datetime ? new Date(form.datetime) : null}          
          onSave={(date) => updateFormField("datetime", date.toISOString())}          
          onClose={handleCloseCalendar}
          />
      </Modal>
    )}

    {modals.startDate && (
      <Modal onRemoveModal={() => closeModal("startDate")} isModalOpen={isCalendarOpen} calendar onModalClose={handleCloseCalendar}>
        <CalendarModal 
          value={filtersState.startDate} 
          onSave={(date) => filtersState.setStartDate(date)}          
          onClose={handleCloseCalendar}
          />
      </Modal>
    )}

    {modals.endDate &&(
      <Modal onRemoveModal={() => closeModal("endDate")} isModalOpen={isCalendarOpen} calendar onModalClose={handleCloseCalendar}>
        <CalendarModal 
          value={filtersState.endDate}
          onSave={(date) => filtersState.setEndDate(date)}          
          onClose={handleCloseCalendar}
          />
      </Modal>
    )}

    {modals.sort && (
      <Modal onRemoveModal={() => closeModal("sort")} title="sort" isModalOpen={isModalOpen} onModalClose={handleCloseModal}>
        <SortForm 
          sortState={sortState}
          applySorts={applySorts} 
          onClose={handleCloseModal}
        />
      </Modal>
    )}

    {modals.stats && (
      <Modal onRemoveModal={() => closeModal("stats")} title="stats" isModalOpen={isModalOpen} onModalClose={handleCloseModal}>
        <StatsModal 
          expenses={sortedExpenses}
          statsState={statsState}
          // statsField={statsField}
          onClose={handleCloseModal} 
          // applyStatsField={applyStatsField}
        />
      </Modal>
    )}

    {modals.settings && (
      <Modal onRemoveModal={() => closeModal("settings")} title="settings" isModalOpen={isModalOpen} onModalClose={handleCloseModal}>
        <SettingsModal 
          onClose={handleCloseModal}
          logout={handleLogout}
        />
      </Modal>
    )}
  </>
);