// ExpenseModals.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FiltersState, FormState, Modals, SortState } from "../../../types";

// Мокаем дочерние компоненты
vi.mock("./Modal", () => ({
  Modal: ({ children, title }: any) => (
    <div>
      <div>{title}</div>
      {children}
    </div>
  ),
}));
vi.mock("./ExpenseForm", () => ({
  ExpenseForm: (props: any) => <div>ExpenseForm {props.initialData ? "update" : "add"}</div>,
}));
vi.mock("./FilterForm", () => ({
  FilterForm: () => <div>FilterForm</div>,
}));
vi.mock("./SortForm", () => ({
  SortForm: () => <div>SortForm</div>,
}));
vi.mock("./StatsModal", () => ({
  StatsModal: () => <div>StatsModal</div>,
}));
vi.mock("./CalendarModal", () => ({
  CalendarModal: () => <div data-testid="calendar-modal">CalendarModal</div>,
}));

const baseProps = {
  modals: {
    add: false,
    update: false,
    filters: false,
    sort: false,
    stats: false,
    calendar: false,
    startDate: false,
    endDate: false,
  } as Modals,
  editingExpense: null,
  sortedExpenses: [],
  form: { datetime: "" } as unknown as FormState,
  filtersState: {
    startDate: null,
    endDate: null,
    setStartDate: vi.fn(),
    setEndDate: vi.fn(),
  } as unknown as FiltersState,
  sortState: {} as SortState,
  suggestions: [],
  applyFilters: vi.fn(),
  applySorts: vi.fn(),
  closeModal: vi.fn(),
  openModal: vi.fn(),
  handleCreated: vi.fn(),
  handleUpdated: vi.fn(),
  handleAddKeyword: vi.fn(),
  updateFormField: vi.fn(),
};

import { ExpenseModals } from "../../../components/ExpenseModals";

describe("ExpenseModals", () => {
  it("рендерит форму добавления, если modals.add=true", () => {
    render(<ExpenseModals {...baseProps} modals={{ ...baseProps.modals, add: true }} />);
    expect(screen.getByText("Добавить расход")).toBeInTheDocument();
    expect(screen.getByText("ExpenseForm add")).toBeInTheDocument();
  });

  it("рендерит форму редактирования, если modals.update=true и есть editingExpense", () => {
    render(
      <ExpenseModals
        {...baseProps}
        modals={{ ...baseProps.modals, update: true }}
        editingExpense={{ id: 1, title: "Test", category: { id: 1, name: "Cat" }, price: 10, location: { id: 1, name: "Loc" }, datetime: "" }}
      />
    );
    expect(screen.getByText("Редактировать расход")).toBeInTheDocument();
    expect(screen.getByText("ExpenseForm update")).toBeInTheDocument();
  });

  it("рендерит FilterForm, если modals.filters=true", () => {
    render(<ExpenseModals {...baseProps} modals={{ ...baseProps.modals, filters: true }} />);
    expect(screen.getByText("Фильтры")).toBeInTheDocument();
    expect(screen.getByText("FilterForm")).toBeInTheDocument();
  });

  it("рендерит SortForm, если modals.sort=true", () => {
    render(<ExpenseModals {...baseProps} modals={{ ...baseProps.modals, sort: true }} />);
    expect(screen.getByText("Сортировка")).toBeInTheDocument();
    expect(screen.getByText("SortForm")).toBeInTheDocument();
  });

  it("рендерит StatsModal, если modals.stats=true", () => {
    render(<ExpenseModals {...baseProps} modals={{ ...baseProps.modals, stats: true }} />);
    expect(screen.getByText("Статистика")).toBeInTheDocument();
    expect(screen.getByText("StatsModal")).toBeInTheDocument();
  });

  it("рендерит CalendarModal для calendar/startDate/endDate", () => {
    render(<ExpenseModals {...baseProps} modals={{ ...baseProps.modals, calendar: true }} form={{ datetime: "" } as any} />);
    expect(screen.getByTestId("calendar-modal")).toBeInTheDocument();
    
    render(<ExpenseModals {...baseProps} modals={{ ...baseProps.modals, startDate: true }} />);
    expect(screen.getByText("CalendarModal")).toBeInTheDocument();

    render(<ExpenseModals {...baseProps} modals={{ ...baseProps.modals, endDate: true }} />);
    expect(screen.getByText("CalendarModal")).toBeInTheDocument();
  });
});
