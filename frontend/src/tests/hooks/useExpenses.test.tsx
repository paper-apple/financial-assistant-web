// useExpenses.test.ts
import { type Mock, describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpenses } from "../../hooks/useExpenses";
import { fetchExpenses, deleteExpense } from "../../api";
import type { Expense } from "../../types";
import { makeCategory, makeLocation } from "../createCategoryAndLocationFields";

vi.mock("../../api", () => ({
  fetchExpenses: vi.fn(),
  deleteExpense: vi.fn(),
}));

const mockData: Expense[] = [{ 
    id: 1, 
    title: "Хлеб", 
    category: makeCategory(1, "Еда"), 
    price: 3,
    location: makeLocation(1, "Магазин"),
    datetime: "2025-08-18T10:00:00.000Z" 
  },
  { 
    id: 2,
    title: "Такси",
    category: makeCategory(1, "Транспорт"), 
    price: 10,
    location: makeLocation(1, "Город"),
    datetime: "2025-08-18T12:00:00.000Z" 
  },
];

describe("useExpenses", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("загрузка расходов при монтировании", async () => {
    (fetchExpenses as Mock).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useExpenses());

    await act(async () => {});

    expect(fetchExpenses).toHaveBeenCalledTimes(1);
    expect(result.current.expenses).toEqual(mockData);
  });

  it("loadExpenses обновляет список вручную", async () => {
    (fetchExpenses as Mock).mockResolvedValue({ data: mockData });
    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      await result.current.loadExpenses();
    });

    expect(fetchExpenses).toHaveBeenCalledTimes(2);
    expect(result.current.expenses).toEqual(mockData);
  });

  it("updateExpense заменяет элемент и устанавливает lastUpdatedId", () => {
    const { result } = renderHook(() => useExpenses());

    const updated: Expense = { 
      id: 1, 
      title: "Хлебцы", 
      category: makeCategory(1, "Еда"), 
      price: 5, 
      location: makeLocation(1, "Магазин"), 
      datetime: "2025-08-18T10:00:00.000Z" 
    };

    act(() => {
      result.current.addExpense(mockData[0]);
      result.current.addExpense(mockData[1]);
    });

    act(() => {
      result.current.updateExpense(updated);
    });

    expect(result.current.expenses.find(e => e.id === 1)).toEqual(updated);
    expect(result.current.lastUpdatedId).toBe(1);
  });

  it("lastUpdatedId автоматически сбрасывается через 2 секунды", () => {
    const { result } = renderHook(() => useExpenses());

    act(() => {
      result.current.addExpense(mockData[0]);
      result.current.updateExpense({ ...mockData[0], title: "Обновлено" });
    });

    expect(result.current.lastUpdatedId).toBe(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.lastUpdatedId).toBeNull();
  });

  it("addExpense добавляет новый элемент", () => {
    const { result } = renderHook(() => useExpenses());

    act(() => {
      result.current.addExpense(mockData[0]);
    });

    expect(result.current.expenses).toContainEqual(mockData[0]);
  });

  it("removeExpenses вызывает deleteExpense для каждого id и потом перезагружает данные", async () => {
    (fetchExpenses as Mock).mockResolvedValue({ data: mockData });
    (deleteExpense as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      await result.current.removeExpenses([1, 2]);
    });

    expect(deleteExpense).toHaveBeenCalledTimes(2);
    expect(deleteExpense).toHaveBeenCalledWith(1);
    expect(deleteExpense).toHaveBeenCalledWith(2);
    expect(fetchExpenses).toHaveBeenCalled();
  });
});
