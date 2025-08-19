import { type Mock, describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilterSort } from "../../hooks/useFilterSort";
import type { Expense, FilterParams, SortParams } from "../../types";

const mockExpenses: Expense[] = [
  {
    id: 1,
    title: "Coffee",
    category: "Food",
    price: 3,
    location: "Cafe",
    datetime: "2024-05-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Book",
    category: "Education",
    price: 15,
    location: "Bookstore",
    datetime: "2024-04-25T09:00:00Z",
  },
  {
    id: 3,
    title: "Tea",
    category: "Food",
    price: 2,
    location: "Cafe",
    datetime: "2024-05-03T15:00:00Z",
  },
];

describe("useFilterSort", () => {
  it("возвращает все расходы без фильтров", () => {
    const { result } = renderHook(() => useFilterSort(mockExpenses));

    expect(result.current.filteredExpenses).toHaveLength(3);
    expect(result.current.sortedExpenses[0].id).toBe(3); // сортировка по datetime desc по умолчанию
  });

  it("фильтрует по дате", () => {
    const { result } = renderHook(() => useFilterSort(mockExpenses));

    act(() => {
      result.current.handleFilters({
        ...result.current.filters,
        startDate: new Date("2024-05-01T00:00:00Z"),
      });
    });

    expect(result.current.filteredExpenses).toHaveLength(2);
    expect(result.current.filteredExpenses.map(e => e.id)).toEqual([1, 3]);
  });

  it("фильтрует по цене", () => {
    const { result } = renderHook(() => useFilterSort(mockExpenses));

    act(() => {
      result.current.handleFilters({
        ...result.current.filters,
        minPrice: 3,
        maxPrice: 15,
      });
    });

    expect(result.current.filteredExpenses.map(e => e.id)).toEqual([1, 2]);
  });

  it("фильтрует по ключевым словам (title/category/location)", () => {
    const { result } = renderHook(() => useFilterSort(mockExpenses));

    act(() => {
      result.current.handleFilters({
        ...result.current.filters,
        keywords: ["cafe"],
      });
    });

    expect(result.current.filteredExpenses.map(e => e.id)).toEqual([1, 3]);
  });

  it("сортирует по цене asc", () => {
    const { result } = renderHook(() => useFilterSort(mockExpenses));

    act(() => {
      result.current.handleSortApply({
        field: "price",
        direction: "asc",
      });
    });

    expect(result.current.sortedExpenses.map(e => e.price)).toEqual([2, 3, 15]);
  });

  it("сортирует по заголовку desc", () => {
    const { result } = renderHook(() => useFilterSort(mockExpenses));

    act(() => {
      result.current.handleSortApply({
        field: "title",
        direction: "desc",
      });
    });

    expect(result.current.sortedExpenses.map(e => e.title))
      .toEqual(["Tea", "Coffee", "Book"]);
  });

  it("позволяет напрямую изменять filters и sortParams", () => {
    const { result } = renderHook(() => useFilterSort(mockExpenses));

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        keywords: ["book"],
      });
    });

    expect(result.current.filteredExpenses.map(e => e.id)).toEqual([2]);

    act(() => {
      result.current.setSortParams({
        field: "price",
        direction: "desc",
      });
    });

    expect(result.current.sortedExpenses[0].price).toBe(15);
  });

  it("применяет фильтры и сортировку одновременно", () => {
    const { result } = renderHook(() => useFilterSort(mockExpenses));

    act(() => {
      result.current.handleFilters({
        ...result.current.filters,
        keywords: ["food"],
      });
      result.current.handleSortApply({
        field: "price",
        direction: "asc",
      });
    });

    expect(result.current.filteredExpenses.map(e => e.id)).toEqual([1, 3]);
    expect(result.current.sortedExpenses.map(e => e.price)).toEqual([2, 3]);
  });
});
