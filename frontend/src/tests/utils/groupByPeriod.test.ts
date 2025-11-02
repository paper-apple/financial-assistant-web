// utils/groupByPeriod.test.ts
import { describe, it, expect } from "vitest"; // или jest
import { detectPeriod, groupByPeriod, type Period } from "../../utils/groupByPeriod";
import { format } from "date-fns";
import type { Expense } from "../../types";
import { makeCategory, makeLocation } from "../createCategoryAndLocationFields";

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
      { key: "01.01.2025", total: 30, count: 2 },
      { key: "02.01.2025", total: 5, count: 1 },
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
      { key: "01.2025", total: 30, count: 2 },
      { key: "02.2025", total: 5, count: 1 },
    ]);
  });

  it("заполняет пропущенные дни нулями", () => {
    const expenses = [
      { ...baseExpense, datetime: "2025-01-01", price: 10 },
      { ...baseExpense, datetime: "2025-01-03", price: 20 },
    ];

    const result = groupByPeriod(expenses, "day");

    expect(result).toEqual([
      { key: "01.01.2025", total: 10, count: 1 },
      { key: "02.01.2025", total: 0, count: 0 }, // 👈 пропущенный день
      { key: "03.01.2025", total: 20, count: 1 },
    ]);
  });
});
