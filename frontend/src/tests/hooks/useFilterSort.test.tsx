// useFilterSort.test.tsx
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFilterSort } from "../../hooks/useFilterSort";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../hooks/useKeywordSuggestions", () => ({
  useKeywordSuggestions: () => ({
    suggestions: ["mock1", "mock2"],
    clearSuggestions: vi.fn(),
  }),
}));

describe("useFilterSort", () => {
  const loadExpenses = vi.fn();

  beforeEach(() => {
    loadExpenses.mockClear();
  });

  it("инициализируется с дефолтными значениями", () => {
    const { result } = renderHook(() => useFilterSort(loadExpenses));

    expect(result.current.filtersState.keywordInput).toBe("");
    expect(result.current.filtersState.keywordsList).toEqual([]);
    expect(result.current.filtersState.startDate).toBeNull();
    expect(result.current.filtersState.endDate).toBeNull();
    expect(result.current.filtersState.minPrice).toBe("");
    expect(result.current.filtersState.maxPrice).toBe("");
    expect(result.current.sortState.sortField).toBe("datetime");
    expect(result.current.sortState.sortDirection).toBe("DESC");
  });

  it("handleAddKeyword добавляет новое слово и очищает input", () => {
    const { result } = renderHook(() => useFilterSort(loadExpenses));

    act(() => {
      result.current.filtersState.setKeywordInput("Еда");
      result.current.handleAddKeyword("Еда");
    });

    expect(result.current.filtersState.keywordsList).toContain("Еда");
    expect(result.current.filtersState.keywordInput).toBe("");
  });

  it("backup и restoreInitialValues сохраняют и восстанавливают состояние", async () => {
    const { result } = renderHook(() => useFilterSort(loadExpenses));

    act(() => {
      result.current.filtersState.setMinPrice("10");
      result.current.filtersState.setMaxPrice("20");
    });

    act(() => {
      result.current.filtersState.backup();
    });

    act(() => {
      result.current.filtersState.setMinPrice("100");
      result.current.filtersState.setMaxPrice("200");
    });

    act(() => {
      result.current.filtersState.restoreInitialValues();
    });

    await waitFor(() => {
      expect(result.current.filtersState.minPrice).toBe("10");
      expect(result.current.filtersState.maxPrice).toBe("20");
    });
  });


  it("handleResetFilters сбрасывает все значения", () => {
    const { result } = renderHook(() => useFilterSort(loadExpenses));

    act(() => {
      result.current.filtersState.setKeywordInput("abc");
      result.current.filtersState.setKeywordsList(["a", "b"]);
      result.current.filtersState.setStartDate(new Date());
      result.current.filtersState.setEndDate(new Date());
      result.current.filtersState.setMinPrice("10");
      result.current.filtersState.setMaxPrice("20");
      result.current.filtersState.handleResetFilters();
    });

    expect(result.current.filtersState.keywordInput).toBe("");
    expect(result.current.filtersState.keywordsList).toEqual([]);
    expect(result.current.filtersState.startDate).toBeNull();
    expect(result.current.filtersState.endDate).toBeNull();
    expect(result.current.filtersState.minPrice).toBe("");
    expect(result.current.filtersState.maxPrice).toBe("");
  });

  it("applyFilters вызывает loadExpenses с текущими фильтрами и сортировкой", async () => {
    const { result } = renderHook(() => useFilterSort(loadExpenses));

    act(() => {
      result.current.filtersState.setMinPrice("5");
      result.current.filtersState.setMaxPrice("15");
      result.current.sortState.setSortField("price" as any);
      result.current.sortState.setSortDirection("ASC");
    });

    await waitFor(() => {
      expect(result.current.filtersState.minPrice).toBe("5");
      expect(result.current.filtersState.maxPrice).toBe("15");
      expect(result.current.sortState.sortField).toBe("price");
      expect(result.current.sortState.sortDirection).toBe("ASC");
    });

    act(() => {
      result.current.applyFilters();
    });

    expect(loadExpenses).toHaveBeenCalledWith(
      expect.objectContaining({ minPrice: 5, maxPrice: 15 }),
      { field: "price", direction: "ASC" }
    );
  });

  it("валидирует цену: min > max → priceError = true", () => {
    const { result } = renderHook(() => useFilterSort(loadExpenses));

    act(() => {
      result.current.filtersState.setMinPrice("20");
      result.current.filtersState.setMaxPrice("10");
    });

    expect(result.current.filtersState.priceError).toBe(true);
  });

  it("валидирует даты: startDate > endDate → dateError = true", () => {
    const { result } = renderHook(() => useFilterSort(loadExpenses));

    act(() => {
      result.current.filtersState.setStartDate(new Date("2025-02-01"));
      result.current.filtersState.setEndDate(new Date("2025-01-01"));
    });

    expect(result.current.filtersState.dateError).toBe(true);
  });
});
