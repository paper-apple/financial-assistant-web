// utils/groupByPeriod.test.ts
import { describe, it, expect } from "vitest"; // или jest
import { detectPeriod, groupByPeriod, type Period } from "../../utils/groupByPeriod";
import { format } from "date-fns";
import type { Expense } from "../../types";
import { makeCategory, makeLocation } from "../createCategoryAndLocationFields";

// type Expense = {
//   datetime: string;
//   price: number;
// };

// const makeExpense = (overrides: Partial<Expense[]>): Expense[] => ({
//   id: Math.random(),
//   title: "Default",
//   category: makeCategory(1, "Default"),
//   location: makeLocation(1, "Default"),
//   price: 10,
//   datetime: new Date().toISOString(),
//   ...overrides,
// });

export const baseExpense: Expense = {
  id: 1,
  title: "Test expense",
  category: { id: 1, name: "Food" },
  price: 100,
  location: { id: 1, name: "Minsk" },
  datetime: "2025-01-01T00:00:00Z",
};

describe("detectPeriod", () => {
  it("возвращает 'month' для пустого массива", () => {
    expect(detectPeriod([])).toBe("month");
  });

  it("возвращает 'day', если диапазон <= 3 месяцев", () => {
    const expenses = [
      { ...baseExpense, datetime: "2025-01-01", price: 10 },
      { ...baseExpense, datetime: "2025-03-15", price: 20 },
    ];
    expect(detectPeriod(expenses)).toBe("day");
  });

  it("возвращает 'month', если диапазон > 3 месяцев", () => {
    const expenses = [
      { ...baseExpense, datetime: "2025-01-01", price: 10 },
      { ...baseExpense, datetime: "2025-07-01", price: 20 },
    ];
    expect(detectPeriod(expenses)).toBe("month");
  });
});

describe("groupByPeriod", () => {
  it("возвращает пустой массив для пустого входа", () => {
    expect(groupByPeriod([], "day")).toEqual([]);
  });

  it("группирует по дням", () => {
    const expenses = [
      { ...baseExpense, id: 1, datetime: "2025-01-01T10:00:00Z", price: 10 },
      { ...baseExpense, id: 2, datetime: "2025-01-01T12:00:00Z", price: 20 },
      { ...baseExpense, id: 3, datetime: "2025-01-02T09:00:00Z", price: 5 },  
    ];

    const result = groupByPeriod(expenses, "day");

    expect(result).toEqual([
      { key: "2025-01-01", total: 30, count: 2 },
      { key: "2025-01-02", total: 5, count: 1 },
    ]);
  });

  it("группирует по месяцам", () => {
    const expenses = [
      { ...baseExpense, datetime: "2025-01-01", price: 10 },
      { ...baseExpense, datetime: "2025-01-15", price: 20 },
      { ...baseExpense, datetime: "2025-02-01", price: 5 },
    ];

    const result = groupByPeriod(expenses, "month");

    expect(result).toEqual([
      { key: "2025-01", total: 30, count: 2 },
      { key: "2025-02", total: 5, count: 1 },
    ]);
  });

  it("заполняет пропущенные дни нулями", () => {
    const expenses = [
      { ...baseExpense, datetime: "2025-01-01", price: 10 },
      { ...baseExpense, datetime: "2025-01-03", price: 20 },
    ];

    const result = groupByPeriod(expenses, "day");

    expect(result).toEqual([
      { key: "2025-01-01", total: 10, count: 1 },
      { key: "2025-01-02", total: 0, count: 0 }, // 👈 пропущенный день
      { key: "2025-01-03", total: 20, count: 1 },
    ]);
  });

  it("отсекает данные старше 12 месяцев", () => {
    const expenses = [
      { ...baseExpense, datetime: "2023-01-01", price: 100 }, // старше 12 мес
      { ...baseExpense, datetime: "2025-01-01", price: 50 },
    ];

    const result = groupByPeriod(expenses, "month");

    // Должен включать только 2025-01
    expect(result[0]).toEqual({ key: "2024-01", total: 0, count: 0 });
    expect(result[result.length - 1]).toEqual({ key: "2025-01", total: 50, count: 1 });
    expect(result).toHaveLength(13);
  });
});
