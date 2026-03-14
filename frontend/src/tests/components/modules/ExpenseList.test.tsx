// ExpenseList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExpenseList } from "../../../components/modules/ExpenseList";
import type { Expense } from "../../../types";

const sampleExpense: Expense = {
  id: 1,
  title: "Кофе",
  category: { id: 1, name: "Еда" },
  price: 150,
  location: { id: 1, name: "Минск" },
  datetime: "2025-01-01T10:00:00Z",
};

describe("ExpenseList", () => {
  it("отображение сообщения, если список пуст", () => {
    render(<ExpenseList expenses={[]} lastUpdatedId={null} />);
    expect(screen.getByText("Записей нет")).toBeInTheDocument();
  });

  it("рендер карточки расходов", () => {
    render(<ExpenseList expenses={[sampleExpense]} lastUpdatedId={null} />);
    expect(screen.getByTestId("expense-card-1")).toBeInTheDocument();
    expect(screen.getByText("Кофе")).toBeInTheDocument();
    expect(screen.getByText("Еда")).toBeInTheDocument();
    expect(screen.getByText("Минск")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("подсветка выбранного элемента", () => {
    render(
      <ExpenseList
        expenses={[sampleExpense]}
        selectedIds={[1]}
        selectionMode
        lastUpdatedId={null}
      />
    );
    const card = screen.getByTestId("expense-card-1");
    expect(card).toHaveClass("bg-blue-50");
  });

  it("подсветка последнего обновлённого элемента", () => {
    render(
      <ExpenseList
        expenses={[sampleExpense]}
        lastUpdatedId={1}
      />
    );
    const highlight = screen.getByTestId("highlight-1");
    expect(highlight).toHaveClass("opacity-100");
  });

  it("вызов onEdit при клике, если selectionMode=false", () => {
    const onEdit = vi.fn();
    render(
      <ExpenseList
        expenses={[sampleExpense]}
        onEdit={onEdit}
        lastUpdatedId={null}
      />
    );
    fireEvent.click(screen.getByTestId("expense-card-1"));
    expect(onEdit).toHaveBeenCalledWith(sampleExpense);
  });

  it("вызов onSelect при клике, если selectionMode=true", () => {
    const onSelect = vi.fn();
    render(
      <ExpenseList
        expenses={[sampleExpense]}
        onSelect={onSelect}
        selectionMode
        lastUpdatedId={null}
      />
    );
    fireEvent.click(screen.getByTestId("expense-card-1"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});