// useSelection.test.ts
import { renderHook, act } from "@testing-library/react";
import type { Expense } from "../../types";
import { describe, expect, it, vi } from "vitest";
import { useSelection } from "../../hooks/useSelection";

const expenses: Expense[] = [
  { id: 1, title: "Кофе", category: { id: 1, name: "Еда" }, price: 5, location: { id: 1, name: "Кафе" }, datetime: "2025-01-01" },
  { id: 2, title: "Книга", category: { id: 2, name: "Образование" }, price: 15, location: { id: 2, name: "Магазин" }, datetime: "2025-01-02" },
  { id: 3, title: "Автобус", category: { id: 3, name: "Транспорт" }, price: 2, location: { id: 3, name: "Станция" }, datetime: "2025-01-03" },
];

describe("useSelection", () => {
  it("handleLongPress включает режим выбора и добавляет id", () => {
    const { result } = renderHook(() => useSelection(expenses));

    act(() => {
      result.current.handleLongPress(1);
    });

    expect(result.current.selectionMode).toBe(true);
    expect(result.current.selectedIds).toEqual([1]);
  });

  it("handleSelect добавляет и убирает id (toggle)", () => {
    const { result } = renderHook(() => useSelection(expenses));

    act(() => {
      result.current.handleSelect(1);
    });
    expect(result.current.selectedIds).toEqual([1]);

    act(() => {
      result.current.handleSelect(1);
    });
    expect(result.current.selectedIds).toEqual([]);
  });

  it("handleDeleteSelected вызывает removeFn и очищает состояние", async () => {
    const removeFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useSelection(expenses));

    act(() => {
      result.current.handleSelect(1);
      result.current.handleSelect(2);
    });

    expect(result.current.selectedIds).toEqual([1, 2]);

    await act(async () => {
      await result.current.handleDeleteSelected(removeFn);
    });

    expect(removeFn).toHaveBeenCalledWith([1, 2]);
    expect(result.current.selectionMode).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  it("handleCancelSelection сбрасывает выделение и режим", () => {
    const { result } = renderHook(() => useSelection(expenses));

    act(() => {
      result.current.handleSelect(1);
      result.current.handleSelect(2);
      result.current.handleCancelSelection();
    });

    expect(result.current.selectionMode).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  it("handleSelectAll выделяет все элементы", () => {
    const { result } = renderHook(() => useSelection(expenses));

    act(() => {
      result.current.handleSelectAll();
    });
    expect(result.current.selectedIds).toEqual([1, 2, 3]);

    act(() => {
      result.current.handleSelectAll();
    });
    expect(result.current.selectedIds).toEqual([]);
  });
});
