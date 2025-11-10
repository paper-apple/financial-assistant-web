// groupExpenses.test.ts
import { describe, it, expect } from "vitest";
import type { Expense } from "../../types";
import { groupExpenses } from "../../utils/groupExpenses";
import { makeCategory, makeLocation } from "../createCategoryAndLocationFields"

const makeExpense = (overrides: Partial<Expense>): Expense => ({
  id: Math.random(),
  title: "Default",
  category: makeCategory(1, "Default"),
  location: makeLocation(1, "Default"),
  price: 10,
  datetime: new Date().toISOString(),
  ...overrides,
});

describe("groupExpenses", () => {
  it("группирует по category.name", () => {
    const expenses: Expense[] = [
      makeExpense({ category: makeCategory(1, "Еда"), price: 100 }),
      makeExpense({ category: makeCategory(2, "Еда"), price: 50 }),
      makeExpense({ category: makeCategory(3, "Транспорт"), price: 20 }),
    ];

    const result = groupExpenses(expenses, "category");

    expect(result).toEqual([
      { key: "Еда", count: 2, total: 150 },
      { key: "Транспорт", count: 1, total: 20 },
    ]);
  });

  it("группирует по location.name", () => {
    const expenses: Expense[] = [
      makeExpense({ location: makeLocation(1, "Кафе"), price: 30 }),
      makeExpense({ location: makeLocation(2, "Кафе"), price: 20 }),
      makeExpense({ location: makeLocation(3, "Банк"), price: 10 }),
    ];

    const result = groupExpenses(expenses, "location");

    expect(result).toEqual([
      { key: "Кафе", count: 2, total: 50 },
      { key: "Банк", count: 1, total: 10 },
    ]);
  });

  it("группирует по title", () => {
    const expenses: Expense[] = [
      makeExpense({ title: "Хлеб", price: 5 }),
      makeExpense({ title: "Хлеб", price: 7 }),
      makeExpense({ title: "Молоко", price: 10 }),
    ];

    const result = groupExpenses(expenses, "title");

    expect(result).toEqual([
      { key: "Хлеб", count: 2, total: 12 },
      { key: "Молоко", count: 1, total: 10 },
    ]);
  });

  it("заменяет пустое значение на '—'", () => {
    const expenses: Expense[] = [
      makeExpense({ title: "" }),
      makeExpense({ title: "   " }),
    ];

    const result = groupExpenses(expenses, "title");
    expect(result).toEqual([{ key: "—", count: 2, total: 20 }]);
  });

  it("игнорирует нечисловые цены", () => {
    const expenses: Expense[] = [
      makeExpense({ price: NaN }),
      makeExpense({ price: Infinity }),
    ];

    const result = groupExpenses(expenses, "title");
    expect(result).toEqual([{ key: "Default", count: 2, total: 0 }]);
  });

  it("округляет сумму до двух знаков", () => {
    const expenses: Expense[] = [
      makeExpense({ title: "Тест", price: 10.123 }),
      makeExpense({ title: "Тест", price: 0.005 }),
    ];

    const result = groupExpenses(expenses, "title");
    expect(result[0].total).toBe(10.13);
  });

  it("сортирует по total, затем по count, затем по key", () => {
    const expenses: Expense[] = [
      makeExpense({ category: makeCategory(1, "B"), price: 50 }),
      makeExpense({ category: makeCategory(2, "A"), price: 100 }),
      makeExpense({ category: makeCategory(3, "C"), price: 100 }),
    ];

    const result = groupExpenses(expenses, "category");

    expect(result.map(r => r.key)).toEqual(["A", "C", "B"]);
  });
});