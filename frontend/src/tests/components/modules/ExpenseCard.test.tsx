// ExpenseCard.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExpenseCard } from "../../../components/modules/ExpenseCard";
import { type Expense } from "../../../types"
import { makeCategory, makeLocation } from "../../createCategoryAndLocationFields";

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  const base = {
    id: 1,
    title: "Фисташки",
    category: makeCategory(1, "Продукты"),
    location: makeLocation(1, "Магазин у дома"),
    price: 12.34,
    datetime: "2024-01-02T10:30:00",
  };
  return { ...base, ...overrides };
}

function getItem() {
  const li = screen.getByText("Фисташки").closest("li");
  if (!li) throw new Error("ExpenseCard list item not found");
  return li;
}

describe("ExpenseCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("рендер контента (title, category, location, price, date)", () => {
    const expense = makeExpense();
    render(
      <ul>
        <ExpenseCard
          expense={expense}
          selectionMode={false}
          selected={false}
        />
      </ul>
    );

    expect(screen.getByText("Фисташки")).toBeInTheDocument();
    expect(screen.getByText("Продукты")).toBeInTheDocument();
    expect(screen.getByText("Магазин у дома")).toBeInTheDocument();
    expect(screen.getByText("12.34")).toBeInTheDocument();

    const expectedDate = new Date(expense.datetime).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(',', '');
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it("вызов onEdit по клику, когда selectionMode=false", () => {
    const expense = makeExpense();
    const onEdit = vi.fn();

    render(
      <ul>
        <ExpenseCard
          expense={expense}
          onEdit={onEdit}
          selectionMode={false}
          selected={false}
        />
      </ul>
    );

    fireEvent.click(getItem());
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  it("вызов onSelect(id) по клику, когда selectionMode=true", () => {
    const expense = makeExpense();
    const onSelect = vi.fn();
    const onEdit = vi.fn();

    render(
      <ul>
        <ExpenseCard
          expense={expense}
          onSelect={onSelect}
          onEdit={onEdit}
          selectionMode={true}
          selected={false}
        />
      </ul>
    );

    fireEvent.click(getItem());
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("вызов onLongPress(id) и подавление последующего click", () => {
    const expense = makeExpense();
    const onLongPress = vi.fn();
    const onSelect = vi.fn();
    const onEdit = vi.fn();

    render(
      <ul>
        <ExpenseCard
          expense={expense}
          onLongPress={onLongPress}
          onSelect={onSelect}
          onEdit={onEdit}
          selectionMode={true}
          selected={false}
        />
      </ul>
    );

    const item = getItem();
    fireEvent.mouseDown(item);
    vi.advanceTimersByTime(401);
    fireEvent.mouseUp(item);

    fireEvent.click(item);

    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(onLongPress).toHaveBeenCalledWith(1);

    expect(onSelect).not.toHaveBeenCalled();
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("отмена лонг-пресс при помощи touchmove", () => {
    const expense = makeExpense();
    const onLongPress = vi.fn();

    render(
      <ul>
        <ExpenseCard
          expense={expense}
          onLongPress={onLongPress}
          selectionMode={false}
          selected={false}
        />
      </ul>
    );

    const item = getItem();
    fireEvent.touchStart(item);
    vi.advanceTimersByTime(200);
    fireEvent.touchMove(item);
    vi.advanceTimersByTime(500);
    fireEvent.touchEnd(item);

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it("отмена лонг-пресс при помощи mouseleave", () => {
    const expense = makeExpense();
    const onLongPress = vi.fn();

    render(
      <ul>
        <ExpenseCard
          expense={expense}
          onLongPress={onLongPress}
          selectionMode={false}
          selected={false}
        />
      </ul>
    );

    const item = getItem();
    fireEvent.mouseDown(item);
    vi.advanceTimersByTime(200);
    fireEvent.mouseLeave(item);
    vi.advanceTimersByTime(500);

    expect(onLongPress).not.toHaveBeenCalled();
  });
});